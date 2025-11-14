import {FC, useEffect, useState} from "react";

import {LanguageSelector} from "@components/LanguageSelector";
import {usePopup} from "@contexts/PopupContext";

import Popup from "@/components/ui/Popup";
import {useLanguages, useLanguagesMutations, useUserMutations, useUser} from "@/hooks";

import styles from "./LanguageSelect.module.scss";

const LanguageSelect: FC = () => {
	const { fetchLanguages } = useLanguagesMutations();
	const { languages } = useLanguages();
	const { user } = useUser();
	const [selectedLanguage, setSelectedLanguage] = useState<string>("");
	const { setLanguage } = useUserMutations();
	const { closePopup } = usePopup();

	useEffect(() => {
		fetchLanguages();
	}, [fetchLanguages]);

	useEffect(() => {
		if (user?.languageId) {
			setSelectedLanguage(String(user.languageId));
		}
	}, [user?.languageId]);

	const langSelector = <LanguageSelector
		languages={languages.map(lang => ({
			code: String(lang.id),
			name: lang.name,
			emoji: lang.icon || "🌐",
		}))}
		selectedLanguage={selectedLanguage}
		onSelect={(code) => setSelectedLanguage(code)}
	/>;

	const handleButtonClick = async () => {
		if (selectedLanguage) {
			try {
				await setLanguage(Number(selectedLanguage));
				closePopup();
			} catch (error) {
				console.error("Failed to set language:", error);
			}
		}
	};

	return (
		<Popup title="Выбор языка" buttonText="Применить" onButtonClick={handleButtonClick} buttonDisabled={!selectedLanguage || selectedLanguage === String(user?.languageId)}>
			<div className={styles.wrapper}>
				<div className={styles.languageSelect}>
					{langSelector}
				</div>
			</div>
		</Popup>
	);
};

export default LanguageSelect;
