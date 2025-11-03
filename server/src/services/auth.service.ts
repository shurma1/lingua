import crypto from 'crypto';
import { User } from '../models/entities/User';
import { config } from '../config';
import type { InitData, JwtPayload } from '../types';
import logger from '../utils/logger';
import { ApiError } from "../error/apiError";
import tokenService from './token.service';
import { UserDTO } from '../dtos/user.dto';
import { AuthResponseDTO } from '../dtos/authResponse.dto';
import { RefreshResponseDTO } from '../dtos/refreshResponse.dto';

export class AuthService {
	validateBotInitData(initDataString: string): InitData {
		const botToken = config.auth.botToken;
		if (!botToken) {
		  throw ApiError.errorByType('INTERNAL_SERVER_ERROR');
		}
	  
		const params = new URLSearchParams(decodeURIComponent(initDataString));
		const hash = params.get('hash');
      
		if (!hash) {
			throw ApiError.errorByType('BAD_REQUEST');
		}
	  
		const dataCheckArr: string[] = [];
		params.forEach((value, key) => {
			if (key !== 'hash') {
				dataCheckArr.push(`${key}=${value}`);
			}
		});
		dataCheckArr.sort();
		const dataCheckString = dataCheckArr.join('\n');
	  
		const secretKey = crypto
			.createHmac('sha256', 'WebAppData')
			.update(botToken)
			.digest();
	  
		const computedHash = crypto
			.createHmac('sha256', secretKey)
			.update(dataCheckString)
			.digest('hex');
	  
		if (computedHash !== hash) {
			throw ApiError.errorByType('UNAUTHORIZED');
		}
	  
      
		const userStr = params.get('user');
		const user = userStr ? JSON.parse(userStr) : undefined;

		return {
			user,
			hash,
			query_id: params.get('query_id') || undefined,
		};
	}

  
	async authenticate(initDataString: string): Promise<AuthResponseDTO> {
		const initData = this.validateBotInitData(initDataString);
		if (!initData.user) {
			throw new Error('Invalid authentication data');
		}

		const appUser = initData.user;

		let user = await User.findOne({
			where: { maxUserId: appUser.id },
		});

		if (!user) {
			user = await User.create({
				maxUserId: appUser.id,
				username: appUser.username || `user_${appUser.id}`,
				firstName: appUser.first_name,
				lastName: appUser.last_name,
				photoUrl: appUser.photo_url,
				stars: 0,
				exp: 0,
				lastLoginAt: new Date(),
			});
			logger.info(`New user created: ${user.id} (External ID: ${appUser.id})`);
		} else {
			await user.update({
				lastLoginAt: new Date(),
				photoUrl: appUser.photo_url || user.photoUrl,
				firstName: appUser.first_name || user.firstName,
				lastName: appUser.last_name || user.lastName,
			});
		}

		const tokens = tokenService.GenerateTokens({ userId: user.id });

		await tokenService.SaveToken(user.id, tokens.refreshToken);

		const userDTO = UserDTO.fromUser(user);

		return new AuthResponseDTO(tokens.accessToken, tokens.refreshToken, userDTO);
	}

	verifyToken(token: string): JwtPayload | null {
		try {
			const decoded = tokenService.ValidateAccessToken(token);
			return decoded as JwtPayload;
		} catch (error) {
			logger.warn('Invalid JWT token:', error);
			return null;
		}
	}

	async refresh(refreshToken: string): Promise<RefreshResponseDTO> {
		if (!refreshToken) {
			throw ApiError.errorByType('UNAUTHORIZED');
		}

		const userData = tokenService.ValidateRefreshToken(refreshToken);
	  
	  if (!userData) {
		  throw ApiError.errorByType('UNAUTHORIZED');
	  }
	
		const tokenFromDb = await tokenService.FindToken(refreshToken);

		if (!tokenFromDb) {
			throw ApiError.errorByType('UNAUTHORIZED');
		}
	
		const user = await User.findByPk(userData.userId);

		if (!user) {
			throw ApiError.errorByType('UNAUTHORIZED');
		}

		const tokens = tokenService.GenerateTokens({ userId: user.id });
    
		// Delete old refresh token and save new one
		await tokenService.SaveToken(user.id, tokens.refreshToken, refreshToken);

		return new RefreshResponseDTO(tokens.accessToken, tokens.refreshToken);
	}

	async getProfile(userId: number): Promise<UserDTO> {
		const user = await User.findByPk(userId);
    
		if (!user) {
			throw ApiError.errorByType('NOT_FOUND');
		}

		return UserDTO.fromUser(user);
	}

	async logout(token: string): Promise<void> {
		await tokenService.RemoveToken(token);
	}

	async cleanupExpiredTokens(): Promise<number> {
		return await tokenService.CleanupExpiredTokens();
	}
}

export default new AuthService();
