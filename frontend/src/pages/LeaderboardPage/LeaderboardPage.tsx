import LeaderBoard from "@components/LeaderBoard";
import Button from "@components/ui/Button";
import WebApp from "@WebApp/WebApp";

import styles from "./LeaderboardPage.module.scss";

const LeaderboardPage = () => {
	const handleClick = () => {
		WebApp.shareMaxContent(
			"Привет, вот пример ссылки",
			"https://max.ru/t118_hakaton_bot",
		);
	};
	return (
		<div className={styles.container}>
			<Button onClick={handleClick} >кнопка</Button>
			<LeaderBoard />
		</div>
	);
};

export default LeaderboardPage;
