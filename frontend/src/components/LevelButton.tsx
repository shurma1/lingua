import React from "react";

import styles from "@styles/components/LevelButton.module.scss";

interface LevelButtonProps {
  level?: number | string;
  onClick?: () => void;
  children?: React.ReactNode;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}

export const LevelButton: React.FC<LevelButtonProps> = ({
	level,
	onClick,
	children,
	backgroundColor,
	borderColor,
	textColor,
}) => {
	return (
		<button
			className={styles.levelButton}
			onClick={onClick}
			style={{
				...(backgroundColor && { backgroundColor }),
				...(borderColor && { borderColor }),
				...(textColor && { color: textColor }),
			}}
		>
			{children || level}
		</button>
	);
};
