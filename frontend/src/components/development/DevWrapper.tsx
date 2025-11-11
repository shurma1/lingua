import { useEffect, useState, ReactNode } from "react";

import styles from "@styles/components/development/DevWrapper.module.scss";
import cls from "@utils/cls";

import { setDevModeHandlers } from "../../setupDevMode";

import DevHeader from "./DevHeader";
import DevNotifications, {
	type DevNotification,
} from "./DevNotifications";
import { triggerBackButtonCallbacks } from "./mockWebAppAPI";



interface DevWrapperProps {
	children: ReactNode;
}

const DevWrapper = ({ children }: DevWrapperProps) => {
	const [showBackButton, setShowBackButton] = useState(false);
	const [notifications, setNotifications] = useState<DevNotification[]>([]);

	const addNotification = (message: string, duration: number) => {
		const notification: DevNotification = {
			id: `${Date.now()}-${Math.random()}`,
			message,
			duration,
			timestamp: Date.now(),
		};
		setNotifications((prev) => [...prev, notification]);
	};

	const removeNotification = (id: string) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	const handleBackButtonChange = (isVisible: boolean) => {
		setShowBackButton(isVisible);
	};

	const handleClose = () => {
		addNotification("App closed", 1000);
	};

	const handleBack = () => {
		addNotification("Back button clicked", 1000);
		triggerBackButtonCallbacks();
	};

	useEffect(() => {
		setDevModeHandlers(
			addNotification,
			handleBackButtonChange,
			handleClose,
		);

		addNotification("Dev environment initialized", 2000);

		return () => {
			setDevModeHandlers(
				() => {},
				() => {},
				() => {},
			);
		};
	}, []);

	return (
		<div className={cls(styles.devWrapper, "dev")}>
			<DevHeader
				showBackButton={showBackButton}
				onBack={handleBack}
				onClose={handleClose}
			/>
			<DevNotifications
				notifications={notifications}
				onRemove={removeNotification}
			/>
			<div className={styles.devContent}>
				{children}
			</div>
		</div>
	);
};

export default DevWrapper;
