import React, { useState, useMemo, useEffect } from "react";

import styles from "@styles/components/WordsKeyboard.module.scss";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

import { SquareButton } from "./SquareButton";

interface IWord {
  id: string;
  word: string;
  mediaId?: string;
  [key: string]: any;
}

interface WordsKeyboardProps {
	words: IWord[];
	onChange?: (sentence: string) => void;
	onWordClick?: (word: IWord) => void;
	sentenceType?: "clear" | "error" | "success";
	freeze?: boolean;
}

interface WordItem extends IWord {
  originalIndex: number;
}

export const WordsKeyboard: React.FC<WordsKeyboardProps> = ({ words, onChange, onWordClick, sentenceType = "clear", freeze = false }) => {
	const initialWords: WordItem[] = useMemo(
		() => {
			const wordsWithIndex = words.map((wordObj, index) => ({
				id: wordObj.id,
				word: wordObj.word,
				originalIndex: index,
			}));
   

			const shuffled = [...wordsWithIndex];
			for (let i = shuffled.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
			}
   
			return shuffled;
		},
		[words],
	);

	const [bankWords, setBankWords] = useState<WordItem[]>(initialWords);
	const [sentenceWords, setSentenceWords] = useState<WordItem[]>([]);
	const [isShaking, setIsShaking] = useState<boolean>(false);
 
	useEffect(() => {
		const sentence = sentenceWords.map(word => word.word).join(" ");
		onChange?.(sentence);
	}, [sentenceWords, onChange]);

	useEffect(() => {
		if (sentenceType === "error") {
			setIsShaking(true);
			const timer = setTimeout(() => {
				setIsShaking(false);
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [sentenceType]);

	const totalWords = bankWords.length;
	const rowsCount = useMemo(() => {
		if (totalWords <= 6) return 2;
		if (totalWords <= 12) return 3;
		return 4;
	}, [totalWords]);

	const wordsPerRow = Math.ceil(totalWords / rowsCount);
	const wordRows = useMemo(() => {
		const rows: WordItem[][] = [];
		for (let i = 0; i < rowsCount; i++) {
			rows.push(bankWords.slice(i * wordsPerRow, (i + 1) * wordsPerRow));
		}
		return rows;
	}, [bankWords, rowsCount, wordsPerRow]);

	const handleBankWordClick = (word: WordItem) => {
		if (freeze) return;
		setBankWords((prev) => prev.filter((w) => w.id !== word.id));
		setSentenceWords((prev) => [...prev, word]);
		onWordClick?.(word);
	};

	const handleSentenceWordClick = (word: WordItem) => {
		if (freeze) return;
		setSentenceWords((prev) => prev.filter((w) => w.id !== word.id));
		setBankWords((prev) => {
			const newBank = [...prev, word];
			return newBank.sort((a, b) => a.originalIndex - b.originalIndex);
		});
		onWordClick?.(word);
	};

	return (
		<LayoutGroup>
			<div className={`${styles.wordsKeyboard} ${isShaking ? styles.shake : ""}`}>
				<div className={styles.sentenceStrips}>
					<AnimatePresence>
						{sentenceWords.map((word) => (
							<motion.div
								key={word.id}
								layoutId={word.id}
								className={styles.sentenceWord}
								transition={{
									type: "spring",
									stiffness: 400,
									damping: 28,
								}}
							>
								<SquareButton
									onClick={freeze ? undefined : () => handleSentenceWordClick(word)}
									backgroundColor={
										sentenceType === "error"
											? "#EF4444"
											: sentenceType === "success"
												? "#10B981"
												: "var(--accent-color)"
									}
									borderColor={
										sentenceType === "error"
											? "#DC2626"
											: sentenceType === "success"
												? "#059669"
												: "var(--sub-accent-color)"
									}
								>
									{word.word}
								</SquareButton>
							</motion.div>
						))}
					</AnimatePresence>
				</div>

				<motion.div
					className={styles.wordBank}
					layout
					transition={{
						type: "spring",
						stiffness: 400,
						damping: 30,
					}}
				>
					<AnimatePresence>
						{wordRows.map((row, rowIndex) => (
							<motion.div
								key={`row-${rowIndex}`}
								className={styles.wordRow}
								layout
								transition={{
									type: "spring",
									stiffness: 400,
									damping: 30,
								}}
							>
								{row.map((word) => (
									<motion.div
										key={word.id}
										layoutId={word.id}
										className={styles.wordButton}
										transition={{
											type: "spring",
											stiffness: 400,
											damping: 28,
										}}
									>
										<SquareButton
											onClick={freeze ? undefined : () => handleBankWordClick(word)}
											backgroundColor="#8B5CF6"
											borderColor="#7C3AED"
										>
											{word.word}
										</SquareButton>
									</motion.div>
								))}
							</motion.div>
						))}
					</AnimatePresence>
				</motion.div>
			</div>
		</LayoutGroup>
	);
};
