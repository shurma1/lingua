import {useRef} from "react";

import {ImpactStyle} from "../../WebApp/types/ImpactStyle";
import WebApp from "../../WebApp/WebApp";
import ColoredLottie from "../ColoredLottie/ColoredLottie";

import styles from "./TabBar.module.scss";

import type {LottieRefCurrentProps} from "lottie-react";

export interface TabConfig {
	id: string;
	label: string;
	animation: object;
}

interface TabBarProps {
	activeTab: string;
	onTabChange: (tabId: string) => void;
	tabs: TabConfig[];
}

const TabBar = ({ activeTab, onTabChange, tabs }: TabBarProps) => {
	const tabRefs = useRef<Map<string, LottieRefCurrentProps | null>>(new Map());

	const getRefForTab = (tabId: string) => {
		if (!tabRefs.current.has(tabId)) {
			tabRefs.current.set(tabId, null);
		}
		return {
			current: tabRefs.current.get(tabId) || null,
		};
	};

	const setRefForTab = (tabId: string) => (ref: LottieRefCurrentProps | null) => {
		tabRefs.current.set(tabId, ref);
	};

	const handleTabClick = (tabId: string) => {
		if(activeTab === tabId) return;
		onTabChange(tabId);
		WebApp.HapticFeedback.impactOccurred(ImpactStyle.LIGHT);
		setTimeout(() => {
			const lottieRef = getRefForTab(tabId);
			if (lottieRef.current) {
				lottieRef.current.setSpeed(2);
				lottieRef.current.stop();
				lottieRef.current.goToAndStop(0, true);
				lottieRef.current.play();
			}
		}, 0);
	};

	return (
		<div className={styles.tabBarContainer}>
			<div className={styles.tabBar}>
				{tabs.map((tab) => (
					<button
						key={tab.id}
						className={`${styles.tabItem} ${activeTab === tab.id ? styles.active : ""}`}
						onClick={() => handleTabClick(tab.id)}
					>
						<div className={styles.iconWrapper}>
							<ColoredLottie
								ref={setRefForTab(tab.id)}
								animationData={tab.animation}
								cssVariable={activeTab === tab.id ? "--accent-color" : "--innactive-color"}
								loop={false}
								autoplay={false}
								className={styles.icon}
							/>
						</div>
						<span className={styles.label}>{tab.label}</span>
					</button>
				))}
			</div>
		</div>
	);
};

export default TabBar;
