import { SquareButton } from "@components/SquareButton";
import { usePopup } from "@contexts/PopupContext";
import { useModules } from "@hooks/useModules";
import { useModulesStore } from "@store/modulesStore";
import styles from "@styles/components/ModuleSelectionPopup.module.scss";

const ModuleSelectionPopup = () => {
	const { modules } = useModules();
	const { setCurrentModuleId } = useModulesStore();
	const { closePopup } = usePopup();

	const handleModuleSelect = (moduleId: number) => {
		setCurrentModuleId(moduleId);
		closePopup();
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Выберите модуль</h2>
			<div className={styles.modulesGrid}>
				{modules.map((module) => (
					<SquareButton
						key={module.id}
						onClick={() => handleModuleSelect(module.id)}
						backgroundColor="var(--accent-color)"
						borderColor="var(--sub-accent-color)"
					>
						<div className={styles.moduleContent}>
							{module.icon && <span className={styles.icon}>{module.icon}</span>}
							<span className={styles.name}>{module.name}</span>
						</div>
					</SquareButton>
				))}
			</div>
		</div>
	);
};

export default ModuleSelectionPopup;
