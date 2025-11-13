import { FC, useMemo } from "react";

import styles from "../../styles/ui/MarkdownText.module.scss";

interface MarkdownTextProps {
	children: string;
	isPreview?: boolean;
	maxLength?: number;
	className?: string;
}

const MarkdownText: FC<MarkdownTextProps> = ({ 
	children, 
	isPreview = false, 
	maxLength = 100,
	className = "", 
}) => {
	const processedContent = useMemo(() => {
		if (!children) return "";

		if (isPreview) {
			// Создаем временный элемент для парсинга HTML
			const tempDiv = document.createElement("div");
			tempDiv.innerHTML = children;

			// Удаляем H1-H6 элементы
			const headings = tempDiv.querySelectorAll("h1, h2, h3, h4, h5, h6");
			headings.forEach(heading => heading.remove());

			// Удаляем множественные переносы строк и div-обертки
			const divs = tempDiv.querySelectorAll("div");
			divs.forEach(div => {
				const text = div.textContent || "";
				if (text.trim()) {
					div.replaceWith(document.createTextNode(" " + text + " "));
				} else {
					div.remove();
				}
			});

			// Удаляем br элементы
			const brs = tempDiv.querySelectorAll("br");
			brs.forEach(br => br.remove());

			// Получаем текстовый контент
			let textContent = tempDiv.innerHTML;
			
			// Очищаем лишние пробелы
			textContent = textContent.replace(/\s+/g, " ").trim();

			// Обрезаем по длине, если нужно
			if (maxLength && textContent.length > maxLength) {
				// Обрезаем на уровне HTML
				const previewDiv = document.createElement("div");
				previewDiv.innerHTML = textContent;
				const plainText = previewDiv.textContent || previewDiv.innerText || "";
				
				if (plainText.length > maxLength) {
					// Находим позицию обрезки в HTML
					let charCount = 0;
					let htmlCount = 0;
					const html = textContent;
					
					while (charCount < maxLength && htmlCount < html.length) {
						if (html[htmlCount] === "<") {
							// Пропускаем тег
							const tagEnd = html.indexOf(">", htmlCount);
							if (tagEnd !== -1) {
								htmlCount = tagEnd + 1;
							} else {
								break;
							}
						} else if (html.substring(htmlCount, htmlCount + 4) === "&lt;" ||
								   html.substring(htmlCount, htmlCount + 4) === "&gt;" ||
								   html.substring(htmlCount, htmlCount + 5) === "&amp;" ||
								   html.substring(htmlCount, htmlCount + 6) === "&nbsp;" ||
								   html.substring(htmlCount, htmlCount + 6) === "&quot;") {
							// HTML entities считаем как 1 символ
							const semicolon = html.indexOf(";", htmlCount);
							if (semicolon !== -1) {
								htmlCount = semicolon + 1;
								charCount++;
							} else {
								htmlCount++;
								charCount++;
							}
						} else {
							htmlCount++;
							charCount++;
						}
					}
					
					textContent = textContent.substring(0, htmlCount) + "...";
				}
			}

			return textContent;
		}

		return children;
	}, [children, isPreview, maxLength]);

	if (isPreview) {
		return (
			<span 
				className={`${styles.markdownText} ${styles.markdownText_preview} ${className}`}
				dangerouslySetInnerHTML={{ __html: processedContent }}
			/>
		);
	}

	return (
		<div 
			className={`${styles.markdownText} ${className}`}
			dangerouslySetInnerHTML={{ __html: processedContent }}
		/>
	);
};

export default MarkdownText;
