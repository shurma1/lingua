import { FC, useEffect, useState } from "react";

import { Table } from "@components/Table/Table";
import Button from "@components/ui/Button";
import Popup from "@components/ui/Popup";
import Select from "@components/ui/Select/Select";
import { usePopup } from "@contexts/PopupContext";

import { useLanguagesMutations } from "@/hooks/useLanguages";
import { useLevelsMutations } from "@/hooks/useLevels";
import { useModulesMutations } from "@/hooks/useModules";
import { useQuestsMutations } from "@/hooks/useQuests";
import {
	QuestDTO,
	LanguageDTO,
	ModuleDTO,
	LevelDTO,
	CreateQuestRequestDTO,
	CreateQuestMatchWordsRequestDTO,
	CreateQuestDictationRequestDTO,
	CreateQuestTranslateRequestDTO,
	QuestType,
	MatchWordPairDTO,
} from "@/types/api";

import styles from "../../styles/components/AdminPanel/QuestPanel.module.scss";

const UI_STRINGS = {
	ADD_BUTTON: "Добавить квест",
	EDIT_TITLE: "Редактировать квест",
	CREATE_TITLE: "Создать квест",
	SAVE_BUTTON: "Сохранить",
	DELETE_CONFIRM_TITLE: "Удалить квест",
	DELETE_CONFIRM_MESSAGE: "Вы уверены, что хотите удалить этот квест?",
	DELETE_BUTTON: "Удалить",
	CANCEL_BUTTON: "Отмена",
	TABLE_HEADERS: {
		ID: "ID",
		TYPE: "Тип",
		LEVEL: "Уровень",
		DETAILS: "Детали",
		ACTIONS: "Действия",
	},
	FORM_LABELS: {
		TYPE: "Тип квеста",
		LEVEL: "Уровень",
		LANGUAGE: "Язык",
		MODULE: "Модуль",
		WORD: "Слово",
		TRANSLATE: "Перевод",
		WORD_PAIRS: "Пары слов",
		CORRECT_SENTENCE: "Правильное предложение",
		SOURCE_SENTENCE: "Исходное предложение",
		DISTRACTOR_WORDS: "Отвлекающие слова (через запятую, опционально)",
	},
	FORM_PLACEHOLDERS: {
		TYPE: "Выберите тип квеста",
		LEVEL: "Выберите уровень",
		LANGUAGE: "Выберите язык",
		MODULE: "Выберите модуль",
		WORD: "Введите слово",
		TRANSLATE: "Введите перевод",
		CORRECT_SENTENCE: "Введите правильное предложение",
		SOURCE_SENTENCE: "Введите исходное предложение",
		DISTRACTOR_WORDS: "лишнее1, лишнее2",
	},
	QUEST_TYPES: {
		MATCH_WORDS: "Сопоставление слов",
		DICTATION: "Диктант",
		TRANSLATE: "Перевод",
	},
	VALIDATION_ERRORS: {
		TYPE_REQUIRED: "Необходимо выбрать тип квеста",
		LEVEL_REQUIRED: "Необходимо выбрать уровень",
		MATCH_WORDS_REQUIRED: "Необходимо добавить хотя бы одну пару слов",
		WORD_REQUIRED: "Слово обязательно",
		TRANSLATE_REQUIRED: "Перевод обязателен",
		CORRECT_SENTENCE_REQUIRED: "Правильное предложение обязательно",
		SOURCE_SENTENCE_REQUIRED: "Исходное предложение обязательно",
	},
	ACTIONS: {
		EDIT: "Редактировать",
		DELETE: "Удалить",
		ADD: "Добавить",
		ADD_PAIR: "Добавить пару",
		VIEW: "Просмотр",
	},
	LOADING: "Загрузка...",
	SELECT_LEVEL: "Выберите уровень для просмотра квестов",
};

interface QuestFormData {
	type: QuestType;
	levelId: number;
	// MATCH_WORDS fields
	currentWord: string;
	currentTranslate: string;
	wordPairs: MatchWordPairDTO[];
	// DICTATION fields
	correctSentence?: string;
	distractorWords?: string;
	// TRANSLATE fields
	sourceSentence?: string;
}

interface QuestFormProps {
	initialData?: QuestDTO;
	levels: LevelDTO[];
	defaultLevelId?: number;
	onSave: (data: CreateQuestRequestDTO) => void;
}

