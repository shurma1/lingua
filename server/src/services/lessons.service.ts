import { Lesson } from '../models/entities/Lesson';
import { Module } from '../models/entities/Module';
import { ApiError } from '../error/apiError';
import { LessonDTO } from '../dtos';

class LessonsService {
	/**
	 * Get lesson by module
	 */
	async getLessonByModule(moduleId: number): Promise<LessonDTO | null> {
		const module = await Module.findByPk(moduleId);
		if (!module) {
			throw ApiError.errorByType('MODULE_NOT_FOUND');
		}

		const lesson = await Lesson.findOne({
			where: { moduleId }
		});

		return lesson ? LessonDTO.fromLesson(lesson) : null;
	}

	/**
	 * Create a new lesson (admin only)
	 */
	async createLesson(moduleId: number, title: string, text: string): Promise<LessonDTO> {
		const module = await Module.findByPk(moduleId);
		if (!module) {
			throw ApiError.errorByType('MODULE_NOT_FOUND');
		}

		// Check if lesson already exists for this module
		const existing = await Lesson.findOne({
			where: { moduleId }
		});

		if (existing) {
			throw ApiError.errorByType('LESSON_ALREADY_EXISTS');
		}

		const lesson = await Lesson.create({
			moduleId,
			title,
			text
		});

		return LessonDTO.fromLesson(lesson);
	}

	/**
	 * Update a lesson (admin only)
	 */
	async updateLesson(
		moduleId: number, 
		updates: { title?: string; text?: string }
	): Promise<LessonDTO> {
		const module = await Module.findByPk(moduleId);
		if (!module) {
			throw ApiError.errorByType('MODULE_NOT_FOUND');
		}

		const lesson = await Lesson.findOne({
			where: { moduleId }
		});

		if (!lesson) {
			throw ApiError.errorByType('LESSON_NOT_FOUND');
		}

		if (updates.title !== undefined) {
			lesson.title = updates.title;
		}

		if (updates.text !== undefined) {
			lesson.text = updates.text;
		}

		await lesson.save();

		return LessonDTO.fromLesson(lesson);
	}

	/**
	 * Delete a lesson (admin only)
	 */
	async deleteLesson(moduleId: number): Promise<void> {
		const module = await Module.findByPk(moduleId);
		if (!module) {
			throw ApiError.errorByType('MODULE_NOT_FOUND');
		}

		const lesson = await Lesson.findOne({
			where: { moduleId }
		});

		if (!lesson) {
			throw ApiError.errorByType('LESSON_NOT_FOUND');
		}

		await lesson.destroy();
	}
}

export default new LessonsService();
