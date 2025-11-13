import { FC, useEffect, useState, useRef } from "react";

import { Table } from "@components/Table/Table";
import Button from "@components/ui/Button";
import MarkdownText from "@components/ui/MarkdownText";
import Popup from "@components/ui/Popup";
import Select from "@components/ui/Select/Select";
import { usePopup } from "@contexts/PopupContext";

import { useLanguagesMutations } from "@/hooks/useLanguages";
import { useLessonsMutations } from "@/hooks/useLessons";
import { useModulesMutations } from "@/hooks/useModules";
import { LessonDTO, LanguageDTO, ModuleDTO, CreateLessonRequestDTO, UpdateLessonRequestDTO } from "@/types/api";

import styles from "../../styles/components/AdminPanel/LessonPanel.module.scss";

const UI_STRINGS = {
	ADD_BUTTON: "Добавить урок",
	EDIT_TITLE: "Редактировать урок",
	CREATE_TITLE: "Создать урок",
	SAVE_BUTTON: "Сохранить",
	DELETE_CONFIRM_TITLE: "Удалить урок",
	DELETE_CONFIRM_MESSAGE: "Вы уверены, что хотите удалить этот урок?",
	DELETE_BUTTON: "Удалить",
	CANCEL_BUTTON: "Отмена",
	TABLE_HEADERS: {
		ID: "ID",
		TITLE: "Название",
		MODULE: "Модуль",
		TEXT_PREVIEW: "Превью текста",
		ACTIONS: "Действия",
	},
	FORM_LABELS: {
		TITLE: "Название урока",
		TEXT: "Текст урока",
		LANGUAGE: "Язык",
		MODULE: "Модуль",
	},
	FORM_PLACEHOLDERS: {
		TITLE: "Введите название урока",
		TEXT: "Введите текст урока...",
		LANGUAGE: "Выберите язык",
		MODULE: "Выберите модуль",
	},
	VALIDATION_ERRORS: {
		TITLE_REQUIRED: "Название обязательно",
		TEXT_REQUIRED: "Текст урока обязателен",
		MODULE_REQUIRED: "Необходимо выбрать модуль",
	},
	ACTIONS: {
		EDIT: "Редактировать",
		DELETE: "Удалить",
	},
	LOADING: "Загрузка...",
	SELECT_LANGUAGE: "Выберите язык для просмотра уроков",
	TOOLBAR: {
		BOLD: "Жирный",
		ITALIC: "Курсив",
		UNDERLINE: "Подчеркнутый",
		HEADING: "Заголовок",
		PARAGRAPH: "Параграф",
	},
};

interface LessonFormData {
	title: string;
	text: string;
	moduleId: number;
}

interface LessonFormProps {
	initialData?: LessonDTO;
	modules: ModuleDTO[];
	defaultModuleId?: number;
	onSave: (data: CreateLessonRequestDTO | UpdateLessonRequestDTO, moduleId: number) => void;
}

