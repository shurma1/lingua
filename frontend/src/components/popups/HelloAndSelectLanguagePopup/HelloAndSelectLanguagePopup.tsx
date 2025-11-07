import {FC, useCallback, useState} from "react";

import LanguagesBackground from "@components/LanguagesBackground/LanguagesBackground";
import {LanguageSelector} from "@components/LanguageSelector/LanguageSelector";
import OnBoarding from "@components/OnBoarding/OnBoarding";

const popupInfoV1 = {
	id: 1,
	title: "Заголовок 1",
	description: "Стартовал онлайн-этап хакатона по созданию чат-ботов и мини-приложений для мессенджера MAX",
	buttonText: "Продолжить",
};

const popupInfoV2 = {
	id: 2,
	title: "Новый заголовок",
	description: "Стартовал для мессенджера MAX",
	buttonText: "Продолжить",
};

interface OwnProps {
	onClose?: () => void;
}

const HelloAndSelectLanguagePopup: FC<OwnProps> = ({onClose}) => {
	const [step, setStep] = useState<number>(1);
	const [isFullScreen, setFullScreen] = useState(false);
	
	const [popupInfo, setPopupInfo] = useState(popupInfoV1);
	
	const handleButtonClick = useCallback(() => {
		switch (step) {
			case 1: {
				setFullScreen(true);
				setPopupInfo(popupInfoV2);
				setStep(2);
				return;
			}
			case 2: {
				if(onClose) onClose();
				return;
			}
		}
	}, [step]);
	
	
	const langSelector = <LanguageSelector
		languages={[
			{ code: "en", name: "English", emoji: "🇬🇧", disabled: true },
			{ code: "ru", name: "Русский", emoji: "🇷🇺" },
			{ code: "es", name: "Español", emoji: "🇪🇸" },
			{ code: "en", name: "English", emoji: "🇬🇧" },
			{ code: "ru", name: "Русский", emoji: "🇷🇺" },
			{ code: "es", name: "Español", emoji: "🇪🇸" },
			{ code: "en", name: "English", emoji: "🇬🇧" },
			{ code: "ru", name: "Русский", emoji: "🇷🇺" },
			{ code: "es", name: "Español", emoji: "🇪🇸" },
			{ code: "en", name: "English", emoji: "🇬🇧" },
			{ code: "ru", name: "Русский", emoji: "🇷🇺" },
			{ code: "es", name: "Español", emoji: "🇪🇸" },
			{ code: "en", name: "English", emoji: "🇬🇧" },
			{ code: "ru", name: "Русский", emoji: "🇷🇺" },
			{ code: "es", name: "Español", emoji: "🇪🇸" },
			{ code: "en", name: "English", emoji: "🇬🇧" },
			{ code: "ru", name: "Русский", emoji: "🇷🇺" },
			{ code: "es", name: "Español", emoji: "🇪🇸" },
		]}
		selectedLanguage="en"
		onSelect={(code) => console.log(code)}
	/>;
	
	return (
		<div>
			<LanguagesBackground background="var(--accent-color)"/>
			<OnBoarding
				title={popupInfo.title}
				description={popupInfo.description}
				buttonText={popupInfo.buttonText}
				isFullScreen={isFullScreen}
				onButtonClick={handleButtonClick}
			>
				{isFullScreen && langSelector}
			</OnBoarding>
		</div>
	);
};

export default HelloAndSelectLanguagePopup;

