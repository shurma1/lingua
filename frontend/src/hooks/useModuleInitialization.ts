import { useEffect, useRef } from "react";

import { useModulesMutations } from "@hooks/useModules";
import { useUser } from "@hooks/useUser";
import { useModulesStore } from "@store/modulesStore";

export const useModuleInitialization = () => {
	const { user } = useUser();
	const { fetchModulesByLanguage } = useModulesMutations();
	const { setCurrentModuleId } = useModulesStore();
	const isInitialized = useRef(false);

	useEffect(() => {
		const initializeModule = async () => {
			if (!user?.languageId) {
				return;
			}

			if (isInitialized.current) {
				return;
			}

			try {
				// Step 1: Try to retrieve saved module from DeviceStorage
				const savedModuleId = localStorage.getItem("currentModuleId");
				console.log("Retrieved module ID from localStorage:", savedModuleId);
				
				if (savedModuleId) {
					const moduleId = Number(savedModuleId);
					if (!isNaN(moduleId)) {
						console.log("Restoring module ID:", moduleId);
						// Set in store (without re-saving to localStorage)
						setCurrentModuleId(moduleId);
						isInitialized.current = true;
						return;
					}
				}

				// Step 2: No saved module found, fetch modules for user's language
				console.log("No saved module, fetching modules for language:", user.languageId);
				const modules = await fetchModulesByLanguage(user.languageId);
				
				// Step 3: Set first module as current (this also saves to localStorage)
				if (modules && modules.length > 0) {
					console.log("Setting first module as current:", modules[0].id);
					setCurrentModuleId(modules[0].id);
				}
				
				isInitialized.current = true;
			} catch (error) {
				console.error("Failed to initialize module:", error);
			}
		};

		initializeModule();
	}, [user?.languageId, fetchModulesByLanguage, setCurrentModuleId]);
};
