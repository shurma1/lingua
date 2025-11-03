import type { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { ApiError } from '../error/apiError';

class AuthController {
	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { initData } = req.body;

			if (!initData) {
				throw ApiError.errorByType('BAD_REQUEST');
			}

			const authResponse = await authService.authenticate(initData);

			res.cookie('refreshToken', authResponse.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
			});

			return res.json({
				accessToken: authResponse.accessToken,
				user: authResponse.user,
			});
		} catch (error) {
			next(error);
		}
	}

	async refresh(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies;

			if (!refreshToken) {
				throw ApiError.errorByType('UNAUTHORIZED');
			}

			const tokens = await authService.refresh(refreshToken);

			res.cookie('refreshToken', tokens.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
			});

			return res.json({ accessToken: tokens.accessToken });
		} catch (error) {
			next(error);
		}
	}

	async logout(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies;

			if (refreshToken) {
				await authService.logout(refreshToken);
			}

			res.clearCookie('refreshToken');
			return res.json({ message: 'Logged out successfully' });
		} catch (error) {
			next(error);
		}
	}

	async getMe(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.user) {
				throw ApiError.errorByType('UNAUTHORIZED');
			}

			const userProfile = await authService.getProfile(req.user.userId);
			return res.json(userProfile);
		} catch (error) {
			next(error);
		}
	}
}

export default new AuthController();
