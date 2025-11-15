import { useState } from "react";

import LeaderBoard from "@components/LeaderBoard";
import Button from "@components/ui/Button";
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
			const inviteLink = `https://max.ru/t118_hakaton_bot?startApp=${invite.inviteId}`;
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
            	<div className={styles.buttonWrapper}>
				{leaderboardType === "friends" ? (
					<Button mode="primary" appearance="contrast-static" className={styles.addFriendButton} style={{color: "#007AFFFF", justifyContent: "end"}} onClick={handleAddFriend}>Добавить друга</Button>
				) : null}
			</div>
			<LeaderBoard onTypeChange={setLeaderboardType} />
		</div>
	);
};

export default LeaderboardPage;
