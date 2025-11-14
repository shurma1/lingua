import React from "react";

import { LevelButton } from "@components/LevelButton";
import { Typography } from "@maxhub/max-ui";
import styles from "@styles/components/Levels.module.scss";

export interface LevelItem {
  id: number | string;
  level?: number | string;
  color?: "green" | "blue" | "purple" | "red" | "gold";
  onClick?: () => void;
  children?: React.ReactNode;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}

interface LevelsProps {
  levels: LevelItem[];
}

export const Levels: React.FC<LevelsProps> = ({ levels }) => {
	if (!levels || levels.length === 0) {
		return (
			<div className={styles.emptyState}>
				<Typography.Title>Упс.. В этом модуле уровней пока нет :/</Typography.Title>
			</div>
		);
	}
	
	return (
		<div className={styles.levels}>
			{levels.map((level) => (
				<div
					key={level.id}
					className={styles.levelItem}
				>
					<LevelButton
						level={level.level}
						onClick={level.onClick}
						backgroundColor={level.backgroundColor}
						borderColor={level.borderColor}
						textColor={level.textColor}
					>
						{level.children}
					</LevelButton>
				</div>
			))}
		</div>
	);
};
