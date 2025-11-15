import React from "react";

import { LeaderboardType } from "@/types/api";

import styles from "../../styles/ui/LeaderboardSwitch.module.scss";

interface LeaderboardSwitchProps {
	/** Current selected mode */
	value: LeaderboardType;
	/** Callback when switch is toggled */
	onChange: (type: LeaderboardType) => void;
	/** Optional CSS class */
	className?: string;
	/** Whether the switch is disabled */
	disabled?: boolean;
}

export const LeaderboardSwitch: React.FC<LeaderboardSwitchProps> = ({
	value,
	onChange,
	disabled = false,
	className = "",
}) => {
	const handleAllUsers = () => {
		if (!disabled && value !== "all") {
			onChange("all");
		}
	};

	const handleFriends = () => {
		if (!disabled && value !== "friends") {
			onChange("friends");
		}
	};
	//ужас
	return (
		<div className={`${styles.switchContainer} ${className}`}>
			<div className={styles.switchTrack}>
				<button
					className={`${styles.switchOption} ${value === "all" ? styles.active : ""}`}
					onClick={handleAllUsers}
					disabled={disabled}
					aria-label="Show all users"
					aria-pressed={value === "all"}
				>
					Все
				</button>
				<button
					className={`${styles.switchOption} ${value === "friends" ? styles.active : ""}`}
					onClick={handleFriends}
					disabled={disabled}
					aria-label="Show friends only"
					aria-pressed={value === "friends"}
				>
					Друзья
				</button>
				<div className={`${styles.switchIndicator} ${value === "friends" ? styles.right : styles.left}`}></div>
			</div>
		</div>
	);
};

export default LeaderboardSwitch;

