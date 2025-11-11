import { Quest } from '../models/entities/Quest';
import { QuestMatchWords } from '../models/entities/QuestMatchWords';
import { QuestDictation } from '../models/entities/QuestDictation';
import { QuestTranslate } from '../models/entities/QuestTranslate';
import { Level } from '../models/entities/Level';
import { Sentence } from '../models/entities/Sentence';
import { SentenceWords } from '../models/entities/SentenceWords';
import { Words } from '../models/entities/Words';
import { Distractor } from '../models/entities/Distractor';
import { DistractorWords } from '../models/entities/DistractorWords';
import { QuestType } from '../models/types/QuestType';
import { ApiError } from '../error/apiError';
import type { CreateQuestData } from '../types/quest';
import { QuestDTO, QuestMatchWordsDTO, QuestDictationDTO, QuestTranslateDTO } from '../dtos';
import ttsService from './tts.service';
import mediaService from './media.service';
import { Op } from 'sequelize';

class QuestsService {
	/**
	 * Get quests by level
	 */
	async getQuestsByLevel(levelId: number): Promise<QuestDTO[]> {
		const level = await Level.findByPk(levelId);
		if (!level) {
			throw ApiError.errorByType('LEVEL_NOT_FOUND');
		}

		const quests = await Quest.findAll({
			where: { levelId },
			order: [['id', 'ASC']]
		});

		return quests.map(quest => QuestDTO.fromQuest(quest));
	}

	/**
	 * Get quest by ID with full data
	 */
	async getQuestById(questId: number): Promise<QuestDTO> {
		const quest = await Quest.findByPk(questId);
		if (!quest) {
			throw ApiError.errorByType('QUEST_NOT_FOUND');
		}

		let questData;

		switch (quest.type) {
			case 'MATCH_WORDS':
				questData = await this.getMatchWordsData(questId);
				break;
			case 'DICTATION':
				questData = await this.getDictationData(questId);
				break;
			case 'TRANSLATE':
				questData = await this.getTranslateData(questId);
				break;
			default:
				throw ApiError.errorByType('INVALID_QUEST_TYPE');
		}

		return QuestDTO.fromQuest(quest, questData);
	}

	/**
	 * Create a quest (admin only)
	 */
	async createQuest(data: CreateQuestData): Promise<QuestDTO> {
		const level = await Level.findByPk(data.levelId);
		if (!level) {
			throw ApiError.errorByType('LEVEL_NOT_FOUND');
		}

		// Initialize TTS service
		await ttsService.init();

		let quest: Quest;
		let questData;

		switch (data.type) {
			case 'MATCH_WORDS':
				({ quest, questData } = await this.createMatchWordsQuest(data));
				break;
			case 'DICTATION':
				({ quest, questData } = await this.createDictationQuest(data));
				break;
			case 'TRANSLATE':
				({ quest, questData } = await this.createTranslateQuest(data));
				break;
			default:
				throw ApiError.errorByType('INVALID_QUEST_TYPE');
		}

		return QuestDTO.fromQuest(quest, questData);
	}

	/**
	 * Delete a quest (admin only)
	 */
	async deleteQuest(questId: number): Promise<void> {
		const quest = await Quest.findByPk(questId);
		if (!quest) {
			throw ApiError.errorByType('QUEST_NOT_FOUND');
		}

		// Delete associated media based on quest type
		switch (quest.type) {
			case 'DICTATION':
				await this.deleteDictationQuest(questId);
				break;
			case 'TRANSLATE':
				await this.deleteTranslateQuest(questId);
				break;
		}

		// Delete quest (cascade will handle related records)
		await quest.destroy();
	}

	// Private helper methods

	private async getMatchWordsData(questId: number): Promise<QuestMatchWordsDTO> {
		const matchWords = await QuestMatchWords.findOne({
			where: { questId }
		});

		if (!matchWords) {
			throw ApiError.errorByType('QUEST_NOT_FOUND');
		}

		return new QuestMatchWordsDTO(matchWords);
	}

	private async getDictationData(questId: number): Promise<QuestDictationDTO> {
		const dictation = await QuestDictation.findOne({
			where: { questId },
			include: [
				{
					model: Sentence,
					as: 'correctSentence',
					include: [
						{
							model: SentenceWords,
							as: 'sentenceWords',
							include: [
								{
									model: Words,
									as: 'word'
								}
							]
						}
					]
				},
				{
					model: Distractor,
					as: 'distractor',
					include: [
						{
							model: DistractorWords,
							as: 'distractorWords',
							include: [
								{
									model: Words,
									as: 'word'
								}
							]
						}
					]
				}
			]
		}) as any;

		if (!dictation || !dictation.correctSentence) {
			throw ApiError.errorByType('QUEST_NOT_FOUND');
		}

		// Combine correct words and distractor words
		const correctWords = dictation.correctSentence.sentenceWords?.map((sw: any) => sw.word) || [];
		const distractorWords = dictation.distractor?.distractorWords?.map((dw: any) => dw.word) || [];
		const allWords = [...correctWords, ...distractorWords];

		return new QuestDictationDTO(
			dictation,
			dictation.correctSentence.text,
			allWords
		);
	}

