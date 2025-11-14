import { FC } from "react";

import styles from "@styles/ui/FullScreenLoader.module.scss";

import Spinner from "./Spinner";

interface FullScreenLoaderProps {
	size?: number;
}

const FullScreenLoader: FC<FullScreenLoaderProps> = ({ size = 40 }) => {
	return (
		<div className={styles.container}>
			<Spinner size={size} />
		</div>
	);
};

export default FullScreenLoader;
