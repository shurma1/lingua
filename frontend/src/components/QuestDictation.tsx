import React, { useState, useEffect } from "react";

import styles from "@styles/components/QuestDictation.module.scss";

import { QuestDictationDTO } from "@/types/api";

import { SquareButton } from "./SquareButton";
import { WordsKeyboard } from "./WordsKeyboard";

interface QuestDictationProps {
	quest: QuestDictationDTO;
	onComplete: () => void;
	playAudio: (mediaId: string) => void;
	onCheckAnswer: (checkFn: () => void) => void;
	onSentenceChange: (hasContent: boolean) => void;
}

export const QuestDictation: React.FC<QuestDictationProps> = ({
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

	const handlePlayAudio = () => {
		if (quest.mediaId) {
			playAudio(quest.mediaId);
		}
	};

	return (
		<div className={styles.questDictation}>
			<div className={styles.audioSection}>
				{quest.mediaId && (
					<SquareButton
						onClick={handlePlayAudio}
						backgroundColor="var(--accent-color)"
						borderColor="var(--sub-accent-color)"
						type="bordered"
					>
						<span className={styles.playIcon}>▶</span>
						<span className={styles.playText}>Прослушать аудио</span>
					</SquareButton>
				)}
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
