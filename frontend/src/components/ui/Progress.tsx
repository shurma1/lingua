import { FC, useEffect, useRef } from "react";

import cls from "@utils/cls";

import styles from "../../styles/ui/Progress.module.scss";

interface ProgressProps {
  value: number; // 0-100
  max?: number;
  showPercentage?: boolean;
  animated?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
}

export const Progress: FC<ProgressProps> = ({
	value,
	max = 100,
	showPercentage = false,
	animated = true,
	size = "medium",
	className = "",
}) => {
	const progressRef = useRef<HTMLDivElement>(null);
	const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

	useEffect(() => {
		if (progressRef.current && animated) {
			progressRef.current.style.width = "0%";
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					if (progressRef.current) {
						progressRef.current.style.width = `${percentage}%`;
					}
				});
			});
		}
	}, [percentage, animated]);

	return (
		<div className={cls(styles.progressContainer, styles[size], className)}>
			<div className={styles.progressTrack}>
				<div
					ref={progressRef}
					className={cls(styles.progressBar, [styles.animated, animated])}
					style={!animated ? { width: `${percentage}%` } : undefined}
					role="progressbar"
					aria-valuenow={value}
					aria-valuemin={0}
					aria-valuemax={max}
				/>
			</div>
			{showPercentage && (
				<span className={styles.percentage}>{Math.round(percentage)}%</span>
			)}
		</div>
	);
};