const QuestForm: FC<QuestFormProps> = ({ initialData, levels, defaultLevelId, onSave }) => {
	const [formData, setFormData] = useState<QuestFormData>({
		type: initialData?.type || "MATCH_WORDS",
		levelId: initialData?.levelId || defaultLevelId || 0,
		currentWord: "",
		currentTranslate: "",
		wordPairs: [],
		correctSentence: "",
		distractorWords: "",
		sourceSentence: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleChange = (field: keyof QuestFormData, value: string | number) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: "" }));
	};

	const handleAddWordPair = () => {
		const newErrors: Record<string, string> = {};
		
		if (!formData.currentWord.trim()) {
			newErrors.currentWord = UI_STRINGS.VALIDATION_ERRORS.WORD_REQUIRED;
		}
		if (!formData.currentTranslate.trim()) {
			newErrors.currentTranslate = UI_STRINGS.VALIDATION_ERRORS.TRANSLATE_REQUIRED;
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		const newPair: MatchWordPairDTO = {
			word: formData.currentWord.trim(),
			translate: formData.currentTranslate.trim(),
		};

		setFormData((prev) => ({
			...prev,
			wordPairs: [...prev.wordPairs, newPair],
			currentWord: "",
			currentTranslate: "",
		}));
		setErrors({});
	};

	const handleRemoveWordPair = (index: number) => {
		setFormData((prev) => ({
			...prev,
			wordPairs: prev.wordPairs.filter((_, i) => i !== index),
		}));
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.type) {
			newErrors.type = UI_STRINGS.VALIDATION_ERRORS.TYPE_REQUIRED;
		}
		if (!formData.levelId || formData.levelId === 0) {
			newErrors.levelId = UI_STRINGS.VALIDATION_ERRORS.LEVEL_REQUIRED;
		}

		if (formData.type === "MATCH_WORDS") {
			if (formData.wordPairs.length === 0) {
				newErrors.wordPairs = UI_STRINGS.VALIDATION_ERRORS.MATCH_WORDS_REQUIRED;
			}
		} else if (formData.type === "DICTATION") {
			if (!formData.correctSentence?.trim()) {
				newErrors.correctSentence = UI_STRINGS.VALIDATION_ERRORS.CORRECT_SENTENCE_REQUIRED;
			}
		} else if (formData.type === "TRANSLATE") {
			if (!formData.sourceSentence?.trim()) {
				newErrors.sourceSentence = UI_STRINGS.VALIDATION_ERRORS.SOURCE_SENTENCE_REQUIRED;
			}
			if (!formData.correctSentence?.trim()) {
				newErrors.correctSentence = UI_STRINGS.VALIDATION_ERRORS.CORRECT_SENTENCE_REQUIRED;
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (!validateForm()) {
			return;
		}

		let createData: CreateQuestRequestDTO;

		if (formData.type === "MATCH_WORDS") {
			createData = {
				type: "MATCH_WORDS",
				levelId: formData.levelId,
				data: formData.wordPairs,
			} as CreateQuestMatchWordsRequestDTO;
		} else if (formData.type === "DICTATION") {
			createData = {
				type: "DICTATION",
				levelId: formData.levelId,
				correctSentence: formData.correctSentence!,
				distractorWords: formData.distractorWords
					? formData.distractorWords.split(",").map((w: string) => w.trim()).filter(Boolean)
					: undefined,
			} as CreateQuestDictationRequestDTO;
		} else {
			// TRANSLATE
			createData = {
				type: "TRANSLATE",
				levelId: formData.levelId,
				sourceSentence: formData.sourceSentence!,
				correctSentence: formData.correctSentence!,
				distractorWords: formData.distractorWords
					? formData.distractorWords.split(",").map((w: string) => w.trim()).filter(Boolean)
					: undefined,
			} as CreateQuestTranslateRequestDTO;
		}

		onSave(createData);
	};

	const isValid = formData.levelId > 0 && formData.type;

	return (
		<Popup
			title={initialData ? UI_STRINGS.EDIT_TITLE : UI_STRINGS.CREATE_TITLE}
			buttonText={UI_STRINGS.SAVE_BUTTON}
			onButtonClick={handleSubmit}
			buttonDisabled={!isValid}
		>
			<div className={styles.form}>
				<div className={styles.formGroup}>
					<label className={styles.label}>{UI_STRINGS.FORM_LABELS.TYPE}</label>
					<div className={errors.type ? styles.selectError : ""}>
						<Select
							options={[
								{ value: "MATCH_WORDS", label: UI_STRINGS.QUEST_TYPES.MATCH_WORDS },
								{ value: "DICTATION", label: UI_STRINGS.QUEST_TYPES.DICTATION },
								{ value: "TRANSLATE", label: UI_STRINGS.QUEST_TYPES.TRANSLATE },
							]}
							value={formData.type}
							onChange={(value) => handleChange("type", value as QuestType)}
							placeholder={UI_STRINGS.FORM_PLACEHOLDERS.TYPE}
							disabled={!!initialData}
						/>
					</div>
					{errors.type && <span className={styles.errorMessage}>{errors.type}</span>}
				</div>

				<div className={styles.formGroup}>
					<label className={styles.label}>{UI_STRINGS.FORM_LABELS.LEVEL}</label>
					<div className={errors.levelId ? styles.selectError : ""}>
						<Select
							options={levels.map((level) => ({
								value: level.id.toString(),
								label: `${level.icon} Level ${level.id}`,
							}))}
							value={formData.levelId ? formData.levelId.toString() : ""}
							onChange={(value) => handleChange("levelId", Number(value))}
							placeholder={UI_STRINGS.FORM_PLACEHOLDERS.LEVEL}
							disabled={!!initialData}
						/>
					</div>
					{errors.levelId && <span className={styles.errorMessage}>{errors.levelId}</span>}
				</div>

				{formData.type === "MATCH_WORDS" && (
					<>
						<div className={styles.formGroup}>
							<label className={styles.label}>{UI_STRINGS.FORM_LABELS.WORD}</label>
							<input
								type="text"
								className={`${styles.input} ${errors.currentWord ? styles.input_error : ""}`}
								value={formData.currentWord}
								onChange={(e) => handleChange("currentWord", e.target.value)}
								placeholder={UI_STRINGS.FORM_PLACEHOLDERS.WORD}
							/>
							{errors.currentWord && (
								<span className={styles.errorMessage}>{errors.currentWord}</span>
							)}
						</div>
						<div className={styles.formGroup}>
							<label className={styles.label}>{UI_STRINGS.FORM_LABELS.TRANSLATE}</label>
							<input
								type="text"
								className={`${styles.input} ${errors.currentTranslate ? styles.input_error : ""}`}
								value={formData.currentTranslate}
								onChange={(e) => handleChange("currentTranslate", e.target.value)}
								placeholder={UI_STRINGS.FORM_PLACEHOLDERS.TRANSLATE}
							/>
							{errors.currentTranslate && (
								<span className={styles.errorMessage}>{errors.currentTranslate}</span>
							)}
						</div>
						<div className={styles.formGroup}>
							<Button onClick={handleAddWordPair} className={styles.addPairButton}>
								{UI_STRINGS.ACTIONS.ADD_PAIR}
							</Button>
						</div>

						{formData.wordPairs.length > 0 && (
							<div className={styles.formGroup}>
								<label className={styles.label}>{UI_STRINGS.FORM_LABELS.WORD_PAIRS}</label>
								<div className={styles.wordPairsTable}>
									<table className={styles.table}>
										<thead>
											<tr>
												<th>{UI_STRINGS.FORM_LABELS.WORD}</th>
												<th>{UI_STRINGS.FORM_LABELS.TRANSLATE}</th>
												<th>{UI_STRINGS.TABLE_HEADERS.ACTIONS}</th>
											</tr>
										</thead>
										<tbody>
											{formData.wordPairs.map((pair, index) => (
												<tr key={index}>
													<td>{pair.word}</td>
													<td>{pair.translate}</td>
													<td>
														<button
															type="button"
															className={styles.removeButton}
															onClick={() => handleRemoveWordPair(index)}
														>
															{UI_STRINGS.ACTIONS.DELETE}
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
								{errors.wordPairs && (
									<span className={styles.errorMessage}>{errors.wordPairs}</span>
								)}
							</div>
						)}
					</>
				)}

				{formData.type === "DICTATION" && (
					<>
						<div className={styles.formGroup}>
							<label className={styles.label}>{UI_STRINGS.FORM_LABELS.CORRECT_SENTENCE}</label>
							<input
								type="text"
								className={`${styles.input} ${errors.correctSentence ? styles.input_error : ""}`}
								value={formData.correctSentence || ""}
								onChange={(e) => handleChange("correctSentence", e.target.value)}
								placeholder={UI_STRINGS.FORM_PLACEHOLDERS.CORRECT_SENTENCE}
							/>
							{errors.correctSentence && (
								<span className={styles.errorMessage}>{errors.correctSentence}</span>
							)}
						</div>
						<div className={styles.formGroup}>
							<label className={styles.label}>{UI_STRINGS.FORM_LABELS.DISTRACTOR_WORDS}</label>
							<input
								type="text"
								className={styles.input}
								value={formData.distractorWords || ""}
								onChange={(e) => handleChange("distractorWords", e.target.value)}
								placeholder={UI_STRINGS.FORM_PLACEHOLDERS.DISTRACTOR_WORDS}
							/>
						</div>
					</>
				)}

				{formData.type === "TRANSLATE" && (
					<>
						<div className={styles.formGroup}>
							<label className={styles.label}>{UI_STRINGS.FORM_LABELS.SOURCE_SENTENCE}</label>
							<input
								type="text"
								className={`${styles.input} ${errors.sourceSentence ? styles.input_error : ""}`}
								value={formData.sourceSentence || ""}
								onChange={(e) => handleChange("sourceSentence", e.target.value)}
								placeholder={UI_STRINGS.FORM_PLACEHOLDERS.SOURCE_SENTENCE}
							/>
							{errors.sourceSentence && (
								<span className={styles.errorMessage}>{errors.sourceSentence}</span>
							)}
						</div>
						<div className={styles.formGroup}>
							<label className={styles.label}>{UI_STRINGS.FORM_LABELS.CORRECT_SENTENCE}</label>
							<input
								type="text"
								className={`${styles.input} ${errors.correctSentence ? styles.input_error : ""}`}
								value={formData.correctSentence || ""}
								onChange={(e) => handleChange("correctSentence", e.target.value)}
								placeholder={UI_STRINGS.FORM_PLACEHOLDERS.CORRECT_SENTENCE}
							/>
							{errors.correctSentence && (
								<span className={styles.errorMessage}>{errors.correctSentence}</span>
							)}
						</div>
						<div className={styles.formGroup}>
							<label className={styles.label}>{UI_STRINGS.FORM_LABELS.DISTRACTOR_WORDS}</label>
							<input
								type="text"
								className={styles.input}
								value={formData.distractorWords || ""}
								onChange={(e) => handleChange("distractorWords", e.target.value)}
								placeholder={UI_STRINGS.FORM_PLACEHOLDERS.DISTRACTOR_WORDS}
							/>
						</div>
					</>
				)}
			</div>
		</Popup>
	);
};

const QuestPanel: FC = () => {
	const [quests, setQuests] = useState<QuestDTO[]>([]);
	const [languages, setLanguages] = useState<LanguageDTO[]>([]);
	const [modules, setModules] = useState<ModuleDTO[]>([]);
	const [levels, setLevels] = useState<LevelDTO[]>([]);
	const [selectedLanguageId, setSelectedLanguageId] = useState<number | null>(null);
	const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
	const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const { openPopup, closePopup } = usePopup();
	const { fetchQuestsByLevel, createQuest, deleteQuest, fetchQuestById } = useQuestsMutations();
	const { fetchLanguages } = useLanguagesMutations();
	const { fetchModulesByLanguage } = useModulesMutations();
	const { fetchLevelsByModule } = useLevelsMutations();

	useEffect(() => {
		loadLanguages();
	}, []);

	useEffect(() => {
		if (selectedLanguageId) {
			loadModules(selectedLanguageId);
			setSelectedModuleId(null);
			setSelectedLevelId(null);
		}
	}, [selectedLanguageId]);

	useEffect(() => {
		if (selectedModuleId) {
			loadLevels(selectedModuleId);
			setSelectedLevelId(null);
		} else {
			setLevels([]);
		}
	}, [selectedModuleId]);

	useEffect(() => {
		if (selectedLevelId) {
			loadQuests(selectedLevelId);
		} else {
			setQuests([]);
		}
	}, [selectedLevelId]);

	const loadLanguages = async () => {
		try {
			const data = await fetchLanguages();
			setLanguages(data);
			if (data.length > 0 && !selectedLanguageId) {
				setSelectedLanguageId(data[0].id);
			}
		} catch (error) {
			console.error("Failed to load languages:", error);
		}
	};

	const loadModules = async (languageId: number) => {
		try {
			const data = await fetchModulesByLanguage(languageId);
			setModules(data);
			if (data.length > 0 && !selectedModuleId) {
				setSelectedModuleId(data[0].id);
			}
		} catch (error) {
			console.error("Failed to load modules:", error);
		}
	};

	const loadLevels = async (moduleId: number) => {
		try {
			const data = await fetchLevelsByModule(moduleId);
			setLevels(data);
			if (data.length > 0 && !selectedLevelId) {
				setSelectedLevelId(data[0].id);
			}
		} catch (error) {
			console.error("Failed to load levels:", error);
		}
	};

	const loadQuests = async (levelId: number) => {
		setLoading(true);
		try {
			const data = await fetchQuestsByLevel(levelId);
			setQuests(data);
		} catch (error) {
			console.error("Failed to load quests:", error);
			setQuests([]);
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = () => {
		openPopup(
			<QuestForm
				levels={levels}
				defaultLevelId={selectedLevelId || undefined}
				onSave={async (data) => {
					try {
						await createQuest(data);
						// The hook already adds the lightweight version to the store
						// Reload the list to get fresh data
						if (selectedLevelId) {
							loadQuests(selectedLevelId);
						}
						closePopup();
					} catch (error) {
						console.error("Failed to create quest:", error);
					}
				}}
			/>,
		);
	};

	const handleDelete = (quest: QuestDTO) => {
		openPopup(
			<Popup
				title={UI_STRINGS.DELETE_CONFIRM_TITLE}
				buttonText={UI_STRINGS.DELETE_BUTTON}
				onButtonClick={async () => {
					try {
						await deleteQuest(quest.id);
						setQuests((prev) => prev.filter((q) => q.id !== quest.id));
						closePopup();
					} catch (error) {
						console.error("Failed to delete quest:", error);
					}
				}}
			>
				<div className={styles.deleteConfirm}>
					<p>{UI_STRINGS.DELETE_CONFIRM_MESSAGE}</p>
					<p className={styles.questInfo}>
						<strong>
							{UI_STRINGS.QUEST_TYPES[quest.type]} (ID: {quest.id})
						</strong>
					</p>
				</div>
			</Popup>,
		);
	};

	const handleView = async (quest: QuestDTO) => {
		try {
			const fullQuest = await fetchQuestById(quest.id);
			
			openPopup(
				<Popup
					title={`${UI_STRINGS.QUEST_TYPES[quest.type]} (ID: ${quest.id})`}
					buttonText="Закрыть"
					onButtonClick={() => closePopup()}
				>
					<div className={styles.questView}>
						{fullQuest.type === "MATCH_WORDS" && (
							<div className={styles.wordPairsTable}>
								<table className={styles.table}>
									<thead>
										<tr>
											<th>{UI_STRINGS.FORM_LABELS.WORD}</th>
											<th>{UI_STRINGS.FORM_LABELS.TRANSLATE}</th>
										</tr>
									</thead>
									<tbody>
										{fullQuest.match_words.map((pair, index) => (
											<tr key={index}>
												<td>{pair.word}</td>
												<td>{pair.translate}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
						{fullQuest.type === "DICTATION" && (
							<div className={styles.questDetails}>
								<div className={styles.detailRow}>
									<strong>{UI_STRINGS.FORM_LABELS.CORRECT_SENTENCE}:</strong>
									<span>{fullQuest.correctSentence}</span>
								</div>
								{fullQuest.words && fullQuest.words.length > 0 && (
									<div className={styles.detailRow}>
										<strong>Слова:</strong>
										<div className={styles.wordsList}>
											{fullQuest.words.map((word) => (
												<span key={word.id} className={styles.wordChip}>
													{word.value}
												</span>
											))}
										</div>
									</div>
								)}
							</div>
						)}
						{fullQuest.type === "TRANSLATE" && (
							<div className={styles.questDetails}>
								<div className={styles.detailRow}>
									<strong>{UI_STRINGS.FORM_LABELS.SOURCE_SENTENCE}:</strong>
									<span>{fullQuest.sourceSentence}</span>
								</div>
								<div className={styles.detailRow}>
									<strong>{UI_STRINGS.FORM_LABELS.CORRECT_SENTENCE}:</strong>
									<span>{fullQuest.correctSentence}</span>
								</div>
								{fullQuest.words && fullQuest.words.length > 0 && (
									<div className={styles.detailRow}>
										<strong>Слова:</strong>
										<div className={styles.wordsList}>
											{fullQuest.words.map((word) => (
												<span key={word.id} className={styles.wordChip}>
													{word.value}
												</span>
											))}
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				</Popup>,
			);
		} catch (error) {
			console.error("Failed to load quest details:", error);
		}
	};

	const getQuestDetails = (quest: QuestDTO): string => {
		// Lightweight quests don't have detailed data, just show type
		return UI_STRINGS.QUEST_TYPES[quest.type];
	};

	const availableModules = modules.filter((mod) => mod.languageId === selectedLanguageId);
	const availableLevels = levels.filter((lvl) => lvl.moduleId === selectedModuleId);

	return (
		<div className={styles.questPanel}>
			<div className={styles.header}>
				<div className={styles.headerSelectors}>
					<Select
						options={languages.map((lang) => ({
							value: lang.id.toString(),
							label: `${lang.icon} ${lang.name}`,
						}))}
						value={selectedLanguageId ? selectedLanguageId.toString() : ""}
						onChange={(value) => setSelectedLanguageId(Number(value))}
						placeholder={UI_STRINGS.FORM_PLACEHOLDERS.LANGUAGE}
						className={styles.languageSelect}
					/>
					{selectedLanguageId && (
						<Select
							options={availableModules.map((module) => ({
								value: module.id.toString(),
								label: `${module.icon} ${module.name}`,
							}))}
							value={selectedModuleId ? selectedModuleId.toString() : ""}
							onChange={(value) => setSelectedModuleId(Number(value))}
							placeholder={UI_STRINGS.FORM_PLACEHOLDERS.MODULE}
							className={styles.moduleSelect}
						/>
					)}
					{selectedModuleId && (
						<Select
							options={availableLevels.map((level) => ({
								value: level.id.toString(),
								label: `${level.icon} Level ${level.id}`,
							}))}
							value={selectedLevelId ? selectedLevelId.toString() : ""}
							onChange={(value) => setSelectedLevelId(Number(value))}
							placeholder={UI_STRINGS.FORM_PLACEHOLDERS.LEVEL}
							className={styles.levelSelect}
						/>
					)}
				</div>
				<div className={styles.headerControls}>
					<Button
						onClick={handleCreate}
						className={styles.addButton}
						disabled={!selectedLevelId}
					>
						{UI_STRINGS.ADD_BUTTON}
					</Button>
				</div>
			</div>
			{selectedLevelId ? (
				<div className={styles.tableContainer}>
					<Table
						columns={[
							{
								accessor: "id",
								header: UI_STRINGS.TABLE_HEADERS.ID,
								align: "center",
								width: 80,
							},
							{
								accessor: "type",
								header: UI_STRINGS.TABLE_HEADERS.TYPE,
								align: "center",
								cell: (value) => UI_STRINGS.QUEST_TYPES[value as QuestType],
							},
							{
								accessor: "levelId",
								header: UI_STRINGS.TABLE_HEADERS.LEVEL,
								align: "center",
								cell: (value) => {
									const level = levels.find((lvl) => lvl.id === value);
									return level ? `${level.icon} ${value}` : String(value);
								},
							},
							{
								accessor: "type",
								header: UI_STRINGS.TABLE_HEADERS.DETAILS,
								align: "left",
								cell: (_, record) => getQuestDetails(record as QuestDTO),
							},
							{
								accessor: "id",
								header: UI_STRINGS.TABLE_HEADERS.ACTIONS,
								align: "center",
								cell: (_, record) => (
									<div className={styles.actions}>
										<button
											className={`${styles.actionButton} ${styles.actionButton_view}`}
											onClick={(e) => {
												e.stopPropagation();
												handleView(record as QuestDTO);
											}}
										>
											{UI_STRINGS.ACTIONS.VIEW}
										</button>
										<button
											className={`${styles.actionButton} ${styles.actionButton_delete}`}
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(record as QuestDTO);
											}}
										>
											{UI_STRINGS.ACTIONS.DELETE}
										</button>
									</div>
								),
							},
						]}
						data={quests}
						rowKey={(record) => record.id}
						loading={loading}
					/>
				</div>
			) : (
				<div className={styles.emptyState}>
					<p>{UI_STRINGS.SELECT_LEVEL}</p>
				</div>
			)}
		</div>
	);
};

export default QuestPanel;
