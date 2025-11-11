export interface CreateQuestMatchWordsData {
	type: 'MATCH_WORDS';
	levelId: number;
	word: string;
	translate: string;
}

export interface CreateQuestDictationData {
	type: 'DICTATION';
	levelId: number;
	correctSentence: string;
	correctWords: string[];
	distractorWords?: string[];
}

export interface CreateQuestTranslateData {
	type: 'TRANSLATE';
	levelId: number;
	sourceSentence: string;
	correctSentence: string;
	correctWords: string[];
	distractorWords?: string[];
}

export type CreateQuestData =
	| CreateQuestMatchWordsData
	| CreateQuestDictationData
	| CreateQuestTranslateData;
