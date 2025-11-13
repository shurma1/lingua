import React, { useMemo, useEffect } from "react";

import LeaderBoardList from "@components/LeaderBoardList";
import Podium from "@components/Podium";
import Avatar from "@components/ui/Avatar";
import Icon from "@components/ui/Icon";

import { useLeaderboard, useLeaderboardMutations } from "@/hooks/useLeaderboard";
import { LeaderboardType } from "@/types/api";
import { RatingUser } from "@/types/RatingUser";

import styles from "../styles/components/LeaderBoard.module.scss";
import cls from "../utils/cls";

interface LeaderBoardProps {
	/** Optional explicit users list (e.g. for testing); if omitted data will be fetched */
	users?: RatingUser[];
	/** Which leaderboard to show */
	type?: LeaderboardType;
	className?: string;
}

export const LeaderBoard: React.FC<LeaderBoardProps> = ({ users, type = "all", className }) => {
	const { allLeaderboard, friendsLeaderboard, isLoading: storeLoading, error: storeError } = useLeaderboard();
	const { fetchLeaderboard, isLoading: localLoading, error: localError } = useLeaderboardMutations();

	// Decide which leaderboard data to use when no static users are passed
	const leaderboardData = type === "friends" ? friendsLeaderboard : allLeaderboard;
	const fromApi = !users;

	useEffect(() => {
		if (!fromApi) return; // static users provided
		if (!leaderboardData) {
			fetchLeaderboard(type).catch(() => {}); // error handled in hook/store
		}
	 
	}, [fromApi, leaderboardData, type]);

	const apiUsers: RatingUser[] = useMemo(() => {
		if (!leaderboardData) return [];
		// API already sends position; we sort by it to ensure correct placement
		const sortedByPosition = [...leaderboardData.leaders].sort((a, b) => a.position - b.position);
		return sortedByPosition.map(u => ({
			id: u.userId,
			username: u.username,
			photoUrl: u.photoUrl ?? null,
			stars: u.stars,
		}));
	}, [leaderboardData]);

	const effectiveUsers = users ?? apiUsers;

	// If coming from API we keep position ordering; otherwise sort by stars
	const sorted = useMemo(() => {
		if (fromApi) return effectiveUsers;
		return [...effectiveUsers].sort((a, b) => b.stars - a.stars);
	}, [effectiveUsers, fromApi]);

	const podium = sorted.slice(0, 3);
	const rest = sorted.slice(3);

	const isLoading = storeLoading || localLoading;
	const error = storeError || localError;

	if (isLoading) {
		return <div className={cls(styles.leaderboard, className)}>Загрузка...</div>;
	}

	if (error) {
		return <div className={cls(styles.leaderboard, className)}>Ошибка: {error}</div>;
	}

	if (effectiveUsers.length === 0) {
		return <div className={cls(styles.leaderboard, className)}>Нет данных рейтинга</div>;
	}

	return (
		<div className={cls(styles.leaderboard, className)}>
			<Podium users={podium} />
			{rest.length > 0 && (
				<LeaderBoardList
					items={rest}
					itemHeight={60}
					containerHeight={400}
					renderItem={(user, index) => (
						<div className={styles.userRow} key={user.id}>
							<span className={styles.rank}>{index + 4}</span>
							<Avatar url={user.photoUrl} initials={user.username.slice(0, 2).toUpperCase()} className={styles.avatar} />
							<span className={styles.username}>{user.username}</span>
							<span className={styles.stars}><Icon name="star-16" size={10} /> {user.stars}</span>
						</div>
					)}
				/>
			)}
		</div>
	);
};

export default LeaderBoard;

