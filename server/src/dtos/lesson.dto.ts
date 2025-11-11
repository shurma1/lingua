import type { Lesson } from '../models/entities/Lesson';

/**
 * @openapi
 * components:
 *   schemas:
 *     LessonDTO:
 *       type: object
 *       required:
 *         - id
 *         - moduleId
 *         - title
 *         - text
 *       properties:
 *         id:
 *           type: integer
 *           description: Lesson ID
 *           example: 1
 *         moduleId:
 *           type: integer
 *           description: Module ID
 *           example: 1
 *         title:
 *           type: string
 *           description: Lesson title
 *           example: Introduction to Grammar
 *         text:
 *           type: string
 *           description: Lesson content
 *           example: This lesson covers basic grammar rules...
 */
export class LessonDTO {
	id: number;
	moduleId: number;
	title: string;
	text: string;

	constructor(lesson: Lesson) {
		this.id = lesson.id;
		this.moduleId = lesson.moduleId;
		this.title = lesson.title;
		this.text = lesson.text;
	}

	static fromLesson(lesson: Lesson): LessonDTO {
		return new LessonDTO(lesson);
	}
}
