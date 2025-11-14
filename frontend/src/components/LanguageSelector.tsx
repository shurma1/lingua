import React, {useState, useEffect} from "react";

import Icon from "@components/ui/Icon";
import {CellList, CellSimple} from "@maxhub/max-ui";
import styles from "@styles/components/LanguageSelector.module.scss";
import cls from "@utils/cls";
import {ImpactStyle} from "@WebApp/types";
import {NotificationType} from "@WebApp/types";
import WebApp from "@WebApp/WebApp";


export interface Language {
  code: string;
  name: string;
  emoji: string;
  disabled?: boolean;
}

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage?: string | null;
  onSelect: (languageCode: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
	languages,
	selectedLanguage: initialSelectedLanguage,
	onSelect,
}) => {
	const [selectedLanguage, setSelectedLanguage] = useState<string | null>(initialSelectedLanguage || null);

	useEffect(() => {
		if (initialSelectedLanguage !== undefined && initialSelectedLanguage !== null) {
			setSelectedLanguage(initialSelectedLanguage);
		}
	}, [initialSelectedLanguage]);

	const handleSelect = (languageCode: string) => {
		setSelectedLanguage(languageCode);
		onSelect(languageCode);
	};

	const handleClick = (language: Language) => {
		if (language.disabled) {
			WebApp.HapticFeedback.notificationOccurred(NotificationType.ERROR);
			return;
		}
		WebApp.HapticFeedback.impactOccurred(ImpactStyle.MEDIUM);
		handleSelect(language.code);
	};

	const SelectedCheckMark = () =>
		<div
			className={styles.checkmark}
		>
			<Icon name="check-16" size={16} color="#ffffff"/>
		</div>;
	
	const SkeletonCheckMark = () =>
		<div
			className={styles.checkboxSkeleton}
		/>;
	
	return (
		<CellList filled mode="island" className={styles.cellList}>
			{languages.map((language) => (
				<CellSimple
					key={language.code}
					before={<span className={styles.emoji}>{language.emoji}</span>}
					onClick={() => handleClick(language)}
					title={language.name}
					after={selectedLanguage === language.code ? <SelectedCheckMark/> : <SkeletonCheckMark/>}
					className={cls(
						[styles.selected, selectedLanguage === language.code],
						[styles.disabled, !!language.disabled],
					)}
					disabled={language.disabled}
				/>
			))}
		</CellList>
	);
};
