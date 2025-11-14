import React, {useCallback} from "react";

import styles from "@styles/components/SquareButton.module.scss";
import cls from "@utils/cls";
import {ImpactStyle, NotificationType} from "@WebApp/types";
import WebApp from "@WebApp/WebApp";

interface SquareButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  type?: "default" | "bordered";
  backgroundColor?: string;
  borderColor?: string;
  color?: string;
  disabled?: boolean
}

export const SquareButton: React.FC<SquareButtonProps> = ({
	type = "default",
	onClick,
	children,
	backgroundColor,
	borderColor,
	color,
	disabled = false,
}) => {
	
	const handleClick = useCallback(() => {
		if(disabled) {
			WebApp.HapticFeedback.notificationOccurred(NotificationType.ERROR);
			return;
		}
		WebApp.HapticFeedback.impactOccurred(ImpactStyle.MEDIUM);
		if(onClick) onClick();
	},[disabled]);
	
	return (
		<button
			className={cls(
				styles.squareButton,
				[styles.bordered, type === "bordered"],
				[styles.disabled, disabled],
			)
			}
			onClick={handleClick}
			style={{
				"--button-border-color": borderColor,
				"--button-background-color": backgroundColor,
				...(color && { color }),
			} as React.CSSProperties}
		>
			{children}
		</button>
	);
};
