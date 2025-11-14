import React from "react";

import styles from "@styles/components/LevelButton.module.scss";
import cls from "@utils/cls";
import {ImpactStyle, NotificationType} from "@WebApp/types";
import WebApp from "@WebApp/WebApp";

interface LevelButtonProps {
  level?: number | string;
  onClick?: () => void;
  children?: React.ReactNode;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  disabled?: boolean;
}

export const LevelButton: React.FC<LevelButtonProps> = ({
	level,
	onClick,
	children,
	backgroundColor,
	borderColor,
	textColor,
	disabled = false,
}) => {
	
	const handleClick = () => {
		if (disabled) {
			WebApp.HapticFeedback.notificationOccurred(NotificationType.ERROR);
			return;
		}
		WebApp.HapticFeedback.impactOccurred(ImpactStyle.MEDIUM);
		if(onClick) onClick();
	};
	
	return (
		<button
			className={cls(styles.levelButton, [styles.disabled, disabled])}
			onClick={handleClick}
			style={{
				...(disabled ? {
					backgroundColor: "var(--innactive-color)",
					borderColor: "var(--innactive-color)",
					color: "var(--text-secondary-color)",
					cursor: "not-allowed",
					opacity: 0.6,
				} : {
					...(backgroundColor && { backgroundColor }),
					...(borderColor && { borderColor }),
					...(textColor && { color: textColor }),
				}),
			}}
		>
			{children || level}
		</button>
	);
};
