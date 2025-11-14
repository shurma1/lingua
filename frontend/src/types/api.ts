// API DTOs based on Swagger documentation

export interface UserDTO {
	id: number;
	externalId: number;
	username: string;
	firstName?: string;
	lastName?: string;
	photoUrl?: string;
	stars: number;
	exp: number;
	role: "user" | "admin";
	languageId?: number;
	createdAt: string;
	lastLoginAt?: string;
}

export interface AuthResponseDTO {
	accessToken: string;
	user: UserDTO;
}

export interface FriendDTO {
	userId: number;
	username: string;
	firstName?: string;
	lastName?: string;
	photoUrl?: string;
	stars: number;
	exp: number;
}

export interface FriendInviteDTO {
	inviteId: number;
	userId: number;
	createdAt: string;
}

export interface FriendshipDTO {
	id: number;
	user1Id: number;
	user2Id: number;
	createdAt: string;
}

export interface LanguageDTO {
	id: number;
	name: string;
	icon?: string;
}

export interface LeaderboardEntryDTO {
	position: number;
	userId: number;
	username: string;
	firstName?: string;
	lastName?: string;
	photoUrl?: string;
	stars: number;
}

export interface LeaderboardDTO {
	leaders: LeaderboardEntryDTO[];
	currentUser: LeaderboardEntryDTO;
}

export interface LessonDTO {
	id: number;
	moduleId: number;
	title: string;
	text: string;
}

export interface UserProgressDTO {
	questsCount: number;
	score: number;
}

export interface LevelDTO {
	id: number;
	moduleId: number;
	icon: string;
	questsCount: number;
	userProgress?: UserProgressDTO;
}

export interface MediaDTO {
	mediaId: number;
	filename: string;
	mimetype?: string;
	duration?: number;
	fileSize?: number;
	url: string;
	createdAt: string;
}

export interface ModuleDTO {
	id: number;
	languageId: number;
	name: string;
	icon?: string;
}

export interface WordDTO {
	id: string;
	value: string;
	mediaId?: string;
}

export interface MatchWordPairDTO {
	word: string;
	translate: string;
}

export type QuestType = "MATCH_WORDS" | "DICTATION" | "TRANSLATE";

// Full quest responses (GET /api/quests/{questId})
export interface QuestMatchWordsDTO {
	id: string;
	type: "MATCH_WORDS";
	levelId: string;
	match_words: MatchWordPairDTO[];
}

export interface QuestDictationDTO {
	id: string;
	type: "DICTATION";
	levelId: string;
	mediaId?: string;
	correctSentence: string;
	words: WordDTO[];
}

export interface QuestTranslateDTO {
	id: string;
	type: "TRANSLATE";
	levelId: string;
	sourceSentence: string;
	correctSentence: string;
	words: WordDTO[];
}

export type QuestFullDTO = QuestMatchWordsDTO | QuestDictationDTO | QuestTranslateDTO;

// Lightweight quest list item (GET /api/levels/{levelId}/quests)
export interface QuestDTO {
	id: number;
	type: QuestType;
	levelId: number;
}

// Request DTOs
export interface AuthRequestDTO {
	initData: string;
}

export interface SetLanguageRequestDTO {
	languageId: number;
}

export interface SubmitLevelRequestDTO {
	score: number;
}

export interface CreateLanguageRequestDTO {
	name: string;
	icon?: string;
}

export interface UpdateLanguageRequestDTO {
	name?: string;
	icon?: string;
}

export interface CreateModuleRequestDTO {
	languageId: number;
	name: string;
	icon?: string;
}

export interface UpdateModuleRequestDTO {
	name?: string;
	icon?: string;
}

export interface CreateLessonRequestDTO {
	title: string;
	text: string;
}

export interface UpdateLessonRequestDTO {
	title?: string;
	text?: string;
}

export interface CreateLevelRequestDTO {
	moduleId: number;
	icon: string;
}

export interface UpdateLevelRequestDTO {
	moduleId?: number;
	icon?: string;
}

// Quest creation request DTOs
export interface CreateQuestMatchWordsRequestDTO {
	type: "MATCH_WORDS";
	levelId: number;
	data: MatchWordPairDTO[];
}

export interface CreateQuestDictationRequestDTO {
	type: "DICTATION";
	levelId: number;
	correctSentence: string;
	distractorWords?: string[];
}

export interface CreateQuestTranslateRequestDTO {
	type: "TRANSLATE";
	levelId: number;
	sourceSentence: string;
	correctSentence: string;
	distractorWords?: string[];
}

export type CreateQuestRequestDTO =
	| CreateQuestMatchWordsRequestDTO
	| CreateQuestDictationRequestDTO
	| CreateQuestTranslateRequestDTO;

export type LeaderboardType = "all" | "friends";

// Response DTOs
export interface SubmitLevelResponseDTO {
	stars: number;
	exp: number;
}
