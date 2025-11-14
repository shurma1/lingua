import React from "react";

import styles from "@styles/components/SquareButton.module.scss";
import cls from "@utils/cls";
import {ImpactStyle} from "@WebApp/types";
import WebApp from "@WebApp/WebApp";

interface SquareButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  type?: "default" | "bordered";
  backgroundColor?: string;
  borderColor?: string;
  color?: string;
}

export const SquareButton: React.FC<SquareButtonProps> = ({
	type = "default",
	onClick,
	children,
	backgroundColor,
	borderColor,
	color,
}) => {
	
	const handleClick = () => {
		WebApp.HapticFeedback.impactOccurred(ImpactStyle.MEDIUM);
		if(onClick) onClick();
	};
	
	return (
		<button
			className={cls(styles.squareButton, [styles.bordered, type === "bordered"])}
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
