import { AudioMedia } from '../models/entities/AudioMedia';
import { ApiError } from '../error/apiError';
import { MediaDTO } from '../dtos';
import * as fs from 'fs';
import * as path from 'path';

class MediaService {
	/**
	 * Get media by ID
	 */
	async getMediaById(mediaId: number): Promise<MediaDTO> {
		const media = await AudioMedia.findByPk(mediaId);
		if (!media) {
			throw ApiError.errorByType('MEDIA_NOT_FOUND');
		}

		return MediaDTO.fromMedia(media);
	}

	/**
	 * Get media file path
	 */
	async getMediaFilePath(mediaId: number): Promise<string> {
		const media = await AudioMedia.findByPk(mediaId);
		if (!media) {
			throw ApiError.errorByType('MEDIA_NOT_FOUND');
		}

		const filePath = path.join(process.cwd(), 'media', 'tts', media.filename);
		
		if (!fs.existsSync(filePath)) {
			throw ApiError.errorByType('MEDIA_NOT_FOUND');
		}

		return filePath;
	}

	/**
	 * Create media record from file
	 */
	async createMedia(filePath: string): Promise<AudioMedia> {
		const filename = path.basename(filePath);
		const stats = fs.statSync(filePath);

		const media = await AudioMedia.create({
			filename,
			mimeType: 'audio/wav',
			fileSize: stats.size,
			duration: null
		});

		return media;
	}

	/**
	 * Delete media and associated file
	 */
	async deleteMedia(mediaId: number): Promise<void> {
		const media = await AudioMedia.findByPk(mediaId);
		if (!media) {
			return; // Already deleted
		}

		// Delete file
		const filePath = path.join(process.cwd(), 'media', 'tts', media.filename);
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}

		await media.destroy();
	}
}

export default new MediaService();