	private async getTranslateData(questId: number): Promise<QuestTranslateDTO> {
		const translate = await QuestTranslate.findOne({
			where: { questId },
			include: [
				{
					model: Sentence,
					as: 'correctSentence',
					include: [
						{
							model: SentenceWords,
							as: 'sentenceWords',
							include: [
								{
									model: Words,
									as: 'word'
								}
							]
						}
					]
				},
				{
					model: Distractor,
					as: 'distractor',
					include: [
						{
							model: DistractorWords,
							as: 'distractorWords',
							include: [
								{
									model: Words,
									as: 'word'
								}
							]
						}
					]
				}
			]
		}) as any;

		if (!translate || !translate.correctSentence) {
			throw ApiError.errorByType('QUEST_NOT_FOUND');
		}

		// Combine correct words and distractor words
		const correctWords = translate.correctSentence.sentenceWords?.map((sw: any) => sw.word) || [];
		const distractorWords = translate.distractor?.distractorWords?.map((dw: any) => dw.word) || [];
		const allWords = [...correctWords, ...distractorWords];

		return new QuestTranslateDTO(
			translate,
			translate.correctSentence.text,
			allWords
		);
	}

	private async createMatchWordsQuest(data: CreateQuestData & { type: 'MATCH_WORDS' }) {
		const quest = await Quest.create({
			type: QuestType.MATCH_WORDS,
			levelId: data.levelId
		});

		const matchWords = await QuestMatchWords.create({
			questId: quest.id,
			word: data.word,
			translate: data.translate
		});

		return {
			quest,
			questData: new QuestMatchWordsDTO(matchWords)
		};
	}

	private async createDictationQuest(data: CreateQuestData & { type: 'DICTATION' }) {
		// Create audio for sentence
		const audioPath = await ttsService.synthesize(data.correctSentence);
		const audioMedia = await mediaService.createMedia(audioPath);

		// Create sentence
		const sentence = await Sentence.create({
			text: data.correctSentence,
			audioMediaId: audioMedia.id
		});

		// Create or get words
		const wordRecords = await this.getOrCreateWords(data.correctWords);

		// Create sentence words
		await Promise.all(
			wordRecords.map((word, index) =>
				SentenceWords.create({
					sentenceId: sentence.id,
					wordId: word.id,
					position: index
				})
			)
		);

		// Create distractor if provided
		let distractorId = null;
		if (data.distractorWords && data.distractorWords.length > 0) {
			const distractor = await Distractor.create({});
			distractorId = distractor.id;

			const distractorWordRecords = await this.getOrCreateWords(data.distractorWords);
			await Promise.all(
				distractorWordRecords.map(word =>
					DistractorWords.create({
						distractorId: distractor.id,
						wordId: word.id
					})
				)
			);
		}

		// Create quest
		const quest = await Quest.create({
			type: QuestType.DICTATION,
			levelId: data.levelId
		});

		const dictation = await QuestDictation.create({
			questId: quest.id,
			audioMediaId: audioMedia.id,
			correctSentenceId: sentence.id,
			distractorId
		});

		// Fetch full data for response
		const questData = await this.getDictationData(quest.id);

		return { quest, questData };
	}

	private async createTranslateQuest(data: CreateQuestData & { type: 'TRANSLATE' }) {
		// Create sentence with audio
		const audioPath = await ttsService.synthesize(data.correctSentence);
		const audioMedia = await mediaService.createMedia(audioPath);

		const sentence = await Sentence.create({
			text: data.correctSentence,
			audioMediaId: audioMedia.id
		});

		// Create or get words
		const wordRecords = await this.getOrCreateWords(data.correctWords);

		// Create sentence words
		await Promise.all(
			wordRecords.map((word, index) =>
				SentenceWords.create({
					sentenceId: sentence.id,
					wordId: word.id,
					position: index
				})
			)
		);

		// Create distractor if provided
		let distractorId = null;
		if (data.distractorWords && data.distractorWords.length > 0) {
			const distractor = await Distractor.create({});
			distractorId = distractor.id;

			const distractorWordRecords = await this.getOrCreateWords(data.distractorWords);
			await Promise.all(
				distractorWordRecords.map(word =>
					DistractorWords.create({
						distractorId: distractor.id,
						wordId: word.id
					})
				)
			);
		}

		// Create quest
		const quest = await Quest.create({
			type: QuestType.TRANSLATE,
			levelId: data.levelId
		});

		const translate = await QuestTranslate.create({
			questId: quest.id,
			sourceSentence: data.sourceSentence,
			correctSentenceId: sentence.id,
			distractorId
		});

		// Fetch full data for response
		const questData = await this.getTranslateData(quest.id);

		return { quest, questData };
	}

	private async getOrCreateWords(wordValues: string[]): Promise<Words[]> {
		const words: Words[] = [];

		for (const value of wordValues) {
			let word = await Words.findOne({ where: { value } });

			if (!word) {
				// Generate audio for word
				const audioPath = await ttsService.synthesize(value);
				const audioMedia = await mediaService.createMedia(audioPath);

				word = await Words.create({
					value,
					audioMediaId: audioMedia.id
				});
			}

			words.push(word);
		}

		return words;
	}

	private async deleteDictationQuest(questId: number): Promise<void> {
		const dictation = await QuestDictation.findOne({
			where: { questId }
		});

		if (dictation) {
			// Delete audio media
			if (dictation.audioMediaId) {
				await mediaService.deleteMedia(dictation.audioMediaId);
			}

			// Sentence and distractor will be cascade deleted
		}
	}

	private async deleteTranslateQuest(questId: number): Promise<void> {
		const translate = await QuestTranslate.findOne({
			where: { questId }
		});

		if (translate) {
			// Sentence with audio and distractor will be cascade deleted
		}
	}
}

export default new QuestsService();
