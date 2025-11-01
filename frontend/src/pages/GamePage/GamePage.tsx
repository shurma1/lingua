import {Typography} from "@maxhub/max-ui";

import styles from "./GamePage.module.scss";

// сгенерировано чатом жпт, НЕ ИСПОЛЬЗОВАТЬ В КАЧЕСТВЕ РЕФЕРЕНСА!!!
const GamePage = () => {
	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div className={styles.title}>
					<Typography.Headline variant="large-strong">Game</Typography.Headline>
				</div>
				<div className={styles.description}>
					<Typography.Body variant="medium">Играйте и практикуйте новые слова</Typography.Body>
				</div>
			</div>
		</div>
	);
};

export default GamePage;
