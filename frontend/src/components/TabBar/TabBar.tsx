import {useRef, useState} from "react";

import ColoredLottie from "@components/ui/ColoredLottie";
import styles from "@styles/components/TabBar/TabBar.module.scss";
import {ImpactStyle} from "@WebApp/types/ImpactStyle";
import WebApp from "@WebApp/WebApp";


import type {LottieRefCurrentProps} from "lottie-react";

const MULTIPLY_CLICK_COUNT = 2; //10
const MULTIPLY_CLICK_MAX_DELAY_MS = 500;

export interface TabConfig {
	id: string;
	label: string;
	animation: object;
	onMultiplyClick?: () => void;
}

interface TabBarProps {
	activeTab: string;
	onTabChange: (tabId: string) => void;
	tabs: TabConfig[];
}

const TabBar = ({ activeTab, onTabChange, tabs }: TabBarProps) => {
	const tabRefs = useRef<Map<string, LottieRefCurrentProps | null>>(new Map());
	
	const [tabClickCount, setTabClickCount] = useState<{id: string | null, clickCount: number}>({id: null, clickCount: 0});
	const timerRef = useRef<number | null>(null);
	
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
		const currentTab = tabs.find(tab => tab.id === tabId) as TabConfig;
		const isMultiplyClickActive = !! currentTab.onMultiplyClick;
		
		if (timerRef.current !== null) {
			clearTimeout(timerRef.current);
		}
		
		if(isMultiplyClickActive) {
			let newClickCount = 1;
			
			if(tabId === tabClickCount.id) {
				newClickCount = tabClickCount.clickCount + 1;
			}
			
			setTabClickCount({id: tabId, clickCount: newClickCount});
			
			if(newClickCount >= MULTIPLY_CLICK_COUNT) {
				currentTab.onMultiplyClick?.();
				setTabClickCount({id: null, clickCount: 0});
				WebApp.HapticFeedback.impactOccurred(ImpactStyle.MEDIUM);
				return;
			}
			
			timerRef.current = window.setTimeout(() => {
				setTabClickCount({id: null, clickCount: 0});
			}, MULTIPLY_CLICK_MAX_DELAY_MS);
		} else if(tabClickCount.id !== null) {
			setTabClickCount({id: null, clickCount: 0});
		}
		
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
