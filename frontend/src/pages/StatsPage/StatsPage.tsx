import {Typography} from "@maxhub/max-ui";

import styles from "./StatsPage.module.scss";

const StatsPage = () => {
	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div className={styles.title}>
					<Typography.Headline variant="large-strong">Stats</Typography.Headline>
				</div>
				<div className={styles.description}>
					<Typography.Body variant="medium">Отслеживайте свой прогресс</Typography.Body>
				</div>
			</div>
		</div>
	);
};

export default StatsPage;
