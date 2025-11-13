import { FC, useEffect, useState } from "react";

import { Table } from "@components/Table/Table";
import Button from "@components/ui/Button";
import Popup from "@components/ui/Popup";
import Select from "@components/ui/Select/Select";
import { usePopup } from "@contexts/PopupContext";

import { useLanguagesMutations } from "@/hooks/useLanguages";
import { useModulesMutations } from "@/hooks/useModules";
import { apiClient } from "@/http";
import { ModuleDTO, LanguageDTO, CreateModuleRequestDTO, UpdateModuleRequestDTO } from "@/types/api";

import styles from "../../styles/components/AdminPanel/ModulePanel.module.scss";

const UI_STRINGS = {
	ADD_BUTTON: "Добавить модуль",
	EDIT_TITLE: "Редактировать модуль",
	CREATE_TITLE: "Создать модуль",
	SAVE_BUTTON: "Сохранить",
	DELETE_CONFIRM_TITLE: "Удалить модуль",
	DELETE_CONFIRM_MESSAGE: "Вы уверены, что хотите удалить этот модуль?",
	DELETE_BUTTON: "Удалить",
	CANCEL_BUTTON: "Отмена",
	TABLE_HEADERS: {
		ID: "ID",
		NAME: "Название",
		ICON: "Иконка",
		LANGUAGE: "Язык",
		ACTIONS: "Действия",
	},
	FORM_LABELS: {
		NAME: "Название",
		ICON: "Иконка (один символ)",
		LANGUAGE: "Язык",
	},
	FORM_PLACEHOLDERS: {
		NAME: "Введите название модуля",
		ICON: "Введите один символ (например, 📚, A)",
		LANGUAGE: "Выберите язык",
	},
	VALIDATION_ERRORS: {
		ICON_REQUIRED: "Иконка обязательна",
		ICON_LENGTH: "Иконка должна быть ровно одним символом",
		LANGUAGE_REQUIRED: "Необходимо выбрать язык",
	},
	ACTIONS: {
		EDIT: "Редактировать",
		DELETE: "Удалить",
	},
	LOADING: "Загрузка...",
	SELECT_LANGUAGE: "Выберите язык для просмотра модулей",
};

interface ModuleFormData {
	name: string;
	icon: string;
	languageId: number;
}

interface ModuleFormProps {
	initialData?: ModuleDTO;
	languages: LanguageDTO[];
	defaultLanguageId?: number;
	onSave: (data: CreateModuleRequestDTO | UpdateModuleRequestDTO) => void;
}

const ModuleForm: FC<ModuleFormProps> = ({ initialData, languages, defaultLanguageId, onSave }) => {
	const [formData, setFormData] = useState<ModuleFormData>({
		name: initialData?.name || "",
		icon: initialData?.icon || "",
		languageId: initialData?.languageId || defaultLanguageId || 0,
	});
	const [iconError, setIconError] = useState<string>("");
	const [languageError, setLanguageError] = useState<string>("");

	const handleChange = (field: keyof ModuleFormData, value: string | number) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (field === "icon") {
			setIconError("");
		}
		if (field === "languageId") {
			setLanguageError("");
		}
	};

	const validateIcon = (icon: string): boolean => {
		if (!icon.trim()) {
			setIconError(UI_STRINGS.VALIDATION_ERRORS.ICON_REQUIRED);
			return false;
		}

		const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
		const graphemes = Array.from(segmenter.segment(icon.trim()));
		if (graphemes.length !== 1) {
			setIconError(UI_STRINGS.VALIDATION_ERRORS.ICON_LENGTH);
			return false;
		}
		return true;
	};

	const validateLanguage = (languageId: number): boolean => {
		if (!languageId || languageId === 0) {
			setLanguageError(UI_STRINGS.VALIDATION_ERRORS.LANGUAGE_REQUIRED);
			return false;
		}
		return true;
	};

	const handleSubmit = () => {
		const isIconValid = validateIcon(formData.icon);
		const isLanguageValid = validateLanguage(formData.languageId);

		if (!isIconValid || !isLanguageValid) {
			return;
		}

		if (initialData) {
			// Update - only send changed fields
			const updateData: UpdateModuleRequestDTO = {};
			if (formData.name !== initialData.name) {
				updateData.name = formData.name;
			}
			if (formData.icon.trim() !== initialData.icon) {
				updateData.icon = formData.icon.trim();
			}
			onSave(updateData);
		} else {
			// Create - send all required fields
			const createData: CreateModuleRequestDTO = {
				languageId: formData.languageId,
				name: formData.name,
				icon: formData.icon.trim(),
			};
			onSave(createData);
		}
	};

	const isValid = formData.name.trim() && formData.icon.trim() && formData.languageId > 0;

	return (
		<Popup
			title={initialData ? UI_STRINGS.EDIT_TITLE : UI_STRINGS.CREATE_TITLE}
			buttonText={UI_STRINGS.SAVE_BUTTON}
			onButtonClick={handleSubmit}
			buttonDisabled={!isValid}
		>
			<div className={styles.form}>
				<div className={styles.formGroup}>
					<label className={styles.label}>{UI_STRINGS.FORM_LABELS.NAME}</label>
					<input
						type="text"
						className={styles.input}
						value={formData.name}
						onChange={(e) => handleChange("name", e.target.value)}
						placeholder={UI_STRINGS.FORM_PLACEHOLDERS.NAME}
					/>
				</div>
				<div className={styles.formGroup}>
					<label className={styles.label}>{UI_STRINGS.FORM_LABELS.ICON}</label>
					<input
						type="text"
						className={`${styles.input} ${iconError ? styles.input_error : ""}`}
						value={formData.icon}
						onChange={(e) => handleChange("icon", e.target.value)}
						placeholder={UI_STRINGS.FORM_PLACEHOLDERS.ICON}
						maxLength={10}
					/>
					{iconError && <span className={styles.errorMessage}>{iconError}</span>}
				</div>
				<div className={styles.formGroup}>
					<label className={styles.label}>{UI_STRINGS.FORM_LABELS.LANGUAGE}</label>
					<div className={languageError ? styles.selectError : ""}>
						<Select
							options={languages.map((lang) => ({
								value: lang.id.toString(),
								label: `${lang.icon} ${lang.name}`,
							}))}
							value={formData.languageId ? formData.languageId.toString() : ""}
							onChange={(value) => handleChange("languageId", Number(value))}
							placeholder={UI_STRINGS.FORM_PLACEHOLDERS.LANGUAGE}
							disabled={!!initialData}
						/>
					</div>
					{languageError && <span className={styles.errorMessage}>{languageError}</span>}
				</div>
			</div>
		</Popup>
	);
};

