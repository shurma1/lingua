import { useState, type ReactNode } from "react";

import PageContainer from "@components/PageContainer";
import TabBar, { type TabConfig } from "@components/TabBar/TabBar";
import styles from "@styles/components/TabBar/TabNavigator.module.scss";

export interface TabNavigatorConfig extends TabConfig {
	component: ReactNode;
}

interface TabNavigatorProps {
	tabs: TabNavigatorConfig[];
	defaultTabId?: string;
}

const TabNavigator = ({ tabs, defaultTabId }: TabNavigatorProps) => {
	const [activeTab, setActiveTab] = useState<string>(
		defaultTabId || (tabs.length > 0 ? tabs[0].id : ""),
	);

	const handleTabChange = (tabId: string) => {
		setActiveTab(tabId);
	};

	const renderActivePage = () => {
		const activeTabConfig = tabs.find(tab => tab.id === activeTab);
		return activeTabConfig?.component || null;
	};

	const tabsConfig: TabConfig[] = tabs.map(({ id, label, animation, onMultiplyClick }) => ({
		id,
		label,
		animation,
		onMultiplyClick,
	}));

	return (
		<div>
			<div className={styles.pageContainer}>
				<PageContainer>
					{renderActivePage()}
				</PageContainer>
			</div>
			<TabBar activeTab={activeTab} onTabChange={handleTabChange} tabs={tabsConfig} />
		</div>
	);
};

export default TabNavigator;
