import React from "react";

import styles from "@styles/components/LevelButton.module.scss";

interface LevelButtonProps {
  level?: number | string;
  color?: "green" | "blue" | "purple" | "red" | "gold";
  onClick?: () => void;
  children?: React.ReactNode;
}

export const LevelButton: React.FC<LevelButtonProps> = ({
	level,
	color = "green",
	onClick,
	children,
}) => {
	return (
		<button
			className={`${styles.levelButton} ${styles[color]}`}
			onClick={onClick}
		>
			{children || level}
		</button>
	);
};
