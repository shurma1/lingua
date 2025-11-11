import { LeaderboardDTO, LeaderboardType } from "@/types/api";

import { BaseApiClient } from "./BaseApiClient";

export class StatsApiClient extends BaseApiClient {
	async getLeaderboard(type: LeaderboardType): Promise<LeaderboardDTO> {
		return this.get<LeaderboardDTO>("/api/stats/leaderboard", {
			params: { type },
		});
	}
}