const LessonForm: FC<LessonFormProps> = ({ initialData, modules, defaultModuleId, onSave }) => {
	const [formData, setFormData] = useState<LessonFormData>({
		title: initialData?.title || "",
		text: initialData?.text || "",
		moduleId: initialData?.moduleId || defaultModuleId || 0,
	});
	const [titleError, setTitleError] = useState<string>("");
	const [textError, setTextError] = useState<string>("");
	const [moduleError, setModuleError] = useState<string>("");
	const editorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (editorRef.current && formData.text) {
			editorRef.current.innerHTML = formData.text;
		}
	}, []);

	const handleChange = (field: keyof LessonFormData, value: string | number) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (field === "title") {
			setTitleError("");
		}
		if (field === "text") {
			setTextError("");
		}
		if (field === "moduleId") {
			setModuleError("");
		}
	};

	const handleEditorInput = () => {
		if (editorRef.current) {
			const content = editorRef.current.innerHTML;
			handleChange("text", content);
		}
	};

	const applyFormatting = (command: string, value?: string) => {
		document.execCommand(command, false, value);
		editorRef.current?.focus();
		handleEditorInput();
	};

	const validateTitle = (title: string): boolean => {
		if (!title.trim()) {
			setTitleError(UI_STRINGS.VALIDATION_ERRORS.TITLE_REQUIRED);
			return false;
		}
		return true;
	};

	const validateText = (text: string): boolean => {
		// Strip HTML tags to check if there's actual content
		const tempDiv = document.createElement("div");
		tempDiv.innerHTML = text;
		const textContent = tempDiv.textContent || tempDiv.innerText || "";
		
		if (!textContent.trim()) {
			setTextError(UI_STRINGS.VALIDATION_ERRORS.TEXT_REQUIRED);
			return false;
		}
		return true;
	};

	const validateModule = (moduleId: number): boolean => {
		if (!moduleId || moduleId === 0) {
			setModuleError(UI_STRINGS.VALIDATION_ERRORS.MODULE_REQUIRED);
			return false;
		}
		return true;
	};

	const handleSubmit = () => {
		const isTitleValid = validateTitle(formData.title);
		const isTextValid = validateText(formData.text);
		const isModuleValid = validateModule(formData.moduleId);

		if (!isTitleValid || !isTextValid || !isModuleValid) {
			return;
		}

		if (initialData) {
			// Update - only send changed fields
			const updateData: UpdateLessonRequestDTO = {};
			if (formData.title !== initialData.title) {
				updateData.title = formData.title;
			}
			if (formData.text !== initialData.text) {
				updateData.text = formData.text;
			}
			onSave(updateData, formData.moduleId);
		} else {
			// Create - send all required fields
			const createData: CreateLessonRequestDTO = {
				title: formData.title,
				text: formData.text,
			};
			onSave(createData, formData.moduleId);
		}
	};

	// Check if text has actual content (strip HTML)
	const hasTextContent = (): boolean => {
		const tempDiv = document.createElement("div");
		tempDiv.innerHTML = formData.text;
		const textContent = tempDiv.textContent || tempDiv.innerText || "";
		return textContent.trim().length > 0;
	};

	const isValid = formData.title.trim() && hasTextContent() && formData.moduleId > 0;

	return (
		<Popup
			title={initialData ? UI_STRINGS.EDIT_TITLE : UI_STRINGS.CREATE_TITLE}
			buttonText={UI_STRINGS.SAVE_BUTTON}
			onButtonClick={handleSubmit}
			buttonDisabled={!isValid}
		>
			<div className={styles.form}>
				<div className={styles.formGroup}>
					<label className={styles.label}>{UI_STRINGS.FORM_LABELS.TITLE}</label>
					<input
						type="text"
						className={`${styles.input} ${titleError ? styles.input_error : ""}`}
						value={formData.title}
						onChange={(e) => handleChange("title", e.target.value)}
						placeholder={UI_STRINGS.FORM_PLACEHOLDERS.TITLE}
					/>
					{titleError && <span className={styles.errorMessage}>{titleError}</span>}
				</div>
				<div className={styles.formGroup}>
					<label className={styles.label}>{UI_STRINGS.FORM_LABELS.MODULE}</label>
					<div className={moduleError ? styles.selectError : ""}>
						<Select
							options={modules.map((module) => ({
								value: module.id.toString(),
								label: `${module.icon} ${module.name}`,
							}))}
							value={formData.moduleId ? formData.moduleId.toString() : ""}
							onChange={(value) => handleChange("moduleId", Number(value))}
							placeholder={UI_STRINGS.FORM_PLACEHOLDERS.MODULE}
							disabled={!!initialData}
						/>
					</div>
					{moduleError && <span className={styles.errorMessage}>{moduleError}</span>}
				</div>
				<div className={styles.formGroup}>
					<label className={styles.label}>{UI_STRINGS.FORM_LABELS.TEXT}</label>
					<div className={styles.textEditorContainer}>
						<div className={styles.toolbar}>
							<button
								type="button"
								className={styles.toolbarButton}
								onMouseDown={(e) => {
									e.preventDefault();
									applyFormatting("bold");
								}}
								title={UI_STRINGS.TOOLBAR.BOLD}
							>
								<strong>B</strong>
							</button>
							<button
								type="button"
								className={styles.toolbarButton}
								onMouseDown={(e) => {
									e.preventDefault();
									applyFormatting("italic");
								}}
								title={UI_STRINGS.TOOLBAR.ITALIC}
							>
								<em>I</em>
							</button>
							<button
								type="button"
								className={styles.toolbarButton}
								onMouseDown={(e) => {
									e.preventDefault();
									applyFormatting("underline");
								}}
								title={UI_STRINGS.TOOLBAR.UNDERLINE}
							>
								<u>U</u>
							</button>
							<div className={styles.toolbarDivider} />
							<button
								type="button"
								className={styles.toolbarButton}
								onMouseDown={(e) => {
									e.preventDefault();
									applyFormatting("formatBlock", "h2");
								}}
								title={UI_STRINGS.TOOLBAR.HEADING}
							>
								H2
							</button>
							<button
								type="button"
								className={styles.toolbarButton}
								onMouseDown={(e) => {
									e.preventDefault();
									applyFormatting("formatBlock", "p");
								}}
								title={UI_STRINGS.TOOLBAR.PARAGRAPH}
							>
								¶
							</button>
						</div>
						<div
							ref={editorRef}
							className={`${styles.editor} ${textError ? styles.editor_error : ""}`}
							contentEditable
							onInput={handleEditorInput}
							data-placeholder={UI_STRINGS.FORM_PLACEHOLDERS.TEXT}
						/>
					</div>
					{textError && <span className={styles.errorMessage}>{textError}</span>}
				</div>
			</div>
		</Popup>
	);
};

