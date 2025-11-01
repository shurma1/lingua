export const changeAnimationColor = (animationData: object, color: number[]): object => {
	const newData = JSON.parse(JSON.stringify(animationData));
	
	const updateColors = (obj: unknown): void => {
		if (Array.isArray(obj)) {
			obj.forEach(updateColors);
		} else if (obj && typeof obj === "object") {
			const objRecord = obj as Record<string, unknown>;
			if (objRecord.ty === "fl" && objRecord.c && typeof objRecord.c === "object") {
				const colorObj = objRecord.c as Record<string, unknown>;
				if (colorObj.k) {
					colorObj.k = color;
				}
			}
			if (objRecord.ty === "st" && objRecord.c && typeof objRecord.c === "object") {
				const colorObj = objRecord.c as Record<string, unknown>;
				if (colorObj.k) {
					colorObj.k = color;
				}
			}
			Object.values(objRecord).forEach(updateColors);
		}
	};
	
	updateColors(newData);
	return newData;
};

export const hexToRgb = (hex: string): number[] => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? [
		parseInt(result[1], 16) / 255,
		parseInt(result[2], 16) / 255,
		parseInt(result[3], 16) / 255,
	] : [0, 0, 0];
};
