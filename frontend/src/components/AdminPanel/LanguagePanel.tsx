import { FC, useEffect, useState } from "react";

import { Table } from "@components/Table/Table";
import Button from "@components/ui/Button";
import Popup from "@components/ui/Popup";
import { usePopup } from "@contexts/PopupContext";

import { apiClient } from "@/http";
import { LanguageDTO } from "@/types/api";

import styles from "../../styles/components/AdminPanel/LanguagePanel.module.scss";

const UI_STRINGS = {
	ADD_BUTTON: "Добавить язык",
	EDIT_TITLE: "Редактировать язык",
	CREATE_TITLE: "Создать язык",
	SAVE_BUTTON: "Сохранить",
	DELETE_CONFIRM_TITLE: "Удалить язык",
	DELETE_CONFIRM_MESSAGE: "Вы уверены, что хотите удалить этот язык?",
	DELETE_BUTTON: "Удалить",
	CANCEL_BUTTON: "Отмена",
	TABLE_HEADERS: {
		ID: "ID",
		NAME: "Название",
		ICON: "Иконка",
		ACTIONS: "Действия",
	},
	FORM_LABELS: {
		NAME: "Название",
		ICON: "Иконка (один символ)",
	},
	FORM_PLACEHOLDERS: {
		NAME: "Введите название языка",
		ICON: "Введите один символ (например, 🇬🇧, A)",
	},
	VALIDATION_ERRORS: {
		ICON_REQUIRED: "Иконка обязательна",
		ICON_LENGTH: "Иконка должна быть ровно одним символом",
	},
	ACTIONS: {
		EDIT: "Редактировать",
		DELETE: "Удалить",
	},
};

interface LanguageFormData {
	name: string;
	icon: string;
}

interface LanguageFormProps {
	initialData?: LanguageDTO;
	onSave: (data: LanguageFormData) => void;
}

const LanguageForm: FC<LanguageFormProps> = ({ initialData, onSave }) => {
	const [formData, setFormData] = useState<LanguageFormData>({
		name: initialData?.name || "",
		icon: initialData?.icon || "",
	});
	const [iconError, setIconError] = useState<string>("");

	const handleChange = (field: keyof LanguageFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (field === "icon") {
			setIconError("");
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

	const handleSubmit = () => {
		if (!validateIcon(formData.icon)) {
			return;
		}
		onSave({
			name: formData.name,
			icon: formData.icon.trim(),
		});
	};

	const isValid = formData.name.trim() && formData.icon.trim();

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
			</div>
		</Popup>
	);
};

const LanguagePanel: FC = () => {
	const [languages, setLanguages] = useState<LanguageDTO[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const { openPopup, closePopup } = usePopup();

	useEffect(() => {
		loadLanguages();
	}, []);

	const loadLanguages = async () => {
		setLoading(true);
		try {
			const data = await apiClient.languages.getLanguages();
			setLanguages(data);
		} catch (error) {
			console.error("Failed to load languages:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = () => {
		openPopup(
			<LanguageForm
				onSave={async (data) => {
					try {
						const newLanguage = await apiClient.languages.createLanguage(data);
						setLanguages((prev) => [...prev, newLanguage]);
						closePopup();
					} catch (error) {
						console.error("Failed to create language:", error);
					}
				}}
			/>,
		);
	};

	const handleEdit = (language: LanguageDTO) => {
		openPopup(
			<LanguageForm
				initialData={language}
				onSave={async (data) => {
					try {
						const updatedLanguage = await apiClient.languages.updateLanguage(language.id, data);
						setLanguages((prev) =>
							prev.map((lang) => (Number(lang.id) === Number(language.id) ? updatedLanguage : lang)),
						);
						closePopup();
					} catch (error) {
						console.error("Failed to update language:", error);
					}
				}}
			/>,
		);
	};

	const handleDelete = (language: LanguageDTO) => {
		openPopup(
			<Popup
				title={UI_STRINGS.DELETE_CONFIRM_TITLE}
				buttonText={UI_STRINGS.DELETE_BUTTON}
				onButtonClick={async () => {
					try {
						await apiClient.languages.deleteLanguage(language.id);
						setLanguages((prev) => prev.filter((lang) => Number(lang.id) !== Number(language.id)));
						closePopup();
					} catch (error) {
						console.error("Failed to delete language:", error);
					}
				}}
			>
				<div className={styles.deleteConfirm}>
					<p>{UI_STRINGS.DELETE_CONFIRM_MESSAGE}</p>
					<p className={styles.languageInfo}>
						<strong>{language.name}</strong>
					</p>
				</div>
			</Popup>,
		);
	};

	return (
		<div className={styles.languagePanel}>
			<div className={styles.header}>
				<Button onClick={handleCreate} className={styles.addButton}>
					{UI_STRINGS.ADD_BUTTON}
				</Button>
			</div>
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
							accessor: "id",
							header: UI_STRINGS.TABLE_HEADERS.ACTIONS,
							align: "center",
							cell: (_, record) => (
								<div className={styles.actions}>
									<button
										className={styles.actionButton}
										onClick={(e) => {
											e.stopPropagation();
											handleEdit(record as LanguageDTO);
										}}
									>
										{UI_STRINGS.ACTIONS.EDIT}
									</button>
									<button
										className={`${styles.actionButton} ${styles.actionButton_delete}`}
										onClick={(e) => {
											e.stopPropagation();
											handleDelete(record as LanguageDTO);
										}}
									>
										{UI_STRINGS.ACTIONS.DELETE}
									</button>
								</div>
							),
						},
					]}
					data={languages}
					rowKey={(record) => record.id}
					loading={loading}
				/>
			</div>
		</div>
	);
};

export default LanguagePanel;
