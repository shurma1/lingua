import React, { useState, useEffect } from "react";

import styles from "@styles/components/QuestTranslate.module.scss";

import { QuestTranslateDTO } from "@/types/api";

import { WordsKeyboard } from "./WordsKeyboard";

interface QuestTranslateProps {
	quest: QuestTranslateDTO;
	onComplete: () => void;
	playAudio: (mediaId: string) => void;
	onCheckAnswer: (checkFn: () => void) => void;
	onSentenceChange: (hasContent: boolean) => void;
}

export const QuestTranslate: React.FC<QuestTranslateProps> = ({
	quest,
	onComplete,
	playAudio,
	onCheckAnswer,
	onSentenceChange,
}) => {
	const [currentSentence, setCurrentSentence] = useState<string>("");
	const [sentenceType, setSentenceType] = useState<"clear" | "error" | "success">("clear");
	const [freeze, setFreeze] = useState<boolean>(false);

	const keyboardWords = quest.words.map((word) => ({
		id: word.id,
		word: word.value,
		mediaId: word.mediaId,
	}));

	const handleCheckAnswer = () => {
		const userAnswer = currentSentence.trim();
		const correctAnswer = quest.correctSentence.trim();
		
		if (userAnswer === correctAnswer) {
			setSentenceType("success");
			setFreeze(true);
			onComplete();
		} else {
			setSentenceType("error");
			setFreeze(true);
			setTimeout(() => {
				setSentenceType("clear");
				setFreeze(false);
			}, 1000);
		}
	};

	useEffect(() => {
		onCheckAnswer(handleCheckAnswer);
		onSentenceChange(currentSentence.trim().length > 0);
	}, [currentSentence]);

	const handleWordClick = (word: { id: string; word: string }) => {
		const wordData = quest.words.find((w) => w.id === word.id);
		
		if (wordData?.mediaId) {
			playAudio(wordData.mediaId);
		}
	};

	return (
		<div className={styles.questTranslate}>
			<div className={styles.sourceSentence}>
				<p>{quest.sourceSentence}</p>
			</div>
			
			<WordsKeyboard
				words={keyboardWords}
				onChange={setCurrentSentence}
				onWordClick={handleWordClick}
				sentenceType={sentenceType}
				freeze={freeze}
			/>
		</div>
	);
};
