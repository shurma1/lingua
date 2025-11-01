import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import styles from "./PageTransition.module.scss";

interface PageTransitionProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
}

const PageTransition = ({ isOpen, onClose, children }: PageTransitionProps) => {
	const [isAnimating, setIsAnimating] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setShouldRender(true);
			setTimeout(() => setIsAnimating(true), 10);
		} else {
			setIsAnimating(false);
			setTimeout(() => setShouldRender(false), 400);
		}
	}, [isOpen]);

	if (!shouldRender) return null;

	return (
		<div
			className={`${styles.overlay} ${isAnimating ? styles.active : ""}`}
			onClick={onClose}
		>
			<div
				className={`${styles.page} ${isAnimating ? styles.active : ""}`}
				onClick={(e) => e.stopPropagation()}
			>
				<button className={styles.backButton} onClick={onClose}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path
							d="M15 18L9 12L15 6"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<span>Назад</span>
				</button>
				<div className={styles.content}>
					{children}
				</div>
			</div>
		</div>
	);
};

export default PageTransition;
