import { useMemo, forwardRef, useRef, useImperativeHandle } from "react";

import Lottie from "lottie-react";

import { changeAnimationColor, hexToRgb } from "@utils/lottieColorUtils";

import type { LottieComponentProps, LottieRefCurrentProps } from "lottie-react";

interface ColoredLottieProps extends Omit<LottieComponentProps, "animationData"> {
	animationData: object;
	color?: string;
	cssVariable?: string;
}

const ColoredLottie = forwardRef<LottieRefCurrentProps, ColoredLottieProps>(
	({ animationData, color, cssVariable, ...lottieProps }, ref) => {
		const lottieRef = useRef<LottieRefCurrentProps>(null);

		const coloredAnimation = useMemo(() => {
			let targetColor = color;
			
			if (cssVariable && !color) {
				targetColor = getComputedStyle(document.documentElement)
					.getPropertyValue(cssVariable)
					.trim();
			}
			
			if (targetColor) {
				const rgb = hexToRgb(targetColor);
				return changeAnimationColor(animationData, rgb);
			}
			
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

export default ColoredLottie;
