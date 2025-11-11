const API_ERROR = {
	NOT_FOUND: {
		type: 'NOT_FOUND',
		description: 'Not found.',
		code: 404,
	},
	BAD_REQUEST: {
		type: 'BAD_REQUEST',
		description: 'Bad request.',
		code: 400,
	},
	INTERNAL_SERVER_ERROR: {
		type: 'INTERNAL_SERVER_ERROR',
		description: 'Internal error',
		code: 500,
	},
	UNAUTHORIZED: {
		type: 'UNAUTHORIZED',
		description: 'Unauthorized.',
		code: 401,
	},
	FORBIDDEN: {
		type: 'FORBIDDEN',
		description: 'Forbidden.',
		code: 403,
	},
	USER_NOT_FOUND: {
		type: 'USER_NOT_FOUND',
		description: 'User not found.',
		code: 404,
	},
	ADMIN_REQUIRED: {
		type: 'ADMIN_REQUIRED',
		description: 'Admin access required.',
		code: 403,
	},
	// Friends
	FRIEND_NOT_FOUND: {
		type: 'FRIEND_NOT_FOUND',
		description: 'Friend not found.',
		code: 404,
	},
	INVITE_NOT_FOUND: {
		type: 'INVITE_NOT_FOUND',
		description: 'Invite not found.',
		code: 404,
	},
	ALREADY_FRIENDS: {
		type: 'ALREADY_FRIENDS',
		description: 'Users are already friends.',
		code: 400,
	},
	CANNOT_ACCEPT_OWN_INVITE: {
		type: 'CANNOT_ACCEPT_OWN_INVITE',
		description: 'Cannot accept your own invite.',
		code: 400,
	},
	// Stats
	INVALID_LEADERBOARD_TYPE: {
		type: 'INVALID_LEADERBOARD_TYPE',
		description: 'Invalid leaderboard type.',
		code: 400,
	},
	// Modules
	MODULE_NOT_FOUND: {
		type: 'MODULE_NOT_FOUND',
		description: 'Module not found.',
		code: 404,
	},
	MODULE_ALREADY_EXISTS: {
		type: 'MODULE_ALREADY_EXISTS',
		description: 'Module already exists.',
		code: 400,
	},
	// Levels
	LEVEL_NOT_FOUND: {
		type: 'LEVEL_NOT_FOUND',
		description: 'Level not found.',
		code: 404,
	},
	INVALID_QUESTS_COUNT: {
		type: 'INVALID_QUESTS_COUNT',
		description: 'Invalid quests count.',
		code: 400,
	},
	INVALID_SCORE: {
		type: 'INVALID_SCORE',
		description: 'Invalid score. Must be between 0 and 100.',
		code: 400,
	},
	// Quests
	QUEST_NOT_FOUND: {
		type: 'QUEST_NOT_FOUND',
		description: 'Quest not found.',
		code: 404,
	},
	INVALID_QUEST_TYPE: {
		type: 'INVALID_QUEST_TYPE',
		description: 'Invalid quest type.',
		code: 400,
	},
	// Media
	MEDIA_NOT_FOUND: {
		type: 'MEDIA_NOT_FOUND',
		description: 'Media not found.',
		code: 404,
	},
	// Lessons
	LESSON_NOT_FOUND: {
		type: 'LESSON_NOT_FOUND',
		description: 'Lesson not found.',
		code: 404,
	},
	LESSON_ALREADY_EXISTS: {
		type: 'LESSON_ALREADY_EXISTS',
		description: 'Lesson already exists for this module.',
		code: 400,
	},
	// Languages
	LANGUAGE_NOT_FOUND: {
		type: 'LANGUAGE_NOT_FOUND',
		description: 'Language not found.',
		code: 404,
	},
	LANGUAGE_ALREADY_EXISTS: {
		type: 'LANGUAGE_ALREADY_EXISTS',
		description: 'Language already exists.',
		code: 400,
	},
};

type ErrorKeys = keyof typeof API_ERROR;

export {
	API_ERROR,
	ErrorKeys
};
