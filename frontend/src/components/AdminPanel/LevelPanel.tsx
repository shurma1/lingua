import { FC, useEffect, useState } from "react";

import { Table } from "@components/Table/Table";
import Button from "@components/ui/Button";
import Popup from "@components/ui/Popup";
import Select from "@components/ui/Select/Select";
import { usePopup } from "@contexts/PopupContext";

import { useLanguagesMutations } from "@/hooks/useLanguages";
import { useLevelsMutations } from "@/hooks/useLevels";
import { useModulesMutations } from "@/hooks/useModules";
import { LevelDTO, LanguageDTO, ModuleDTO, CreateLevelRequestDTO, UpdateLevelRequestDTO } from "@/types/api";

import styles from "../../styles/components/AdminPanel/LevelPanel.module.scss";

const UI_STRINGS = {
	ADD_BUTTON: "Добавить уровень",
	EDIT_TITLE: "Редактировать уровень",
	CREATE_TITLE: "Создать уровень",
	SAVE_BUTTON: "Сохранить",
	DELETE_CONFIRM_TITLE: "Удалить уровень",
	DELETE_CONFIRM_MESSAGE: "Вы уверены, что хотите удалить этот уровень?",
	DELETE_BUTTON: "Удалить",
	CANCEL_BUTTON: "Отмена",
	TABLE_HEADERS: {
		ID: "ID",
		ICON: "Иконка",
		MODULE: "Модуль",
		QUESTS_COUNT: "Количество квестов",
		ACTIONS: "Действия",
	},
	FORM_LABELS: {
		ICON: "Иконка уровня (emoji)",
		MODULE: "Модуль",
		LANGUAGE: "Язык",
	},
	FORM_PLACEHOLDERS: {
		ICON: "Введите emoji (например, 🎯)",
		MODULE: "Выберите модуль",
		LANGUAGE: "Выберите язык",
	},
	VALIDATION_ERRORS: {
		ICON_REQUIRED: "Иконка обязательна",
		MODULE_REQUIRED: "Необходимо выбрать модуль",
	},
	ACTIONS: {
		EDIT: "Редактировать",
		DELETE: "Удалить",
	},
	LOADING: "Загрузка...",
	SELECT_LANGUAGE: "Выберите язык для просмотра уровней",
};

interface LevelFormData {
	icon: string;
	moduleId: number;
}

interface LevelFormProps {
	initialData?: LevelDTO;
	modules: ModuleDTO[];
	defaultModuleId?: number;
	onSave: (data: CreateLevelRequestDTO | UpdateLevelRequestDTO) => void;
}

const LevelForm: FC<LevelFormProps> = ({ initialData, modules, defaultModuleId, onSave }) => {
	const [formData, setFormData] = useState<LevelFormData>({
		icon: initialData?.icon || "",
		moduleId: initialData?.moduleId || defaultModuleId || 0,
	});
	const [iconError, setIconError] = useState<string>("");
	const [moduleError, setModuleError] = useState<string>("");

	const handleChange = (field: keyof LevelFormData, value: string | number) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (field === "icon") {
			setIconError("");
		}
		if (field === "moduleId") {
			setModuleError("");
		}
	};

	const validateIcon = (icon: string): boolean => {
		if (!icon.trim()) {
			setIconError(UI_STRINGS.VALIDATION_ERRORS.ICON_REQUIRED);
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
		const isIconValid = validateIcon(formData.icon);
		const isModuleValid = validateModule(formData.moduleId);

		if (!isIconValid || !isModuleValid) {
			return;
		}

		if (initialData) {
			// Update - only send changed fields
			const updateData: UpdateLevelRequestDTO = {};
			if (formData.icon !== initialData.icon) {
				updateData.icon = formData.icon;
			}
			if (formData.moduleId !== initialData.moduleId) {
				updateData.moduleId = formData.moduleId;
			}
			onSave(updateData);
		} else {
			// Create - send all required fields
			const createData: CreateLevelRequestDTO = {
				moduleId: formData.moduleId,
				icon: formData.icon,
			};
			onSave(createData);
		}
	};

	const isValid = formData.icon.trim() && formData.moduleId > 0;

	return (
		<Popup
			title={initialData ? UI_STRINGS.EDIT_TITLE : UI_STRINGS.CREATE_TITLE}
			buttonText={UI_STRINGS.SAVE_BUTTON}
			onButtonClick={handleSubmit}
			buttonDisabled={!isValid}
		>
			<div className={styles.form}>
				<div className={styles.formGroup}>
					<label className={styles.label}>{UI_STRINGS.FORM_LABELS.ICON}</label>
					<input
						type="text"
						className={`${styles.input} ${iconError ? styles.input_error : ""}`}
						value={formData.icon}
						onChange={(e) => handleChange("icon", e.target.value)}
						placeholder={UI_STRINGS.FORM_PLACEHOLDERS.ICON}
					/>
					{iconError && <span className={styles.errorMessage}>{iconError}</span>}
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
			</div>
		</Popup>
	);
};

