import type { Request, Response, NextFunction } from 'express';
import mediaService from '../services/media.service';

/**
 * @openapi
 * tags:
 *   - name: Media
 *     description: Media file endpoints
 */
class MediaController {
	/**
	 * @openapi
	 * /api/media/{mediaId}:
	 *   get:
	 *     tags: [Media]
	 *     summary: Get media file metadata
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: mediaId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *     responses:
	 *       200:
	 *         description: Media metadata
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/MediaDTO'
	 *       404:
	 *         description: Media not found
	 */
	async getMediaById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const mediaId = parseInt(req.params.mediaId, 10);
			const media = await mediaService.getMediaById(mediaId);
			res.status(200).json(media);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/media/{mediaId}/file:
	 *   get:
	 *     tags: [Media]
	 *     summary: Get actual media file
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: mediaId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *     responses:
	 *       200:
	 *         description: Media file
	 *         content:
	 *           audio/wav:
	 *             schema:
	 *               type: string
	 *               format: binary
	 *       404:
	 *         description: Media not found
	 */
	async getMediaFile(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const mediaId = parseInt(req.params.mediaId, 10);
			const filePath = await mediaService.getMediaFilePath(mediaId);
			res.sendFile(filePath);
		} catch (error) {
			next(error);
		}
	}
}

export default new MediaController();
