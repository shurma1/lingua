import {CSSProperties, FC, useEffect, useRef} from "react";

import styles from "@styles/components/LanguagesBackground.module.scss";
import {generateRandomArrayFromArray} from "@utils/generateRandomArrayFromArray";
import {random} from "@utils/random";

import {GREETING_STRINGS} from "@/constants/greetings";


interface GreetingWord {
	text: string;
	size: number;
	opacity: number;
}

interface GreetingRow {
	words: GreetingWord[];
	speed: number;
	direction: number; // 1 - влево, -1 - вправо
}

const ROWS = 10;
const GREETINGS_IN_ROW = 5;

const SPEED = [0.2, 0.4];
const OPACITY = [0.5, 1];
const SIZE = [0.5, 1.25];

const rows: GreetingRow[] = [];

for(let i = 0; i < ROWS; i++) {
	const greetingsInRow = generateRandomArrayFromArray(GREETING_STRINGS, GREETINGS_IN_ROW);
	const words: GreetingWord[] = greetingsInRow.map(text => {
		const opacity = random(OPACITY[0], OPACITY[1], 1);
		const size = random(SIZE[0], SIZE[1], 2);
		return {text, opacity, size};
	});
	const speed = random(SPEED[0], SPEED[1], 2);
	const direction = i % 2 === 0 ? 1 : -1;
	
	rows.push({words, speed, direction});
}

interface OwnProps {
	background: string;
}

const LanguagesBackground: FC<OwnProps> = ({background}) => {
	const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
	const animationFrameId = useRef<number>();
	const rowWordsRef = useRef<GreetingWord[][]>(rows.map(row => [...row.words, ...row.words, ...row.words, ...row.words]));
	
	useEffect(() => {
		rowRefs.current.forEach((rowEl, index) => {
			if (!rowEl) return;
			const row = rows[index];
			
			if (row.direction === 1) {
				rowEl.style.left = "0px";
			} else {
				rowEl.style.left = `-${rowEl.scrollWidth / 2}px`;
			}
		});
		
		const animate = () => {
			rowRefs.current.forEach((rowEl, index) => {
				if (!rowEl) return;
				
				const row = rows[index];
				const currentLeft = parseFloat(rowEl.style.left || "0");
				const newLeft = currentLeft - (row.speed * row.direction);
				const rowWidth = rowEl.scrollWidth;
				const halfWidth = rowWidth / 2;
				
				if (row.direction === 1 && newLeft <= -halfWidth) {
					rowEl.style.left = `${newLeft + halfWidth}px`;
				}
				else if (row.direction === -1 && newLeft >= 0) {
					rowEl.style.left = `${newLeft - halfWidth}px`;
				}
				else {
					rowEl.style.left = `${newLeft}px`;
				}
			});
			
			animationFrameId.current = requestAnimationFrame(animate);
		};
		
		animationFrameId.current = requestAnimationFrame(animate);
		
		return () => {
			if (animationFrameId.current) {
				cancelAnimationFrame(animationFrameId.current);
			}
		};
	}, []);
	
	const containerStyles: CSSProperties = {
		background: background || "",
	};
	
	const getRowStyles = (index: number): CSSProperties => ({
		position: "absolute",
		top: `${(index / ROWS) * 100}%`,
		left: "0",
		whiteSpace: "nowrap",
	});
	
	const wordStyles = (word: GreetingWord): CSSProperties => ({
		fontSize: `${word.size * 2}rem`,
		opacity: word.opacity,
		color: "white",
		fontWeight: 600,
	});
	
	return (
		<div
			className={styles.container}
			style={containerStyles}
		>
			{rows.map((_, index) => (
				<div
					ref={(el) => (rowRefs.current[index] = el)}
					className={styles.row}
					style={getRowStyles(index)}
					key={index}
				>
					{rowWordsRef.current[index].map((word, wordIndex) => (
						<span
							className={styles.word}
							style={wordStyles(word)}
							key={`${word.text}-${wordIndex}`}
						>
							{word.text}
						</span>
					))}
				</div>
			))}
		</div>
	);
};

export default LanguagesBackground;
