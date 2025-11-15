import React, { useMemo, useEffect, useState } from "react";

import LeaderBoardList from "@components/LeaderBoardList";
import Podium from "@components/Podium";
import Avatar from "@components/ui/Avatar";
import FullScreenLoader from "@components/ui/FullScreenLoader";
import Icon from "@components/ui/Icon";
import LeaderboardSwitch from "./ui/LeaderboardSwitch";

import { useLeaderboard, useLeaderboardMutations } from "@/hooks/useLeaderboard";
import { LeaderboardType } from "@/types/api";
import { RatingUser } from "@/types/RatingUser";

import styles from "../styles/components/LeaderBoard.module.scss";
import cls from "../utils/cls";

interface LeaderBoardProps {
	users?: RatingUser[];
	type?: LeaderboardType;
	showSwitch?: boolean;
	className?: string;
	onTypeChange?: (type: LeaderboardType) => void;
}

export const LeaderBoard: React.FC<LeaderBoardProps> = ({ users, type: initialType = "all", showSwitch = true, className, onTypeChange }) => {
	const [activeType, setActiveType] = useState<LeaderboardType>(initialType);

	const handleTypeChange = (type: LeaderboardType) => {
		setActiveType(type);
		onTypeChange?.(type);
	};
	const { allLeaderboard, friendsLeaderboard, isLoading: storeLoading, error: storeError } = useLeaderboard();
	const { fetchLeaderboard, isLoading: localLoading, error: localError } = useLeaderboardMutations();

	const leaderboardData = activeType === "friends" ? friendsLeaderboard : allLeaderboard;
	const fromApi = !users;

	useEffect(() => {
		if (!fromApi) return; 
		if (!leaderboardData) {
			fetchLeaderboard(activeType).catch(() => {});
		}
	 
	}, [fromApi, leaderboardData, activeType]);

	const apiUsers: RatingUser[] = useMemo(() => {
		if (!leaderboardData) return [];
		const sortedByPosition = [...leaderboardData.leaders].sort((a, b) => a.position - b.position);
		return sortedByPosition.map(u => ({
			id: u.userId,
			username: u.username,
			photoUrl: u.photoUrl ?? null,
			stars: u.stars,
		}));
	}, [leaderboardData]);

	const effectiveUsers = users ?? apiUsers;

	const sorted = useMemo(() => {
		if (fromApi) return effectiveUsers;
		return [...effectiveUsers].sort((a, b) => b.stars - a.stars);
	}, [effectiveUsers, fromApi]);

	const podium = sorted.slice(0, 3);
	const rest = sorted.slice(3);

	const isLoading = storeLoading || localLoading;
	const error = storeError || localError;

	return (
		<div className={cls(styles.leaderboard, className)}>
			{showSwitch && (
				<LeaderboardSwitch
					value={activeType}
					onChange={handleTypeChange}
					className={styles.switchWrapper}
				/>
			)}
			{isLoading && <div className={styles.emptyState}>Загрузка...</div>}
			{error && <div className={styles.emptyState}>Ошибка: {error}</div>}
			{!isLoading && !error && effectiveUsers.length === 0 && (
				<div className={styles.emptyState}>Нет данных рейтинга</div>
			)}
			{!isLoading && !error && effectiveUsers.length > 0 && (
				<>
					<Podium users={podium} />
					{rest.length > 0 && (
						<LeaderBoardList
							items={rest}
							itemHeight={60}
							containerHeight={400}
							renderItem={(user, index) => (
								<div className={styles.userRow} key={user.id}>
									<span className={styles.rank}>{index + 4}</span>
									<Avatar 
										url={user.photoUrl} 
										initials={user.username.slice(0, 2).toUpperCase()} 
										className={styles.avatar} 
									/>
									<span className={styles.username}>{user.username}</span>
									<span className={styles.stars}><Icon name="star-16" size={10} /> {user.stars}</span>
								</div>
							)}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default LeaderBoard;

