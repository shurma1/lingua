import { useMemo, forwardRef, useRef, useImperativeHandle } from "react";

import Lottie from "lottie-react";

import { changeAnimationColor, hexToRgb } from "../../utils/lottieColorUtils";

import type { LottieComponentProps, LottieRefCurrentProps } from "lottie-react";

interface ColoredLottieProps extends Omit<LottieComponentProps, "animationData"> {
	animationData: object;
	color?: string; // HEX цвет, например "#007AFF"
	cssVariable?: string; // CSS переменная, например "--accent-color"
}

const ColoredLottie = forwardRef<LottieRefCurrentProps, ColoredLottieProps>(
	({ animationData, color, cssVariable, ...lottieProps }, ref) => {
		const lottieRef = useRef<LottieRefCurrentProps>(null);

		const coloredAnimation = useMemo(() => {
			let targetColor = color;

			// Если передана CSS переменная, получаем её значение
			if (cssVariable && !color) {
				targetColor = getComputedStyle(document.documentElement)
					.getPropertyValue(cssVariable)
					.trim();
			}

			// Если цвет задан, применяем его
			if (targetColor) {
				const rgb = hexToRgb(targetColor);
				return changeAnimationColor(animationData, rgb);
			}

			// Возвращаем оригинальную анимацию, если цвет не задан
			return animationData;
		}, [animationData, color, cssVariable]);

		useImperativeHandle(ref, () => lottieRef.current as LottieRefCurrentProps);

		return (
			<Lottie
				{...lottieProps}
				animationData={coloredAnimation}
				lottieRef={lottieRef}
			/>
		);
	},
);

ColoredLottie.displayName = "ColoredLottie";

export default ColoredLottie;
