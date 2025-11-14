import React, { useState, useEffect } from "react";

import styles from "@styles/components/QuestMathWords.module.scss";
import { NotificationType } from "@WebApp/types";
import WebApp from "@WebApp/WebApp";

import { MatchWordPairDTO } from "@/types/api";


import { SquareButton } from "./SquareButton";

interface QuestMathWordsProps {
	pairs: MatchWordPairDTO[];
	onComplete: () => void;
}

interface WordItem {
	id: string;
	pairId: string;
	text: string;
	matched: boolean;
}

interface TranslationItem {
	id: string;
	pairId: string;
	text: string;
	matched: boolean;
}

interface SelectedButton {
	id: string;
	type: "word" | "translation";
}

const BACKLIGHT_DURATION = 500;

const QuestMathWords: React.FC<QuestMathWordsProps> = ({ pairs, onComplete }) => {
	const [words, setWords] = useState<WordItem[]>([]);
	const [translations, setTranslations] = useState<TranslationItem[]>([]);
	const [selectedButtons, setSelectedButtons] = useState<SelectedButton[]>([]);
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [highlightedButtons, setHighlightedButtons] = useState<string[]>([]);
	const [isCompleted, setIsCompleted] = useState(false);

	// Initialize and shuffle words and translations
	useEffect(() => {
		const wordItems: WordItem[] = pairs.map((pair, index) => ({
			id: `word-${index}`,
			pairId: `pair-${index}`,
			text: pair.word,
			matched: false,
		}));

		const translationItems: TranslationItem[] = pairs.map((pair, index) => ({
			id: `translation-${index}`,
			pairId: `pair-${index}`,
			text: pair.translate,
			matched: false,
		}));

		const shuffledWords = [...wordItems].sort(() => Math.random() - 0.5);
		const shuffledTranslations = [...translationItems].sort(() => Math.random() - 0.5);

		setWords(shuffledWords);
		setTranslations(shuffledTranslations);
	}, [pairs]);

	// Check completion when all words are matched
	useEffect(() => {
		if (!isCompleted && words.length > 0 && words.every(word => word.matched)) {
			setIsCompleted(true);
			onComplete();
		}
	}, [words, onComplete, isCompleted]);

	// Handle button selection logic
	const handleButtonClick = (id: string, type: "word" | "translation") => {
		const item = type === "word"
			? words.find(w => w.id === id)
			: translations.find(t => t.id === id);
		
		if (!item || item.matched || isError || isSuccess) return;

		setSelectedButtons(prev => {
			// If already selected - deselect it
			const isAlreadySelected = prev.some(btn => btn.id === id);
			if (isAlreadySelected) {
				return prev.filter(btn => btn.id !== id);
			}

			// If same type already selected - replace it
			const sameTypeIndex = prev.findIndex(btn => btn.type === type);
			if (sameTypeIndex !== -1) {
				const updated = [...prev];
				updated[sameTypeIndex] = { id, type };
				return updated;
			}

			// Add new selection
			return [...prev, { id, type }];
		});
	};

	// Check for matches when 2 buttons are selected
	useEffect(() => {
		if (selectedButtons.length !== 2) return;

		const [first, second] = selectedButtons;
		const firstItem = first.type === "word"
			? words.find(w => w.id === first.id)
			: translations.find(t => t.id === first.id);
		const secondItem = second.type === "word"
			? words.find(w => w.id === second.id)
			: translations.find(t => t.id === second.id);

		if (!firstItem || !secondItem) return;

		// Highlight both buttons
		setHighlightedButtons([first.id, second.id]);

		if (firstItem.pairId === secondItem.pairId) {
			// Success - match found
			setIsSuccess(true);
			WebApp.HapticFeedback.notificationOccurred(NotificationType.SUCCESS);

			setTimeout(() => {
				// Mark as matched
				setWords(prev => prev.map(w =>
					w.id === firstItem.id || w.id === secondItem.id
						? { ...w, matched: true }
						: w,
				));
				setTranslations(prev => prev.map(t =>
					t.id === firstItem.id || t.id === secondItem.id
						? { ...t, matched: true }
						: t,
				));
				
				// Reset state
				setSelectedButtons([]);
				setHighlightedButtons([]);
				setIsSuccess(false);
			}, BACKLIGHT_DURATION);
		} else {
			// Error - no match
			setIsError(true);

			setTimeout(() => {
				// Reset selection and highlights
				setSelectedButtons([]);
				setHighlightedButtons([]);
				setIsError(false);
			}, BACKLIGHT_DURATION);
		}
	}, [selectedButtons, words, translations]);

	// Determine border color for each button
	const getBorderColor = (id: string, isMatched: boolean): string | undefined => {
		if (isMatched) return undefined;
		if (highlightedButtons.includes(id)) {
			if (isError) return "red";
			if (isSuccess) return "#00bfff"; // Blue color for success
		}
		if (selectedButtons.some(btn => btn.id === id)) {
			return "var(--accent-color)";
		}
		return "var(--border-color)";
	};

	return (
		<div className={styles.container}>
			<div className={styles.columns}>
				<div className={styles.column}>
					{words.map(word => (
						<SquareButton
							key={word.id}
							onClick={word.matched ? undefined : () => handleButtonClick(word.id, "word")}
							type="bordered"
							color="var(--text-primary-color)"
							disabled={word.matched}
							borderColor={getBorderColor(word.id, word.matched)}
						>
							{word.text}
						</SquareButton>
					))}
				</div>
				<div className={styles.column}>
					{translations.map(translation => (
						<SquareButton
							key={translation.id}
							onClick={translation.matched ? undefined : () => handleButtonClick(translation.id, "translation")}
							type="bordered"
							color="var(--text-primary-color)"
							disabled={translation.matched}
							borderColor={getBorderColor(translation.id, translation.matched)}
						>
							{translation.text}
						</SquareButton>
					))}
				</div>
			</div>
		</div>
	);
};

export default QuestMathWords;
