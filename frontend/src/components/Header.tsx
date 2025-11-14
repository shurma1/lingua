import { FC, useEffect } from "react";

import LanguageSelect from "@pages/LanguageSelect/LanguageSelect";
import { motion, useSpring, useTransform } from "framer-motion";


import { useLanguages } from "@/hooks/useLanguages";
import { useUser } from "@/hooks/useUser";
import { formatNumber } from "@/utils/formatNumber";

import { usePopup } from "../contexts/PopupContext";
import styles from "../styles/components/Header.module.scss";


import Icon from "./ui/Icon";

// Animated number component
const AnimatedNumber: FC<{ value: number }> = ({ value }) => {
	const spring = useSpring(value, { 
		damping: 30, 
		stiffness: 200,
		duration: 0.5,
	});
	const display = useTransform(spring, (current) => 
		formatNumber(Math.round(current)),
	);

	useEffect(() => {
		spring.set(value);
	}, [spring, value]);

	return <motion.span>{display}</motion.span>;
};

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
					<span className={styles.statValue}>
						<AnimatedNumber value={user.stars} />
					</span>
				</div>

				<div className={styles.stat}>
					<span className={styles.statLabel}>EXP</span>
					<span className={styles.statValue}>
						<AnimatedNumber value={user.exp} />
					</span>
				</div>
			</div>
		</header>
	);
};

export default Header;
