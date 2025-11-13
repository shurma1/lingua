import {Typography} from "@maxhub/max-ui";
import {useRef, useEffect} from "react";

import Button from "@/components/ui/Button";
import ColoredLottie from "@/components/ui/ColoredLottie";
import lockAnimation from "@/assets/lottie/lock.json";

import styles from "./GamePage.module.scss";

import type {LottieRefCurrentProps} from "lottie-react";

const GamePage = () => {
	const lottieRef = useRef<LottieRefCurrentProps | null>(null);

	useEffect(() => {
		if (lottieRef.current) {
			lottieRef.current.setSpeed(2);
		}
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.overlay}>
				<div className={styles.overlayContent}>
					<ColoredLottie
						ref={lottieRef}
						animationData={lockAnimation}
						cssVariable="--accent-color"
						loop={false}
						autoplay={true}
						className={styles.lockAnimation}
					/>
					<Typography.Headline variant="medium-strong">
						Соревновательный режим доступен с <span className={styles.expLabel}>EXP</span> <span className={styles.expValue}>10</span>
					</Typography.Headline>
				</div>
			</div>
			<div className={styles.content}>
				<div className={styles.title}>
					<Typography.Headline variant="large-strong">Соревнуйся с другими игроками</Typography.Headline>
				</div>
				<div className={styles.buttonWrapper}>
					<Button className={styles.button} containerClasses={styles.button} size="large">Поиск игры</Button>
				</div>
			</div>
		</div>
	);
};

export default GamePage;
