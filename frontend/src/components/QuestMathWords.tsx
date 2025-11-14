// import React, { useState, useEffect } from "react";
//
// import styles from "@styles/components/QuestMathWords.module.scss";
//
// import { MatchWordPairDTO } from "@/types/api";
//
// import { SquareButton } from "./SquareButton";
//
// interface QuestMathWordsProps {
// 	pairs: MatchWordPairDTO[];
// 	onComplete: (matches: Map<string, string>) => void;
// }
//
// interface ShuffledWord {
// 	id: string;
// 	text: string;
// 	type: "word" | "translate";
// 	matched: boolean;
// }
//
// const QuestMathWords: React.FC<QuestMathWordsProps> = ({ pairs, onComplete }) => {
// 	const [words, setWords] = useState<ShuffledWord[]>([]);
// 	const [translations, setTranslations] = useState<ShuffledWord[]>([]);
// 	const [selectedWord, setSelectedWord] = useState<string | null>(null);
// 	const [selectedTranslation, setSelectedTranslation] = useState<string | null>(null);
// 	const [matches, setMatches] = useState<Map<string, string>>(new Map());
//
// 	useEffect(() => {
// 		// Shuffle and prepare words
// 		const shuffledWords = pairs
// 			.map((pair, index) => ({
// 				id: `word-${index}`,
// 				text: pair.word,
// 				type: "word" as const,
// 				matched: false,
// 			}))
// 			.sort(() => Math.random() - 0.5);
//
// 		const shuffledTranslations = pairs
// 			.map((pair, index) => ({
// 				id: `translate-${index}`,
// 				text: pair.translate,
// 				type: "translate" as const,
// 				matched: false,
// 			}))
// 			.sort(() => Math.random() - 0.5);
//
// 		setWords(shuffledWords);
// 		setTranslations(shuffledTranslations);
// 	}, [pairs]);
//
// 	const handleWordClick = (id: string) => {
// 		if (words.find(w => w.id === id)?.matched) return;
//
// 		if (selectedWord === id) {
// 			setSelectedWord(null);
// 		} else {
// 			setSelectedWord(id);
// 		}
// 	};
//
// 	const handleTranslationClick = (id: string) => {
// 		if (translations.find(t => t.id === id)?.matched) return;
//
// 		if (selectedTranslation === id) {
// 			setSelectedTranslation(null);
// 		} else {
// 			setSelectedTranslation(id);
// 		}
// 	};
//
// 	useEffect(() => {
// 		if (selectedWord && selectedTranslation) {
// 			const word = words.find(w => w.id === selectedWord);
// 			const translation = translations.find(t => t.id === selectedTranslation);
//
// 			if (!word || !translation) return;
//
// 			// Find the correct pair
// 			const correctPair = pairs.find(
// 				pair => pair.word === word.text && pair.translate === translation.text,
// 			);
//
// 			if (correctPair) {
// 				// Correct match
// 				const newMatches = new Map(matches);
// 				newMatches.set(word.text, translation.text);
// 				setMatches(newMatches);
//
// 				// Mark as matched
// 				setWords(prev =>
// 					prev.map(w => (w.id === selectedWord ? { ...w, matched: true } : w)),
// 				);
// 				setTranslations(prev =>
// 					prev.map(t => (t.id === selectedTranslation ? { ...t, matched: true } : t)),
// 				);
//
// 				// Check if all pairs are matched
// 				if (newMatches.size === pairs.length) {
// 					setTimeout(() => {
// 						onComplete(newMatches);
// 					}, 500);
// 				}
// 			}
//
// 			// Reset selection
// 			setSelectedWord(null);
// 			setSelectedTranslation(null);
// 		}
// 	}, [selectedWord, selectedTranslation, words, translations, pairs, matches, onComplete]);
//
// 	return (
// 		<div className={styles.container}>
// 			<div className={styles.columns}>
// 				<div className={styles.column}>
// 					{words.map(word => (
// 						<SquareButton
//
// 							key={word.id}
// 							onClick={() => handleWordClick(word.id)}
// 							type="bordered"
// 							backgroundColor={word.matched ? "var(--accent-color)" : undefined}
// 							borderColor={selectedWord === word.id ? "var(--accent-color)" : "var(--border-color)"}
// 						>
// 							{word.text}
// 						</SquareButton>
// 					))}
// 				</div>
// 				<div className={styles.column}>
// 					{translations.map(translation => (
// 						<SquareButton
// 							key={translation.id}
// 							onClick={() => handleTranslationClick(translation.id)}
// 							type={selectedTranslation === translation.id ? "bordered" : "default"}
// 							backgroundColor={translation.matched ? "var(--accent-color)" : undefined}
// 							borderColor={selectedTranslation === translation.id ? "var(--accent-color)" : undefined}
// 						>
// 							{translation.text}
// 						</SquareButton>
// 					))}
// 				</div>
// 			</div>
// 		</div>
// 	);
// };
//
// export default QuestMathWords;
