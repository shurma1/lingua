import {ComponentType, useState} from "react";

import styles from "@styles/components/TabbedContainer.module.scss";
import { AnimatePresence, motion } from "framer-motion";

import TopBar from "./TopBar";
import PageContainer from "./ui/PageContainer";

export interface TabConfig {
	id: string;
	label: string;
	component: ComponentType;
}

interface TabbedContainerProps {
	config: TabConfig[];
	defaultTab?: string;
}

const TabbedContainer = ({ config, defaultTab }: TabbedContainerProps) => {
	const [activeTabId, setActiveTabId] = useState(defaultTab || config[0]?.id);
	const [direction, setDirection] = useState<"left" | "right">("right");

	const handleTabChange = (newTabId: string) => {
		if (newTabId === activeTabId) return;

		const currentIndex = config.findIndex((tab) => tab.id === activeTabId);
		const newIndex = config.findIndex((tab) => tab.id === newTabId);

		setDirection(newIndex > currentIndex ? "right" : "left");
		setActiveTabId(newTabId);
	};

	const activeTab = config.find((tab) => tab.id === activeTabId);
	const ActiveComponent = activeTab?.component;

	const variants = {
		enter: (direction: "left" | "right") => ({
			x: direction === "right" ? "100%" : "-100%",
			opacity: 0,
		}),
		center: {
			x: 0,
			opacity: 1,
		},
		exit: (direction: "left" | "right") => ({
			x: direction === "right" ? "-100%" : "100%",
			opacity: 0,
		}),
	};

	const topBarItems = config.map((tab) => ({
		id: tab.id,
		label: tab.label,
	}));

	return (
		<div className={styles.tabbedContainer}>
			<TopBar
				activeItem={activeTabId}
				onItemChange={handleTabChange}
				items={topBarItems}
			/>
			<div className={styles.contentWrapper}>
				<AnimatePresence mode="popLayout" custom={direction} initial={false}>
					{ActiveComponent && (
						<motion.div
							key={activeTabId}
							custom={direction}
							variants={variants}
							initial="enter"
							animate="center"
							exit="exit"
							transition={{
								x: { type: "tween", duration: 0.2, ease: "easeOut" },
								opacity: { duration: 0.2 },
							}}
							className={styles.tabContent}
						>
							<PageContainer>
								<ActiveComponent />
							</PageContainer>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default TabbedContainer;
