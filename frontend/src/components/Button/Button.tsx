import {FC, MouseEvent} from "react";

import {Button as MaxButton, ButtonProps} from "@maxhub/max-ui";

import WebApp from "@WebApp/WebApp";
import {ImpactStyle} from "@WebApp/types/ImpactStyle";
import {NotificationType} from "@WebApp/types/NotificationType";

const Button: FC<ButtonProps> = ({onClick, disabled, ...props}) => {
	const handleWrapperClick = (e: MouseEvent<HTMLDivElement>) => {
		if (disabled) {
			WebApp.HapticFeedback.notificationOccurred(NotificationType.ERROR);
			e.preventDefault();
			e.stopPropagation();
			return;
		}
	};

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		WebApp.HapticFeedback.impactOccurred(ImpactStyle.MEDIUM);
		onClick?.(e);
	};

	return (
		<div onClick={handleWrapperClick} style={{display: "inline-block"}}>
			<MaxButton {...props} disabled={disabled} onClick={handleClick} />
		</div>
	);
};

export default Button;
