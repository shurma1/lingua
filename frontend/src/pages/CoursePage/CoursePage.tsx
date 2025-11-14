import {useEffect, useMemo} from "react";

import Header from "@components/Header";
import { Levels } from "@components/Levels";
import ModuleSelectionPopup from "@components/ModuleSelectionPopup";
import { SquareButton } from "@components/SquareButton";
import { usePopup } from "@contexts/PopupContext";

import { useLevels, useLevelsMutations } from "@/hooks/useLevels";
import { useModules, useModulesMutations } from "@/hooks/useModules";
import { useAuthStore } from "@/store/authStore";

import LevelPage from "../LevelPage/LevelPage";

import styles from "./CoursePage.module.scss";

const CoursePage = () => {
	const { openPopup } = usePopup();
	const { user } = useAuthStore();
	const { modules, currentModuleId } = useModules();
	const { fetchModulesByLanguage } = useModulesMutations();
	const { levels } = useLevels();
	const { fetchLevelsByModule } = useLevelsMutations();
	
	useEffect(() => {
		if (user?.languageId) {
			fetchModulesByLanguage(user.languageId);
		}
	}, [user?.languageId, fetchModulesByLanguage]);
	
	const currentModule = useMemo(() => {
		return currentModuleId
			? modules.find(m => String(m.id) === String(currentModuleId))
			: modules[0];
	}, [currentModuleId, modules]);
	
	useEffect(() => {
		if (currentModule?.id) {
			fetchLevelsByModule(currentModule.id);
		}
	}, [currentModule?.id, fetchLevelsByModule]);
	
	const handleOpenLevel = (levelId: number) => {
		openPopup(<LevelPage levelId={levelId} />);
	};

	const handleOpenModuleSelection = () => {
		openPopup(<ModuleSelectionPopup />);
	};
	
	const levelsWithHandlers = useMemo(() => {
		return levels.map((level) => ({
			id: level.id,
			level: level.icon,
			onClick: () => handleOpenLevel(level.id),
			userProgress: level.userProgress,
		}));
	}, [levels]);

	return (
		<div className={styles.container}>
			<Header />
			<div className={styles.content}>
				<div className={styles.levelsWrapper}>
					<Levels levels={levelsWithHandlers}/>
				</div>
				<div className={styles.footer}>
					<SquareButton onClick={handleOpenModuleSelection} backgroundColor="var(--accent-color)" borderColor="var(--sub-accent-color)">
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
