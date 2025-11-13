import LeaderBoard from "@components/LeaderBoard";

import styles from "./LeaderboardPage.module.scss";

const LeaderboardPage = () => {
	return (
		<div className={styles.container}>
			<LeaderBoard />
		</div>
	);
};

export default LeaderboardPage;