const ModulePanel: FC = () => {
	const [modules, setModules] = useState<ModuleDTO[]>([]);
	const [languages, setLanguages] = useState<LanguageDTO[]>([]);
	const [selectedLanguageId, setSelectedLanguageId] = useState<number | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const { openPopup, closePopup } = usePopup();
	const { fetchModulesByLanguage } = useModulesMutations();
	const { fetchLanguages } = useLanguagesMutations();

	useEffect(() => {
		loadLanguages();
	}, []);

	useEffect(() => {
		if (selectedLanguageId) {
			loadModules(selectedLanguageId);
		}
	}, [selectedLanguageId]);

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
		setLoading(true);
		try {
			const data = await fetchModulesByLanguage(languageId);
			setModules(data);
		} catch (error) {
			console.error("Failed to load modules:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = () => {
		openPopup(
			<ModuleForm
				languages={languages}
				defaultLanguageId={selectedLanguageId || undefined}
				onSave={async (data) => {
					try {
						const newModule = await apiClient.modules.createModule(data as CreateModuleRequestDTO);
						if (newModule.languageId === selectedLanguageId) {
							setModules((prev) => [...prev, newModule]);
						}
						closePopup();
					} catch (error) {
						console.error("Failed to create module:", error);
					}
				}}
			/>,
		);
	};

	const handleEdit = (module: ModuleDTO) => {
		openPopup(
			<ModuleForm
				initialData={module}
				languages={languages}
				onSave={async (data) => {
					try {
						const updatedModule = await apiClient.modules.updateModule(module.id, data as UpdateModuleRequestDTO);
						setModules((prev) =>
							prev.map((mod) => (mod.id === module.id ? updatedModule : mod)),
						);
						closePopup();
					} catch (error) {
						console.error("Failed to update module:", error);
					}
				}}
			/>,
		);
	};

	const handleDelete = (module: ModuleDTO) => {
		openPopup(
			<Popup
				title={UI_STRINGS.DELETE_CONFIRM_TITLE}
				buttonText={UI_STRINGS.DELETE_BUTTON}
				onButtonClick={async () => {
					try {
						await apiClient.modules.deleteModule(module.id);
						setModules((prev) => prev.filter((mod) => mod.id !== module.id));
						closePopup();
					} catch (error) {
						console.error("Failed to delete module:", error);
					}
				}}
			>
				<div className={styles.deleteConfirm}>
					<p>{UI_STRINGS.DELETE_CONFIRM_MESSAGE}</p>
					<p className={styles.moduleInfo}>
						<strong>{module.name}</strong>
					</p>
				</div>
			</Popup>,
		);
	};

	const getLanguageName = (languageId: number): string => {
		const language = languages.find((lang) => lang.id === languageId);
		return language ? `${language.icon} ${language.name}` : "-";
	};

	return (
		<div className={styles.modulePanel}>
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
				</div>
				<div className={styles.headerControls}>
					<Button onClick={handleCreate} className={styles.addButton} disabled={!selectedLanguageId}>
						{UI_STRINGS.ADD_BUTTON}
					</Button>
				</div>
			</div>
			{selectedLanguageId ? (
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
								accessor: "name",
								header: UI_STRINGS.TABLE_HEADERS.NAME,
								cell: (value) => <strong>{value as string}</strong>,
							},
							{
								accessor: "icon",
								header: UI_STRINGS.TABLE_HEADERS.ICON,
								align: "center",
								cell: (value) => (
									<span className={styles.iconCell}>
										{value as string}
									</span>
								),
							},
							{
								accessor: "languageId",
								header: UI_STRINGS.TABLE_HEADERS.LANGUAGE,
								align: "center",
								cell: (value) => getLanguageName(value as number),
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
												handleEdit(record as ModuleDTO);
											}}
										>
											{UI_STRINGS.ACTIONS.EDIT}
										</button>
										<button
											className={`${styles.actionButton} ${styles.actionButton_delete}`}
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(record as ModuleDTO);
											}}
										>
											{UI_STRINGS.ACTIONS.DELETE}
										</button>
									</div>
								),
							},
						]}
						data={modules}
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

export default ModulePanel;
