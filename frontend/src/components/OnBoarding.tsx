import { FC, ReactNode, useEffect, useState, useRef} from "react";

import Button from "@components/ui/Button";
import {Typography} from "@maxhub/max-ui";
import styles from "@styles/components/OnBoarding.module.scss";
import cls from "@utils/cls";

interface OwnProps {
    children: ReactNode | ReactNode[];
    title?: string;
    description?: string;
    buttonText?: string;
    isButtonActive?: boolean;
    onButtonClick?: () => void;
    isFullScreen?: boolean;
}

const OnBoarding: FC<OwnProps> = ({
	children,
	title,
	description,
	buttonText,
	isButtonActive = true,
	onButtonClick,
	isFullScreen= false,
}) => {
	const [isAnimatingOut, setIsAnimatingOut] = useState(false);
	const prevPropsRef = useRef({ title, description, buttonText });
	const [displayContent, setDisplayContent] = useState({ children, title, description, buttonText });

	useEffect(() => {
		const hasChanged =
			prevPropsRef.current.title !== title ||
			prevPropsRef.current.description !== description ||
			prevPropsRef.current.buttonText !== buttonText;

		if (hasChanged) {
			setIsAnimatingOut(true);
			
			const updateTimer = setTimeout(() => {
				setDisplayContent({ children, title, description, buttonText });
				setIsAnimatingOut(false);
				prevPropsRef.current = { title, description, buttonText };
			}, 200);

			return () => {
				clearTimeout(updateTimer);
			};
		} else {
			// Обновляем children без анимации
			setDisplayContent(prev => ({ ...prev, children }));
		}
	}, [children, title, description, buttonText]);

	return (
		<div
			className={cls(
				styles.onboarding,
				[styles.fullScreen, isFullScreen],
			)}
		>
			<div className={styles.header}>
				<h1 className={cls([styles.animating, isAnimatingOut])}>
					{displayContent.title}
				</h1>
				<div className={cls([styles.animating, isAnimatingOut])}>
					<Typography.Body>
						{displayContent.description}
					</Typography.Body>
				</div>
			</div>
			<div
				className={cls(
					styles.content,
					[styles.animating, isAnimatingOut],
				)}
			>
				{displayContent.children}
			</div>
			<div>
				<Button
					disabled={!isButtonActive}
					size="large"
					className={styles.button}
					containerClasses={styles.containerButton}
					onClick={onButtonClick}
					
				>
					{displayContent.buttonText}
				</Button>
			</div>
		</div>
	);
};

export default OnBoarding;
