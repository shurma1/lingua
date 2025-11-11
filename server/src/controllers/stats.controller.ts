import type { Request, Response, NextFunction } from 'express';
import statsService from '../services/stats.service';
import type { LeaderboardType } from '../types/leaderboard';

/**
 * @openapi
 * tags:
 *   - name: Stats
 *     description: Statistics and leaderboard endpoints
 */
class StatsController {
	/**
	 * @openapi
	 * /api/stats/leaderboard:
	 *   get:
	 *     tags: [Stats]
	 *     summary: Get leaderboard
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: query
	 *         name: type
	 *         required: true
	 *         schema:
	 *           type: string
	 *           enum: [all, friends]
	 *         description: Leaderboard type
	 *     responses:
	 *       200:
	 *         description: Leaderboard data
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/LeaderboardDTO'
	 *       400:
	 *         description: Invalid leaderboard type
	 *       401:
	 *         description: Unauthorized
	 */
	async getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.userId;
			const type = req.query.type as LeaderboardType;
			const leaderboard = await statsService.getLeaderboard(userId, type);
			res.status(200).json(leaderboard);
		} catch (error) {
			next(error);
		}
	}
}

export default new StatsController();
