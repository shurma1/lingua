import type { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import type { JwtPayload } from '../types';
import logger from '../utils/logger';
import {ApiError} from "../error/apiError";

// Module augmentation instead of namespace
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			throw ApiError.errorByType('UNAUTHORIZED');
		}

		const token = authHeader.startsWith('Bearer ')
			? authHeader.substring(7)
			: authHeader;

		const decoded = authService.verifyToken(token);

		if (!decoded) {
			throw ApiError.errorByType('UNAUTHORIZED');
		}
	
		req.user = decoded;
		next();
	} catch (error) {
		next(error);
	}
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			next();
			return;
		}

		const token = authHeader.startsWith('Bearer ')
			? authHeader.substring(7)
			: authHeader;

		const decoded = authService.verifyToken(token);

		if (decoded) {
			req.user = decoded;
		}

		next();
	} catch (error) {
		logger.error('Optional auth middleware error:', error);
		next();
	}
};
