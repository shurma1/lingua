import {FC, useState, useEffect, useRef, useCallback} from "react";

import {QuestDictation} from "@components/QuestDictation";
import QuestMathWords from "@components/QuestMathWords";
import {QuestTranslate} from "@components/QuestTranslate";
import Button from "@components/ui/Button";
import FullScreenLoader from "@components/ui/FullScreenLoader";
import {Progress} from "@components/ui/Progress";
import cls from "@utils/cls";

import {usePopup} from "@/contexts/PopupContext";
import {useQuestsMutations} from "@/hooks";
import {useLevelsMutations} from "@/hooks";
import {apiClient} from "@/http";
import {QuestFullDTO} from "@/types/api";

import styles from "./LevelPage.module.scss";



interface LevelPageProps {
	levelId: number;
}

const LevelPage: FC<LevelPageProps> = ({ levelId }) => {
	const [quests, setQuests] = useState<QuestFullDTO[]>([]);
	const [media, setMedia] = useState<Map<string, HTMLAudioElement>>(new Map());
	const [currentQuestIndex, setCurrentQuestIndex] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [footerButtonEnabled, setFooterButtonEnabled] = useState<boolean>(false);
	const [footerButtonText, setFooterButtonText] = useState<string>("Проверить");
	const [onFooterButtonClick, setOnFooterButtonClick] = useState<(() => void) | null>(null);
	const [completedQuestsCount, setCompletedQuestsCount] = useState<number>(0);
	const [isLevelSubmitted, setIsLevelSubmitted] = useState<boolean>(false);
	
	const { fetchQuestsByLevel, fetchQuestById } = useQuestsMutations();
	const { submitLevel } = useLevelsMutations();
	const { closePopup } = usePopup();
	const currentAudioRef = useRef<HTMLAudioElement | null>(null);

	// Fetch all quests and their full details
	useEffect(() => {
		const loadQuests = async () => {
			try {
				setIsLoading(true);
				
				// Step 1: Fetch all quests for this level
				const questList = await fetchQuestsByLevel(levelId);
				
				// Step 2: Fetch full details for each quest
				const fullQuests: QuestFullDTO[] = [];
				const mediaIds = new Set<string>();
				
				for (const quest of questList) {
					const fullQuest = await fetchQuestById(quest.id);
					fullQuests.push(fullQuest);
					
					// Collect all mediaIds from the quest
					if (fullQuest.type === "DICTATION") {
						if (fullQuest.mediaId) {
							mediaIds.add(fullQuest.mediaId);
						}
						fullQuest.words.forEach((word) => {
							if (word.mediaId) {
								mediaIds.add(word.mediaId);
							}
						});
					} else if (fullQuest.type === "TRANSLATE") {
						fullQuest.words.forEach((word) => {
							if (word.mediaId) {
								mediaIds.add(word.mediaId);
							}
						});
					}
				}
				
				// Step 3: Preload all media files
				const mediaMap = new Map<string, HTMLAudioElement>();
				for (const mediaId of mediaIds) {
					try {
						const mediaUrl = apiClient.media.getMediaUrl(mediaId);
						console.log(`Preloading media ${mediaId} from ${mediaUrl}`);
						
						// Fetch the audio file with authentication headers
						const response = await fetch(mediaUrl, {
							credentials: "include",
							headers: {
								"Authorization": apiClient.media.getAxiosInstance().defaults.headers.common["Authorization"] as string || "",
							},
						});
						
						if (!response.ok) {
							throw new Error(`HTTP error! status: ${response.status}`);
						}
						
						const blob = await response.blob();
						const objectUrl = URL.createObjectURL(blob);
						
						const audio = new Audio();
						audio.src = objectUrl;
						audio.preload = "auto";
						
						// Wait for the audio to be ready
						await new Promise<void>((resolve, reject) => {
							const handleCanPlay = () => {
								audio.removeEventListener("canplaythrough", handleCanPlay);
								audio.removeEventListener("error", handleError);
								console.log(`Successfully preloaded media ${mediaId}`);
								resolve();
							};
							
							const handleError = (e: Event) => {
								audio.removeEventListener("canplaythrough", handleCanPlay);
								audio.removeEventListener("error", handleError);
								console.error(`Failed to load media ${mediaId}:`, e);
								reject(e);
							};
							
							audio.addEventListener("canplaythrough", handleCanPlay);
							audio.addEventListener("error", handleError);
							audio.load();
						}).catch(() => {
							console.warn(`Skipping media ${mediaId} due to load error`);
							URL.revokeObjectURL(objectUrl); // Clean up if failed
						});
						
						mediaMap.set(mediaId, audio);
					} catch (error) {
						console.error(`Error preloading media ${mediaId}:`, error);
					}
				}
				
				setQuests(fullQuests);
				setMedia(mediaMap);
			} catch (error) {
				console.error("Failed to load quests:", error);
			} finally {
				setIsLoading(false);
			}
		};
		
		loadQuests();
	}, [levelId, fetchQuestsByLevel, fetchQuestById]);

	// Cleanup: revoke object URLs when component unmounts
	useEffect(() => {
		return () => {
			media.forEach((audio) => {
				if (audio.src.startsWith("blob:")) {
					URL.revokeObjectURL(audio.src);
				}
			});
		};
	}, [media]);

	// Helper function to play audio
	const playAudio = useCallback((mediaId: string) => {
		console.log(`Attempting to play audio: ${mediaId}`);
		
		// Stop any currently playing audio
		if (currentAudioRef.current) {
			currentAudioRef.current.pause();
			currentAudioRef.current.currentTime = 0;
		}
		
		const audio = media.get(mediaId);
		if (audio) {
			// Check if audio has a valid source
			if (!audio.src) {
				console.error(`Audio ${mediaId} has no source`);
				return;
			}
			
			console.log(`Playing audio from: ${audio.src}`);
			currentAudioRef.current = audio;
			audio.currentTime = 0;
			audio.play().catch((error) => {
				console.error(`Failed to play audio ${mediaId}:`, error);
			});
		} else {
			console.warn(`Audio not found for mediaId: ${mediaId}. Available media IDs:`, Array.from(media.keys()));
		}
	}, [media]);

	const handleQuestComplete = () => {
		setCompletedQuestsCount((prev) => prev + 1);
		setFooterButtonEnabled(true);
		setFooterButtonText(currentQuestIndex < quests.length - 1 ? "Далее" : "Завершить");
		setOnFooterButtonClick(() => handleNextQuest);
	};
	
	const handleNextQuest = () => {
		if (currentQuestIndex < quests.length - 1) {
			setCurrentQuestIndex((prev) => prev + 1);
			// Reset footer state for next quest
			setFooterButtonEnabled(false);
			setFooterButtonText("Проверить");
			setOnFooterButtonClick(null);
		} else {
			// All quests completed - submit level with 100% score
			handleLevelComplete();
		}
	};

	const handleLevelComplete = async () => {
		// Prevent multiple submissions
		if (isLevelSubmitted) {
			console.log("Level already submitted, skipping...");
			return;
		}
		
		try {
			setIsLevelSubmitted(true);
			await submitLevel(levelId, 100);
			console.log("Level completed successfully!");
			// Close the popup after successful submission
			closePopup();
		} catch (error) {
			console.error("Failed to submit level:", error);
			// Reset the flag if submission failed so user can retry
			setIsLevelSubmitted(false);
		}
	};

	const handleCheckAnswer = (onCheck: () => void) => {
		setOnFooterButtonClick(() => onCheck);
	};

	const handleSentenceChange = (hasContent: boolean) => {
		setFooterButtonEnabled(hasContent);
	};

	if (isLoading) {
		return (
			<div className={styles.container}>
				<div className={styles.content}>
					<FullScreenLoader/>
				</div>
			</div>
		);
	}

	if (quests.length === 0) {
		return (
			<div className={styles.container}>
				<div className={styles.content}>
					<p>No quests available</p>
				</div>
			</div>
		);
	}

	const currentQuest = quests[currentQuestIndex];
	const progress = (completedQuestsCount / quests.length) * 100;

	// Render appropriate quest component based on type
	const renderQuest = () => {
		switch (currentQuest.type) {
			case "MATCH_WORDS":
				return (
					<QuestMathWords
						pairs={currentQuest.match_words}
						onComplete={handleQuestComplete}
					/>
				);
			
			case "TRANSLATE":
				return (
					<QuestTranslate
						quest={currentQuest}
						onComplete={handleQuestComplete}
						playAudio={playAudio}
						onCheckAnswer={handleCheckAnswer}
						onSentenceChange={handleSentenceChange}
					/>
				);
			
			case "DICTATION":
				return (
					<QuestDictation
						quest={currentQuest}
						onComplete={handleQuestComplete}
						playAudio={playAudio}
						onCheckAnswer={handleCheckAnswer}
						onSentenceChange={handleSentenceChange}
					/>
				);
			
			default:
				return <p>Unknown quest type</p>;
		}
	};
	
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Progress value={progress}/>
			</div>
			<div className={styles.content}>
				{renderQuest()}
			</div>
			<div className={cls(styles.footer, styles.footerShow)}>
				<Button
					size="large"
					className={styles.button}
					containerClasses={styles.button}
					onClick={() => onFooterButtonClick?.()}
					disabled={!footerButtonEnabled}
				>
					{footerButtonText}
				</Button>
			</div>
		</div>
	);
};

export default LevelPage;
