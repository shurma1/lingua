import type {ErrorKeys} from '../constants/errors';
import { API_ERROR} from '../constants/errors';

export class ApiError extends Error {
	code: number;
	type: string;
	message: string;
	
	constructor(code: number, type: string, message: string) {
		super();
		this.code = code;
		this.type = type;
		this.message = message;
	}

	static errorByType(type: ErrorKeys){
		const error = API_ERROR[type];
		return new ApiError(error.code, error.type, error.description);
	}
}
