import { FC } from "react";

import { Spinner as MaxUISpinner, SpinnerAppearance } from "@maxhub/max-ui";

interface SpinnerProps {
	size?: number;
	appearance?: SpinnerAppearance;
}

const Spinner: FC<SpinnerProps> = ({ size = 20, appearance = "primary" }) => {
	return (
		<div style={{ width: `${size}px`, height: `${size}px` }}>
			<MaxUISpinner appearance={appearance} size={size} />
		</div>
	);
};

export default Spinner;
