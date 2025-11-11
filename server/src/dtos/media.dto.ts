import type { AudioMedia } from '../models/entities/AudioMedia';

/**
 * @openapi
 * components:
 *   schemas:
 *     MediaDTO:
 *       type: object
 *       required:
 *         - mediaId
 *         - filename
 *         - url
 *         - createdAt
 *       properties:
 *         mediaId:
 *           type: integer
 *           description: Media ID
 *           example: 1
 *         filename:
 *           type: string
 *           description: File name
 *           example: audio_123.wav
 *         mimetype:
 *           type: string
 *           description: MIME type
 *           example: audio/wav
 *         duration:
 *           type: number
 *           format: float
 *           description: Duration in seconds
 *           example: 3.5
 *         fileSize:
 *           type: integer
 *           description: File size in bytes
 *           example: 102400
 *         url:
 *           type: string
 *           description: URL to access the media file
 *           example: /media/1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation date
 *           example: 2024-01-01T00:00:00.000Z
 */
export class MediaDTO {
	mediaId: number;
	filename: string;
	mimetype?: string;
	duration?: number;
	fileSize?: number;
	url: string;
	createdAt: Date;

	constructor(media: AudioMedia) {
		this.mediaId = media.id;
		this.filename = media.filename;
		this.mimetype = media.mimeType || undefined;
		this.duration = media.duration || undefined;
		this.fileSize = media.fileSize ? Number(media.fileSize) : undefined;
		this.url = `/media/${media.id}`;
		this.createdAt = media.createdAt;
	}

	static fromMedia(media: AudioMedia): MediaDTO {
		return new MediaDTO(media);
	}
}
