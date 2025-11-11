import { Levels } from "@components/Levels";

import { usePopup } from "../../contexts/PopupContext";
import DetailPage from "../DetailPage/DetailPage";

import styles from "./CoursePage.module.scss";

const CoursePage = () => {
	const { openPopup } = usePopup();

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
			<Levels levels={levels}/>
		</div>
	);
};

export default CoursePage;
