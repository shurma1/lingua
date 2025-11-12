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
import { 
	QuestDTO, 
	QuestMatchWordsResponseDTO, 
	QuestDictationResponseDTO, 
	QuestTranslateResponseDTO,
	QuestResponseDTO 
} from '../dtos';
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
	async getQuestById(questId: number): Promise<QuestResponseDTO> {
		const quest = await Quest.findByPk(questId);
		if (!quest) {
			throw ApiError.errorByType('QUEST_NOT_FOUND');
		}

		let questData;

		switch (quest.type) {
			case 'MATCH_WORDS':
				questData = await this.getMatchWordsData(quest);
				break;
			case 'DICTATION':
				questData = await this.getDictationData(quest);
				break;
			case 'TRANSLATE':
				questData = await this.getTranslateData(quest);
				break;
			default:
				throw ApiError.errorByType('INVALID_QUEST_TYPE');
		}

		return questData;
	}

	/**
	 * Create a quest (admin only)
	 */
	async createQuest(data: CreateQuestData): Promise<QuestResponseDTO> {
		const level = await Level.findByPk(data.levelId);
		if (!level) {
			throw ApiError.errorByType('LEVEL_NOT_FOUND');
		}

		// Initialize TTS service
		await ttsService.init();

		let questData: QuestResponseDTO;

		switch (data.type) {
			case 'MATCH_WORDS':
				questData = await this.createMatchWordsQuest(data);
				break;
			case 'DICTATION':
				questData = await this.createDictationQuest(data);
				break;
			case 'TRANSLATE':
				questData = await this.createTranslateQuest(data);
				break;
			default:
				throw ApiError.errorByType('INVALID_QUEST_TYPE');
		}

		return questData;
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

	private async getMatchWordsData(quest: Quest): Promise<QuestMatchWordsResponseDTO> {
		const matchWords = await QuestMatchWords.findAll({
			where: { questId: quest.id }
		});

		if (!matchWords || matchWords.length === 0) {
			throw ApiError.errorByType('QUEST_NOT_FOUND');
		}

		return new QuestMatchWordsResponseDTO(quest, matchWords);
	}

	private async getDictationData(quest: Quest): Promise<QuestDictationResponseDTO> {
		const dictation = await QuestDictation.findOne({
			where: { questId: quest.id },
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
							],
							order: [['position', 'ASC']]
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

		return new QuestDictationResponseDTO(
			quest,
			dictation,
			dictation.correctSentence.text,
			allWords
		);
	}

	private async getTranslateData(quest: Quest): Promise<QuestTranslateResponseDTO> {
		const translate = await QuestTranslate.findOne({
			where: { questId: quest.id },
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
							],
							order: [['position', 'ASC']]
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

		return new QuestTranslateResponseDTO(
			quest,
			translate,
			translate.correctSentence.text,
			allWords
		);
	}

	private async createMatchWordsQuest(data: CreateQuestData & { type: 'MATCH_WORDS' }): Promise<QuestMatchWordsResponseDTO> {
		const quest = await Quest.create({
			type: QuestType.MATCH_WORDS,
			levelId: data.levelId
		});

		// Create multiple quest_match_words rows from data array
		const matchWordsRecords = await Promise.all(
			data.data.map(item =>
				QuestMatchWords.create({
					questId: quest.id,
					word: item.word,
					translate: item.translate
				})
			)
		);

		return new QuestMatchWordsResponseDTO(quest, matchWordsRecords);
	}

	private async createDictationQuest(data: CreateQuestData & { type: 'DICTATION' }): Promise<QuestDictationResponseDTO> {
		// Strip extra characters and split into words
		const cleanedSentence = data.correctSentence.trim();
		const correctWords = this.stripAndSplitSentence(cleanedSentence);

		// Create audio for sentence
		const audioPath = await ttsService.synthesize(cleanedSentence);
		const audioMedia = await mediaService.createMedia(audioPath);

		// Create sentence
		const sentence = await Sentence.create({
			text: cleanedSentence,
			audioMediaId: audioMedia.id
		});

		// Create or get words
		const wordRecords = await this.getOrCreateWords(correctWords);

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
		const questData = await this.getDictationData(quest);
		return questData;
	}

	private async createTranslateQuest(data: CreateQuestData & { type: 'TRANSLATE' }): Promise<QuestTranslateResponseDTO> {
		// Split correctSentence into words
		const cleanedSentence = data.correctSentence.trim();
		const correctWords = this.stripAndSplitSentence(cleanedSentence);

		// Create sentence with audio
		const audioPath = await ttsService.synthesize(cleanedSentence);
		const audioMedia = await mediaService.createMedia(audioPath);

		const sentence = await Sentence.create({
			text: cleanedSentence,
			audioMediaId: audioMedia.id
		});

		// Create or get words
		const wordRecords = await this.getOrCreateWords(correctWords);

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
		const questData = await this.getTranslateData(quest);
		return questData;
	}

	/**
	 * Strip extra characters from sentence and split into words
	 */
	private stripAndSplitSentence(sentence: string): string[] {
		// Remove punctuation and extra whitespace, then split
		const cleaned = sentence.replace(/[.,!?;:"""''()]/g, ' ').replace(/\s+/g, ' ').trim();
		return cleaned.split(' ').filter(word => word.length > 0);
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
