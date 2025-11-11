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
	name: string;
	questsCount: number;
	userProgress?: UserProgressDTO | null;
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
	id: number;
	value: string;
	audioUrl?: string;
}

export interface QuestMatchWordsDTO {
	id: number;
	questId: number;
	word: string;
	translate: string;
}

export interface QuestDictationDTO {
	id: number;
	questId: number;
	audioUrl?: string;
	correctSentence: string;
	words: WordDTO[];
}

export interface QuestTranslateDTO {
	id: number;
	questId: number;
	sourceSentence: string;
	correctSentence: string;
	words: WordDTO[];
}

export type QuestType = "MATCH_WORDS" | "DICTATION" | "TRANSLATE";

export interface QuestDTO {
	id: number;
	type: QuestType;
	levelId: number;
	data?: QuestMatchWordsDTO | QuestDictationDTO | QuestTranslateDTO;
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
	name: string;
	questsCount: number;
}

export interface UpdateLevelRequestDTO {
	name?: string;
	questsCount?: number;
}

export interface CreateQuestMatchWordsRequestDTO {
	type: "MATCH_WORDS";
	levelId: number;
	word: string;
	translate: string;
}

export interface CreateQuestDictationRequestDTO {
	type: "DICTATION";
	levelId: number;
	correctSentence: string;
	correctWords: string[];
	distractorWords?: string[];
}

export interface CreateQuestTranslateRequestDTO {
	type: "TRANSLATE";
	levelId: number;
	sourceSentence: string;
	correctSentence: string;
	correctWords: string[];
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
