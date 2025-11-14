import { FC } from "react";

import LanguageSelect from "@pages/LanguageSelect/LanguageSelect";

import { useLanguages } from "@/hooks/useLanguages";
import { useUser } from "@/hooks/useUser";
import { formatNumber } from "@/utils/formatNumber";

import { usePopup } from "../contexts/PopupContext";
import styles from "../styles/components/Header.module.scss";


import Icon from "./ui/Icon";

const Header: FC = () => {
	const { user } = useUser();
	const { languages } = useLanguages();
	const { openPopup } = usePopup();

	const handleOpenLanguages = () => {
		openPopup(<LanguageSelect />);
	};
    
	const selectedLanguage = languages.find((lang) => {
        return Number(lang.id) === Number(user?.languageId);
    });

	if (!user) {
		return null;
	}

	return (
		<header className={styles.container}>
			<button
				onClick={handleOpenLanguages}
				className={styles.language}
			>
				{selectedLanguage?.icon || "🌐"}
			</button>

			<div className={styles.stats}>
				<div className={styles.stat}>
					<Icon name="star-16" size={12} className={styles.statIcon} />
					<span className={styles.statValue}>{formatNumber(user.stars)}</span>
				</div>

				<div className={styles.stat}>
					<span className={styles.statLabel}>EXP</span>
					<span className={styles.statValue}>{formatNumber(user.exp)}</span>
				</div>
			</div>
		</header>
	);
};

export default Header;
