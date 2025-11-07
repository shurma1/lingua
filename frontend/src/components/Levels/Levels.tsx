import React from 'react';
import { LevelButton } from '@components/LevelButton/LevelButton';
import styles from './Levels.module.scss';

export interface LevelItem {
  id: number | string;
  level?: number | string;
  color?: 'green' | 'blue' | 'purple' | 'red' | 'gold';
  onClick?: () => void;
  children?: React.ReactNode;
}

interface LevelsProps {
  levels: LevelItem[];
}

export const Levels: React.FC<LevelsProps> = ({ levels }) => {
  return (
    <div className={styles.levels}>
      {levels.map((level) => (
        <div
          key={level.id}
          className={styles.levelItem}
        >
          <LevelButton
            level={level.level}
            color={level.color}
            onClick={level.onClick}
          >
            {level.children}
          </LevelButton>
        </div>
      ))}
    </div>
  );
};
