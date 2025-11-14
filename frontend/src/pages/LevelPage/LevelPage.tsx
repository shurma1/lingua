import { FC, useEffect } from "react";

import Button from "@components/ui/Button";
import {Progress} from "@components/ui/Progress";

import styles from "./LevelPage.module.scss";

interface LevelPageProps {
	levelId: number;
}

const LevelPage: FC<LevelPageProps> = ({ levelId }) => {
	useEffect(() => {
		console.log(levelId);
	}, []);
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Progress value={10}/>
			</div>
			<div className={styles.content}>
				content
			</div>
			<div className={styles.footer}>
				<Button
					size="large"
					className={styles.button}
					containerClasses={styles.button}
				>
					Далее
				</Button>
			</div>
		</div>
	);
};

export default LevelPage;