const LevelPanel: FC = () => {
	const [levels, setLevels] = useState<LevelDTO[]>([]);
	const [languages, setLanguages] = useState<LanguageDTO[]>([]);
	const [modules, setModules] = useState<ModuleDTO[]>([]);
	const [selectedLanguageId, setSelectedLanguageId] = useState<number | null>(null);
	const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const { openPopup, closePopup } = usePopup();
	const { fetchLevelsByModule, createLevel, updateLevelById, deleteLevel } = useLevelsMutations();
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
			loadLevels(selectedModuleId);
		} else {
			setLevels([]);
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

	const loadLevels = async (moduleId: number) => {
		setLoading(true);
		try {
			const data = await fetchLevelsByModule(moduleId);
			setLevels(data);
		} catch (error) {
			console.error("Failed to load levels:", error);
			setLevels([]);
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = () => {
		openPopup(
			<LevelForm
				modules={modules}
				defaultModuleId={selectedModuleId || undefined}
				onSave={async (data) => {
					try {
						const newLevel = await createLevel(data as CreateLevelRequestDTO);
						if (newLevel.moduleId === selectedModuleId) {
							setLevels((prev) => [...prev, newLevel]);
						}
						closePopup();
					} catch (error) {
						console.error("Failed to create level:", error);
					}
				}}
			/>,
		);
	};

	const handleEdit = (level: LevelDTO) => {
		openPopup(
			<LevelForm
				initialData={level}
				modules={modules}
				onSave={async (data) => {
					try {
						const updatedLevel = await updateLevelById(level.id, data as UpdateLevelRequestDTO);
						setLevels((prev) =>
							prev.map((lvl) => (lvl.id === level.id ? updatedLevel : lvl)),
						);
						closePopup();
					} catch (error) {
						console.error("Failed to update level:", error);
					}
				}}
			/>,
		);
	};

	const handleDelete = (level: LevelDTO) => {
		openPopup(
			<Popup
				title={UI_STRINGS.DELETE_CONFIRM_TITLE}
				buttonText={UI_STRINGS.DELETE_BUTTON}
				onButtonClick={async () => {
					try {
						await deleteLevel(level.id);
						setLevels((prev) => prev.filter((lvl) => lvl.id !== level.id));
						closePopup();
					} catch (error) {
						console.error("Failed to delete level:", error);
					}
				}}
			>
				<div className={styles.deleteConfirm}>
					<p>{UI_STRINGS.DELETE_CONFIRM_MESSAGE}</p>
					<p className={styles.levelInfo}>
						<strong>{level.icon}</strong>
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
		<div className={styles.levelPanel}>
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
						disabled={!selectedModuleId}
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
								accessor: "icon",
								header: UI_STRINGS.TABLE_HEADERS.ICON,
								align: "center",
								cell: (value) => <strong style={{ fontSize: "1.5em" }}>{value as string}</strong>,
							},
							{
								accessor: "moduleId",
								header: UI_STRINGS.TABLE_HEADERS.MODULE,
								align: "center",
								cell: (value) => getModuleName(value as number),
							},
							{
								accessor: "questsCount",
								header: UI_STRINGS.TABLE_HEADERS.QUESTS_COUNT,
								align: "center",
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
												handleEdit(record as LevelDTO);
											}}
										>
											{UI_STRINGS.ACTIONS.EDIT}
										</button>
										<button
											className={`${styles.actionButton} ${styles.actionButton_delete}`}
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(record as LevelDTO);
											}}
										>
											{UI_STRINGS.ACTIONS.DELETE}
										</button>
									</div>
								),
							},
						]}
						data={levels}
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

export default LevelPanel;
