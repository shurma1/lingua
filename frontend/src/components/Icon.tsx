import {FC} from "react";

import type { IconName } from "@/types/generated/iconTypes";

interface IconProps {
	name: IconName;
	size?: number;
	color?: string;
	className?: string;
}

const Icon: FC<IconProps> = ({
	name,
	size = 24,
	color = "currentColor",
	className,
}) => {
	return (
		<svg
			className={className}
			width={size}
			height={size}
			fill={color}
			aria-hidden="true"
		>
			<use href={`#icon-${name}`} />
		</svg>
	);
};

export default Icon;
