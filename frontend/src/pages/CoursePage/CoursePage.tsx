import { useEffect } from "react";

import Header from "@components/Header";
import { Levels } from "@components/Levels";
import { SquareButton } from "@components/SquareButton";


import { useModules, useModulesMutations } from "@/hooks/useModules";
import { useAuthStore } from "@/store/authStore";

import { usePopup } from "../../contexts/PopupContext";
import DetailPage from "../DetailPage/DetailPage";

import styles from "./CoursePage.module.scss";

const CoursePage = () => {
	const { openPopup } = usePopup();
	const { user } = useAuthStore();
	const { modules, currentModuleId } = useModules();
	const { fetchModulesByLanguage } = useModulesMutations();

	// Fetch modules when user's language changes
	useEffect(() => {
		if (user?.languageId) {
			fetchModulesByLanguage(user.languageId);
		}
	}, [user?.languageId, fetchModulesByLanguage]);

	// Get the current module or fallback to the first module
	const currentModule = currentModuleId
		? modules.find(m => m.id === currentModuleId)
		: modules[0];

	const handleOpenDetail = () => {
		openPopup(<DetailPage />);
	};

	const levels = [
		{ id: 1, level: 1, color: "green" as const, onClick: handleOpenDetail },
		{ id: 2, level: 2, color: "green" as const, onClick: handleOpenDetail },
		{ id: 3, level: 3, color: "blue" as const, onClick: handleOpenDetail },
		{ id: 4, level: 4, color: "purple" as const, onClick: handleOpenDetail },
		{ id: 5, level: 5, color: "gold" as const, onClick: handleOpenDetail },
		{ id: 6, level: 6, color: "green" as const, onClick: handleOpenDetail },
		{ id: 7, level: 7, color: "blue" as const, onClick: handleOpenDetail },
		{ id: 8, level: 8, color: "purple" as const, onClick: handleOpenDetail },
		{ id: 9, level: 9, color: "gold" as const, onClick: handleOpenDetail },
	];

	return (
		<div className={styles.container}>
			<Header />
			<div className={styles.content}>
				<div className={styles.levelsWrapper}>
					<Levels levels={levels}/>
				</div>
				<div className={styles.footer}>
					<SquareButton onClick={handleOpenDetail} backgroundColor="var(--accent-color)" borderColor="var(--sub-accent-color)">
						{currentModule ? (
							<span>Модуль: {currentModule.icon && <span>{currentModule.icon}</span>} {currentModule.name}</span>
						) : (
							"Модуль"
						)}
					</SquareButton>
				</div>
			</div>
		</div>
	);
};

export default CoursePage;
