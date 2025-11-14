import LeaderBoard from "@components/LeaderBoard";
import Button from "@components/ui/Button";

import styles from "./LeaderboardPage.module.scss";

const LeaderboardPage = () => {
	const handleClick = () => {
		// Создаем экземпляр Audio с любым аудиофайлом
		const audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
		
		// Воспроизводим аудио
		audio.play().catch((error) => {
			console.error("Ошибка воспроизведения аудио:", error);
		});
	};
	return (
		<div className={styles.container}>
			<Button onClick={handleClick} >кнопка</Button>
			<LeaderBoard />
		</div>
	);
};

export default LeaderboardPage;
