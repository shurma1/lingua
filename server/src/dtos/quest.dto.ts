import type { Quest } from '../models/entities/Quest';
import type { QuestMatchWords } from '../models/entities/QuestMatchWords';
import type { QuestDictation } from '../models/entities/QuestDictation';
import type { QuestTranslate } from '../models/entities/QuestTranslate';
import type { QuestType } from '../models/types/QuestType';

/**
 * @openapi
 * components:
 *   schemas:
 *     QuestMatchWordsDTO:
 *       type: object
 *       required:
 *         - id
 *         - questId
 *         - word
 *         - translate
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         questId:
 *           type: integer
 *           example: 1
 *         word:
 *           type: string
 *           example: hello
 *         translate:
 *           type: string
 *           example: привет
 *     WordDTO:
 *       type: object
 *       required:
 *         - id
 *         - value
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         value:
 *           type: string
 *           example: hello
 *         audioUrl:
 *           type: string
 *           example: /media/audio_1.wav
 *     QuestDictationDTO:
 *       type: object
 *       required:
 *         - id
 *         - questId
 *         - correctSentence
 *         - words
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         questId:
 *           type: integer
 *           example: 1
 *         audioUrl:
 *           type: string
 *           example: /media/audio_1.wav
 *         correctSentence:
 *           type: string
 *           example: I like tea
 *         words:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WordDTO'
 *     QuestTranslateDTO:
 *       type: object
 *       required:
 *         - id
 *         - questId
 *         - sourceSentence
 *         - correctSentence
 *         - words
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         questId:
 *           type: integer
 *           example: 1
 *         sourceSentence:
 *           type: string
 *           example: Я люблю чай
 *         correctSentence:
 *           type: string
 *           example: I like tea
 *         words:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WordDTO'
 *     QuestDTO:
 *       type: object
 *       required:
 *         - id
 *         - type
 *         - levelId
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         type:
 *           type: string
 *           enum: [MATCH_WORDS, DICTATION, TRANSLATE]
 *           example: MATCH_WORDS
 *         levelId:
 *           type: integer
 *           example: 1
 *         data:
 *           oneOf:
 *             - $ref: '#/components/schemas/QuestMatchWordsDTO'
 *             - $ref: '#/components/schemas/QuestDictationDTO'
 *             - $ref: '#/components/schemas/QuestTranslateDTO'
 */

export class WordDTO {
	id: number;
	value: string;
	audioUrl?: string;

	constructor(word: { id: number; value: string; audioMediaId?: number | null }) {
		this.id = word.id;
		this.value = word.value;
		this.audioUrl = word.audioMediaId ? `/media/${word.audioMediaId}` : undefined;
	}
}

export class QuestMatchWordsDTO {
	id: number;
	questId: number;
	word: string;
	translate: string;

	constructor(data: QuestMatchWords) {
		this.id = data.id;
		this.questId = data.questId;
		this.word = data.word;
		this.translate = data.translate;
	}
}

export class QuestDictationDTO {
	id: number;
	questId: number;
	audioUrl?: string;
	correctSentence: string;
	words: WordDTO[];

	constructor(
		data: QuestDictation,
		correctSentence: string,
		words: Array<{ id: number; value: string; audioMediaId?: number | null }>
	) {
		this.id = data.id;
		this.questId = data.questId;
		this.audioUrl = data.audioMediaId ? `/media/${data.audioMediaId}` : undefined;
		this.correctSentence = correctSentence;
		this.words = words.map(w => new WordDTO(w));
	}
}

export class QuestTranslateDTO {
	id: number;
	questId: number;
	sourceSentence: string;
	correctSentence: string;
	words: WordDTO[];

	constructor(
		data: QuestTranslate,
		correctSentence: string,
		words: Array<{ id: number; value: string; audioMediaId?: number | null }>
	) {
		this.id = data.id;
		this.questId = data.questId;
		this.sourceSentence = data.sourceSentence;
		this.correctSentence = correctSentence;
		this.words = words.map(w => new WordDTO(w));
	}
}

export class QuestDTO {
	id: number;
	type: QuestType;
	levelId: number;
	data?: QuestMatchWordsDTO | QuestDictationDTO | QuestTranslateDTO;

	constructor(
		quest: Quest,
		data?: QuestMatchWordsDTO | QuestDictationDTO | QuestTranslateDTO
	) {
		this.id = quest.id;
		this.type = quest.type;
		this.levelId = quest.levelId;
		this.data = data;
	}

	static fromQuest(
		quest: Quest,
		data?: QuestMatchWordsDTO | QuestDictationDTO | QuestTranslateDTO
	): QuestDTO {
		return new QuestDTO(quest, data);
	}
}
