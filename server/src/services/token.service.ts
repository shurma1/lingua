import jwt from 'jsonwebtoken';
import { config } from '../config';
import logger from '../utils/logger';
import { TokenDTO } from '../dtos';
import { ApiError } from '../error/apiError';

interface IPayload {
	userId: number;
}

class TokenService {
	public GenerateTokens(payload: IPayload): TokenDTO {
		const accessToken = jwt.sign(payload, config.auth.jwtSecret, {
			expiresIn: config.auth.jwtExpiresIn
		} as jwt.SignOptions);
		return new TokenDTO(accessToken);
	}

	public ValidateAccessToken(token: string): IPayload {
		try {
			return this.ValidateToken(token, config.auth.jwtSecret);
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
}

export default new TokenService();
