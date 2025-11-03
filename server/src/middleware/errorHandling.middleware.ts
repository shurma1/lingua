import type { Request, Response, NextFunction } from 'express';
import { ApiError } from "../error/apiError";
import logger from "../utils/logger";

export const errorHandlingMiddleware = (err: Error, req: Request, res: Response, _next: NextFunction) => {
	logger.error(err);
	if(err instanceof ApiError){
		return res.status(err.code).json({
			type: err.type,
			message: err.message,
		});
	}

	res.status(500).json({
		type: 'UNKNOWN_ERROR',
		description: 'Something went wrong',
	});
};
