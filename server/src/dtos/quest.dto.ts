import type { Quest } from '../models/entities/Quest';
import type { QuestMatchWords } from '../models/entities/QuestMatchWords';
import type { QuestDictation } from '../models/entities/QuestDictation';
import type { QuestTranslate } from '../models/entities/QuestTranslate';
import type { QuestType } from '../models/types/QuestType';

/**
 * @openapi
 * components:
 *   schemas:
 *     MatchWordPairDTO:
 *       type: object
 *       required:
 *         - word
 *         - translate
 *       properties:
 *         word:
 *           type: string
 *           example: Привет
 *         translate:
 *           type: string
 *           example: Hello
 *     WordDTO:
 *       type: object
 *       required:
 *         - id
 *         - value
 *       properties:
 *         id:
 *           type: string
 *           example: "1"
 *         value:
 *           type: string
 *           example: hello
 *         mediaId:
 *           type: string
 *           example: "1"
 *     QuestMatchWordsResponse:
 *       type: object
 *       required:
 *         - id
 *         - type
 *         - levelId
 *         - match_words
 *       properties:
 *         id:
 *           type: string
 *           example: "4"
 *         type:
 *           type: string
 *           enum: [MATCH_WORDS]
 *           example: MATCH_WORDS
 *         levelId:
 *           type: string
 *           example: "1"
 *         match_words:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MatchWordPairDTO'
 *     QuestDictationResponse:
 *       type: object
 *       required:
 *         - id
 *         - type
 *         - levelId
 *         - correctSentence
 *         - words
 *       properties:
 *         id:
 *           type: string
 *           example: "2"
 *         type:
 *           type: string
 *           enum: [DICTATION]
 *           example: DICTATION
 *         levelId:
 *           type: string
 *           example: "1"
 *         mediaId:
 *           type: string
 *           example: "10"
 *         correctSentence:
 *           type: string
 *           example: "a b c"
 *         words:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WordDTO'
 *     QuestTranslateResponse:
 *       type: object
 *       required:
 *         - id
 *         - type
 *         - levelId
 *         - sourceSentence
 *         - correctSentence
 *         - words
 *       properties:
 *         id:
 *           type: string
 *           example: "3"
 *         type:
 *           type: string
 *           enum: [TRANSLATE]
 *           example: TRANSLATE
 *         levelId:
 *           type: string
 *           example: "1"
 *         sourceSentence:
 *           type: string
 *           example: "Привет, меня зовут дима"
 *         correctSentence:
 *           type: string
 *           example: "Hello, my name is dima"
 *         words:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WordDTO'
 */

export class WordDTO {
	id: string;
	value: string;
	mediaId?: string;

	constructor(word: { id: number; value: string; audioMediaId?: number | null }) {
		this.id = word.id.toString();
		this.value = word.value;
		if (word.audioMediaId) {
			this.mediaId = word.audioMediaId.toString();
		}
	}
}

export class MatchWordPairDTO {
	word: string;
	translate: string;

	constructor(word: string, translate: string) {
		this.word = word;
		this.translate = translate;
	}
}

// Response DTO for MATCH_WORDS quest
export class QuestMatchWordsResponseDTO {
	id: string;
	type: 'MATCH_WORDS';
	levelId: string;
	match_words: MatchWordPairDTO[];

	constructor(quest: Quest, matchWords: QuestMatchWords[]) {
		this.id = quest.id.toString();
		this.type = 'MATCH_WORDS';
		this.levelId = quest.levelId.toString();
		this.match_words = matchWords.map(mw => new MatchWordPairDTO(mw.word, mw.translate));
	}
}

// Response DTO for DICTATION quest
export class QuestDictationResponseDTO {
	id: string;
	type: 'DICTATION';
	levelId: string;
	mediaId?: string;
	correctSentence: string;
	words: WordDTO[];

	constructor(
		quest: Quest,
		data: QuestDictation,
		correctSentence: string,
		words: Array<{ id: number; value: string; audioMediaId?: number | null }>
	) {
		this.id = quest.id.toString();
		this.type = 'DICTATION';
		this.levelId = quest.levelId.toString();
		if (data.audioMediaId) {
			this.mediaId = data.audioMediaId.toString();
		}
		this.correctSentence = correctSentence;
		this.words = words.map(w => new WordDTO(w));
	}
}

// Response DTO for TRANSLATE quest
export class QuestTranslateResponseDTO {
	id: string;
	type: 'TRANSLATE';
	levelId: string;
	sourceSentence: string;
	correctSentence: string;
	words: WordDTO[];

	constructor(
		quest: Quest,
		data: QuestTranslate,
		correctSentence: string,
		words: Array<{ id: number; value: string; audioMediaId?: number | null }>
	) {
		this.id = quest.id.toString();
		this.type = 'TRANSLATE';
		this.levelId = quest.levelId.toString();
		this.sourceSentence = data.sourceSentence;
		this.correctSentence = correctSentence;
		this.words = words.map(w => new WordDTO(w));
	}
}

export type QuestResponseDTO = QuestMatchWordsResponseDTO | QuestDictationResponseDTO | QuestTranslateResponseDTO;

// For listing quests (without full details)
export class QuestDTO {
	id: number;
	type: QuestType;
	levelId: number;

	constructor(quest: Quest) {
		this.id = quest.id;
		this.type = quest.type;
		this.levelId = quest.levelId;
	}

	static fromQuest(quest: Quest): QuestDTO {
		return new QuestDTO(quest);
	}
}
