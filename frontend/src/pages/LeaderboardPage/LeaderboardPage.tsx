import { useState } from "react";

import LeaderBoard from "@components/LeaderBoard";
import Button from "@components/ui/Button";
import LeaderboardSwitch from "@components/ui/LeaderboardSwitch";
import {BOT_TAG} from "@config/bot";
import WebApp from "@WebApp/WebApp";

import { useFriendsMutations } from "@/hooks/useFriends";
import { LeaderboardType } from "@/types/api";

import styles from "./LeaderboardPage.module.scss";

const LeaderboardPage = () => {
	const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>("all");
	const { createInvite } = useFriendsMutations();

	const handleAddFriend = async () => {
		try {
			const invite = await createInvite();
			const inviteLink = `https://max.ru/${BOT_TAG}?startapp=${invite.inviteId}`;
			WebApp.shareMaxContent(
				"Присоединись ко мне в Lingua! Вместе учим языки и соревнуемся",
				inviteLink,
			);
		} catch (error) {
			console.error("Failed to create invite:", error);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.controlsContainer}>
				<LeaderboardSwitch
					value={leaderboardType}
					onChange={setLeaderboardType}
				/>
				{leaderboardType === "friends" && (
					<Button
						mode="primary"
						appearance="contrast-static"
						containerClasses={styles.addFriendButton}
						onClick={handleAddFriend}
					>
						+
					</Button>
				)}
			</div>
			<LeaderBoard
				type={leaderboardType}
				onTypeChange={setLeaderboardType}
				showSwitch={false}
			/>
		</div>
	);
};

export default LeaderboardPage;
