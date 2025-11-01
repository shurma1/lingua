import { useState, type ReactNode } from "react";

import TabBar, { type TabConfig } from "../TabBar/TabBar";

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

	const tabsConfig: TabConfig[] = tabs.map(({ id, label, animation }) => ({
		id,
		label,
		animation,
	}));

	return (
		<div>
			{renderActivePage()}
			<TabBar activeTab={activeTab} onTabChange={handleTabChange} tabs={tabsConfig} />
		</div>
	);
};

export default TabNavigator;
