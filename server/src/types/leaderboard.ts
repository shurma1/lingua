export type LeaderboardType = 'all' | 'friends';

export interface LeaderboardEntry {
	position: number;
	userId: number;
	username: string;
	firstName?: string;
	lastName?: string;
	photoUrl?: string;
	stars: number;
}
