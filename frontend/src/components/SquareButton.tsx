import React from "react";

import styles from "@styles/components/SquareButton.module.scss";
import cls from "@utils/cls";

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
	return (
		<button
			className={cls(styles.squareButton, [styles.bordered, type === "bordered"])}
			onClick={onClick}
			style={{
				...(backgroundColor && { backgroundColor }),
				...(borderColor && { borderColor }),
				...(color && { color }),
			}}
		>
			{children}
		</button>
	);
};
