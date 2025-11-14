import {FC, useCallback, useState, useEffect} from "react";

import LanguagesBackground from "@components/LanguagesBackground";
import {LanguageSelector} from "@components/LanguageSelector";
import OnBoarding from "@components/OnBoarding";

import { useLanguages, useLanguagesMutations } from "@/hooks/useLanguages";
import { useModulesMutations } from "@/hooks/useModules";
import { useUserMutations } from "@/hooks/useUser";
import { useModulesStore } from "@/store/modulesStore";

const welcomeScreenInfo = {
	id: 1,
	title: "Добро пожаловать!",
	description: "Начните изучение иностранных языков в игровой форме. Проходите уровни, соревнуйтесь с друзьями и достигайте новых высот!",
	buttonText: "Продолжить",
};

const languageSelectionInfo = {
	id: 2,
	title: "Выберите язык",
	description: "Какой язык вы хотите изучать? Вы сможете изменить свой выбор позже",
	buttonText: "Продолжить",
};

const ONBOARDING_ANIMATION_DURATION = 300;

interface OwnProps {
	onClose?: () => void;
}

const HelloAndSelectLanguage: FC<OwnProps> = ({onClose}) => {
	const { languages } = useLanguages();
	const { fetchLanguages } = useLanguagesMutations();
	const { setLanguage } = useUserMutations();
	const { fetchModulesByLanguage } = useModulesMutations();
	const { setCurrentModuleId } = useModulesStore();
	const [step, setStep] = useState<number>(1);
	const [isFullScreen, setFullScreen] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState<string>("");
	
	const [popupInfo, setPopupInfo] = useState(welcomeScreenInfo);
	
	const [isShowBackgroundAnimation, setShowBackgroundAnimation] = useState(true);

	useEffect(() => {
		fetchLanguages();
	}, [fetchLanguages]);

	useEffect(() => {
		if(step === 2) {
			setTimeout(() => {
				setShowBackgroundAnimation(false);
			}, ONBOARDING_ANIMATION_DURATION);
		}
	}, [step]);
	
	const handleButtonClick = useCallback(async () => {
		switch (step) {
			case 1: {
				setFullScreen(true);
				setPopupInfo(languageSelectionInfo);
				setStep(2);
				return;
			}
			case 2: {
				if (selectedLanguage) {
					try {
						// Set the language for the user
						await setLanguage(Number(selectedLanguage));
						
						// Fetch all modules for the selected language
						const modules = await fetchModulesByLanguage(Number(selectedLanguage));
						
						// Set the first module as active
						if (modules && modules.length > 0) {
							setCurrentModuleId(modules[0].id);
						}
						
						if(onClose) onClose();
					} catch (error) {
						console.error("Failed to set language:", error);
					}
				}
				return;
			}
		}
	}, [step, selectedLanguage, setLanguage, fetchModulesByLanguage, setCurrentModuleId, onClose]);
	
	
	const langSelector = <LanguageSelector
		languages={languages.map(lang => ({
			code: String(lang.id),
			name: lang.name,
			emoji: lang.icon || "🌐",
		}))}
		selectedLanguage={selectedLanguage}
		onSelect={(code) => setSelectedLanguage(code)}
	/>;
	
	return (
		<div>
			{isShowBackgroundAnimation && <LanguagesBackground background="var(--accent-color)"/>}
			<OnBoarding
				title={popupInfo.title}
				description={popupInfo.description}
				buttonText={popupInfo.buttonText}
				isFullScreen={isFullScreen}
				isButtonActive={step === 1 || (step === 2 && selectedLanguage !== "")}
				onButtonClick={handleButtonClick}
			>
				{isFullScreen && langSelector}
			</OnBoarding>
		</div>
	);
};

export default HelloAndSelectLanguage;

