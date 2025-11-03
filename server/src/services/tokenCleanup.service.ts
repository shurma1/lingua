import tokenService from './token.service';
import logger from '../utils/logger';

class TokenCleanupService {
	private intervalId: NodeJS.Timeout | null = null;
  
	// Run cleanup every 24 hours
	private readonly CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000;

	start(): void {
		if (this.intervalId) {
			logger.warn('[TokenCleanup] Cleanup service already running');
			return;
		}

		logger.info('[TokenCleanup] Starting token cleanup service (runs every 24h)');
    
		// Run immediately on startup
		this.runCleanup();
    
		// Schedule periodic cleanup
		this.intervalId = setInterval(() => {
			this.runCleanup();
		}, this.CLEANUP_INTERVAL_MS);
	}

	stop(): void {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
			logger.info('[TokenCleanup] Token cleanup service stopped');
		}
	}

	private async runCleanup(): Promise<void> {
		try {
			logger.info('[TokenCleanup] Running expired token cleanup...');
			const deletedCount = await tokenService.CleanupExpiredTokens();
			logger.info(`[TokenCleanup] Cleanup complete. Removed ${deletedCount} expired tokens`);
		} catch (error) {
			logger.error('[TokenCleanup] Error during token cleanup:', error);
		}
	}
}

export default new TokenCleanupService();
