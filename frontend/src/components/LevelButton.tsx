import React from "react";

import styles from "@styles/components/LevelButton.module.scss";
import {ImpactStyle} from "@WebApp/types";
import WebApp from "@WebApp/WebApp";

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
	
	const handleClick = () => {
		WebApp.HapticFeedback.impactOccurred(ImpactStyle.MEDIUM);
		if(onClick) onClick();
	};
	
	return (
		<button
			className={styles.levelButton}
			onClick={handleClick}
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