const LessonPanel: FC = () => {
	const [lessons, setLessons] = useState<LessonDTO[]>([]);
	const [languages, setLanguages] = useState<LanguageDTO[]>([]);
	const [modules, setModules] = useState<ModuleDTO[]>([]);
	const [selectedLanguageId, setSelectedLanguageId] = useState<number | null>(null);
	const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const { openPopup, closePopup } = usePopup();
	const { fetchModuleLesson, createLesson, updateLesson, deleteLesson } = useLessonsMutations();
	const { fetchLanguages } = useLanguagesMutations();
	const { fetchModulesByLanguage } = useModulesMutations();

	useEffect(() => {
		loadLanguages();
	}, []);

	useEffect(() => {
		if (selectedLanguageId) {
			loadModules(selectedLanguageId);
			setSelectedModuleId(null);
		}
	}, [selectedLanguageId]);

	useEffect(() => {
		if (selectedModuleId) {
			loadLesson(selectedModuleId);
		} else {
			setLessons([]);
		}
	}, [selectedModuleId]);

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

	const loadLesson = async (moduleId: number) => {
		setLoading(true);
		try {
			const lesson = await fetchModuleLesson(moduleId);
			setLessons(lesson ? [lesson] : []);
		} catch (error) {
			console.error("Failed to load lesson:", error);
			setLessons([]);
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = () => {
		openPopup(
			<LessonForm
				modules={modules}
				defaultModuleId={selectedModuleId || undefined}
				onSave={async (data, moduleId) => {
					try {
						const newLesson = await createLesson(moduleId, data as CreateLessonRequestDTO);
						if (moduleId === selectedModuleId) {
							setLessons([newLesson]);
						}
						closePopup();
					} catch (error) {
						console.error("Failed to create lesson:", error);
					}
				}}
			/>,
		);
	};

	const handleEdit = (lesson: LessonDTO) => {
		openPopup(
			<LessonForm
				initialData={lesson}
				modules={modules}
				onSave={async (data, moduleId) => {
					try {
						const updatedLesson = await updateLesson(moduleId, data as UpdateLessonRequestDTO);
						if (moduleId === selectedModuleId) {
							setLessons([updatedLesson]);
						}
						closePopup();
					} catch (error) {
						console.error("Failed to update lesson:", error);
					}
				}}
			/>,
		);
	};

	const handleDelete = (lesson: LessonDTO) => {
		openPopup(
			<Popup
				title={UI_STRINGS.DELETE_CONFIRM_TITLE}
				buttonText={UI_STRINGS.DELETE_BUTTON}
				onButtonClick={async () => {
					try {
						await deleteLesson(lesson.moduleId);
						setLessons([]);
						closePopup();
					} catch (error) {
						console.error("Failed to delete lesson:", error);
					}
				}}
			>
				<div className={styles.deleteConfirm}>
					<p>{UI_STRINGS.DELETE_CONFIRM_MESSAGE}</p>
					<p className={styles.lessonInfo}>
						<strong>{lesson.title}</strong>
					</p>
				</div>
			</Popup>,
		);
	};

	const getModuleName = (moduleId: number): string => {
		const module = modules.find((mod) => mod.id === moduleId);
		return module ? `${module.icon} ${module.name}` : "-";
	};

	const availableModules = modules.filter((mod) => mod.languageId === selectedLanguageId);

	return (
		<div className={styles.lessonPanel}>
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
				</div>
				<div className={styles.headerControls}>
					<Button
						onClick={handleCreate}
						className={styles.addButton}
						disabled={!selectedModuleId || lessons.length > 0}
					>
						{UI_STRINGS.ADD_BUTTON}
					</Button>
				</div>
			</div>
			{selectedModuleId ? (
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
								accessor: "title",
								header: UI_STRINGS.TABLE_HEADERS.TITLE,
								cell: (value) => <strong>{value as string}</strong>,
							},
							{
								accessor: "moduleId",
								header: UI_STRINGS.TABLE_HEADERS.MODULE,
								align: "center",
								cell: (value) => getModuleName(value as number),
							},
							{
								accessor: "text",
								header: UI_STRINGS.TABLE_HEADERS.TEXT_PREVIEW,
								cell: (value) => (
									<MarkdownText isPreview maxLength={100}>
										{value as string}
									</MarkdownText>
								),
							},
							{
								accessor: "id",
								header: UI_STRINGS.TABLE_HEADERS.ACTIONS,
								align: "center",
								cell: (_, record) => (
									<div className={styles.actions}>
										<button
											className={styles.actionButton}
											onClick={(e) => {
												e.stopPropagation();
												handleEdit(record as LessonDTO);
											}}
										>
											{UI_STRINGS.ACTIONS.EDIT}
										</button>
										<button
											className={`${styles.actionButton} ${styles.actionButton_delete}`}
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(record as LessonDTO);
											}}
										>
											{UI_STRINGS.ACTIONS.DELETE}
										</button>
									</div>
								),
							},
						]}
						data={lessons}
						rowKey={(record) => record.id}
						loading={loading}
					/>
				</div>
			) : (
				<div className={styles.emptyState}>
					<p>{UI_STRINGS.SELECT_LANGUAGE}</p>
				</div>
			)}
		</div>
	);
};

export default LessonPanel;
