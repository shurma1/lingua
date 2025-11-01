import {Button, Typography} from "@maxhub/max-ui";

import { usePopup } from "../../contexts/PopupContext";
import DetailPage from "../DetailPage/DetailPage";

import styles from "./CoursePage.module.scss";

const CoursePage = () => {
	const { openPopup } = usePopup();

	const handleOpenDetail = () => {
		openPopup(<DetailPage />);
	};

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div className={styles.title}>
					<Typography.Headline variant="large-strong">Puzzle</Typography.Headline>
				</div>
				<div className={styles.description}>
					<Typography.Body variant="medium">Учите слова через интерактивные пазлы</Typography.Body>
				</div>
				<Button
					className={styles.button}
					onClick={handleOpenDetail}
				>
					Открыть детальную страницу
				</Button>
			</div>
		</div>
	);
};

export default CoursePage;
