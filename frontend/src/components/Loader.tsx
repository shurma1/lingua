import {useRef, useState, useEffect, useImperativeHandle, forwardRef} from "react";

import animationData from "@assets/lottie/language.json";
import ColoredLottie from "@components/ColoredLottie";
import styles from "@styles/components/Loader.module.scss";

import type { LottieRefCurrentProps } from "lottie-react";

interface LoaderProps {
	onComplete?: () => void;
}

export interface LoaderRef {
	exit: () => void;
}

const FIRST_ANIMATION_SEGMENT: [number, number] = [0, 98];
const SECOND_ANIMATION_SEGMENT: [number, number] = [117, 218];
const FRAME_RATE = 100;
const ANIMATION_SPEED = 1;

const EXITING_ANIMATION_DURATION = 300;

const Loader = forwardRef<LoaderRef, LoaderProps>((
	{ onComplete },
	ref,
) => {
	const lottieRef = useRef<LottieRefCurrentProps>(null);
	const [isIntroComplete, setIsIntroComplete] = useState(false);
	const [isExiting, setIsExiting] = useState(false);
	
	const isMustExit = useRef<boolean>(false);

	useEffect(() => {
		if (!lottieRef.current) return;
		
		lottieRef.current.setSpeed(ANIMATION_SPEED);
		lottieRef.current.playSegments(FIRST_ANIMATION_SEGMENT, true);
		
		const introDuration = ((FIRST_ANIMATION_SEGMENT[1] - FIRST_ANIMATION_SEGMENT[0]) / FRAME_RATE) * 1000;
		const timer = setTimeout(() => {
			setIsIntroComplete(true);
			onSectionAnimationEnd();
		}, introDuration);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (!lottieRef.current || !isIntroComplete) return;
		
		if(isMustExit.current) return;
		
		const introDuration = ((SECOND_ANIMATION_SEGMENT[1] - SECOND_ANIMATION_SEGMENT[0]) / FRAME_RATE) * 1000;
		lottieRef.current.playSegments(SECOND_ANIMATION_SEGMENT, true);
		
		const timer = setTimeout(() => onSectionAnimationEnd(), introDuration);
		
		return () => clearTimeout(timer);
	}, [isIntroComplete]);

	const handleExit = () => {
		if (isMustExit.current) return;
		isMustExit.current = true;
		
		if (isIntroComplete) {
			setIsExiting(true);
			setTimeout(() => {
				onComplete?.();
			}, EXITING_ANIMATION_DURATION);
		}
	};
	
	const onSectionAnimationEnd =() => {
		if (!isMustExit.current) return;
		
		setIsExiting(true);
		
		setTimeout(() => {
			onComplete?.();
		}, EXITING_ANIMATION_DURATION);
		
	};

	useImperativeHandle(ref, () => ({
		exit: handleExit,
	}));

	return (
		<div className={`${styles.loader} ${isExiting ? styles.exiting : ""}`}>
			<div className={`${styles.lottieContainer}`}>
				<ColoredLottie
					ref={lottieRef}
					animationData={animationData}
					cssVariable="--loader-icon"
					loop={isIntroComplete}
					autoplay={false}
				/>
			</div>
		</div>
	);
});

export default Loader;
