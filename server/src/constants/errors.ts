const API_ERROR = {
	BAD_REQUEST: {
		type: 'BAD_REQUEST',
		description: 'Bad request.',
		code: 400,
	},
	UNAUTHORIZED: {
		type: 'UNAUTHORIZED',
		description: 'Unauthorized.',
		code: 401,
	},
	NOT_FOUND: {
		type: 'NOT_FOUND',
		description: 'Not found.',
		code: 404,
	},
	INTERNAL_SERVER_ERROR: {
		type: 'INTERNAL_SERVER_ERROR',
		description: 'Internal server error.',
		code: 500,
	},
};

type ErrorKeys = keyof typeof API_ERROR;

export {
	API_ERROR,
	ErrorKeys
};
