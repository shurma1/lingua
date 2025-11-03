import jwt from 'jsonwebtoken';
import { config } from '../config';
import logger from '../utils/logger';
import { addTimeToCurrentDate } from '../utils/addTimeStringToDate';
import { TokenDTO } from '../dtos/token.dto';
import { ApiError } from '../error/apiError';
import { UserTokens } from '../models';

interface IPayload {
	userId: number;
}

class TokenService {
	public GenerateTokens(payload: IPayload): TokenDTO {
		const accessToken = jwt.sign(payload, config.auth.jwtSecret, {
			expiresIn: config.auth.jwtExpiresIn
		} as jwt.SignOptions);
		const refreshToken = jwt.sign(payload, config.auth.jwtRefreshSecret, {
			expiresIn: config.auth.jwtRefreshExpiresIn
		} as jwt.SignOptions);
		return new TokenDTO(accessToken, refreshToken);
	}

	public ValidateAccessToken(token: string): IPayload {
		try {
			return this.ValidateToken(token, config.auth.jwtSecret);
		} catch {
			throw ApiError.errorByType('UNAUTHORIZED');
		}
	}

	public ValidateRefreshToken(token: string): IPayload {
		try {
			return this.ValidateToken(token, config.auth.jwtRefreshSecret);
		} catch {
			throw ApiError.errorByType('UNAUTHORIZED');
		}
	}

	private ValidateToken(token: string, secret: string): IPayload {
		try {
			return jwt.verify(token, secret) as IPayload;
		} catch (e) {
			logger.error('Token validation error: ' + e);
			throw new Error();
		}
	}

	public async SaveToken(userId: number, refreshToken: string, oldRefreshToken?: string): Promise<void> {
		// If replacing token during refresh, delete the old one
		if (oldRefreshToken) {
			await UserTokens.destroy({
				where: {
					userId: userId,
					token: oldRefreshToken,
				},
			});
		}
		
		// Create new token record
		await UserTokens.create({
			userId: userId,
			token: refreshToken,
			expiredAt: addTimeToCurrentDate(new Date(), config.auth.jwtRefreshExpiresIn)
		});
	}

	public async RemoveToken(refreshToken: string): Promise<void> {
		await UserTokens.destroy({
			where: {
				token: refreshToken,
			},
		});
	}

	public async FindToken(refreshToken: string): Promise<UserTokens | null> {
		const tokenData = await UserTokens.findOne({
			where: {
				token: refreshToken,
			},
		});

		return tokenData;
	}

	public async CleanupExpiredTokens(): Promise<number> {
		const { Op } = await import('sequelize');
		const result = await UserTokens.destroy({
			where: {
				expiredAt: {
					[Op.lt]: new Date(),
				},
			},
		});
		logger.info(`Cleaned up ${result} expired tokens`);
		return result;
	}
}

export default new TokenService();
