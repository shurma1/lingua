import { useState, useEffect, useRef } from "react";

import ApiLoader from "@components/ApiLoader";
import DevWrapper from "@components/development/DevWrapper";
import HelloAndSelectLanguage from "@components/HelloAndSelectLanguage";
import TabNavigator from "@components/TabBar/TabNavigator";
import Loader, { type LoaderRef } from "@components/ui/Loader";
import PopupContainer from "@components/ui/PopupContainer";
import { getTabsConfig } from "@config/tabsConfig";
import { PopupProvider, usePopup } from "@contexts/PopupContext";
import WebApp from "@WebApp/WebApp";

import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";

const isDev = import.meta.env.DEV;

const AppContent = () => {
	const { openPopup } = usePopup();
	const { user } = useUser();
	const tabsConfig = getTabsConfig(openPopup);

	return (
		<>
			<ApiLoader/>
			<TabNavigator tabs={tabsConfig} defaultTabId="puzzle" />
			<PopupContainer />
			 {user?.languageId === null && <HelloAndSelectLanguage/>}
		</>
	);
};

function App() {
	const { isLoading: isAuthLoading, error: authError, isAuthenticated, authenticate } = useAuth();
	const [showLoader, setShowLoader] = useState(true);
	const [isContentReady, setIsContentReady] = useState(false);
	const loaderRef = useRef<LoaderRef>(null);

	useEffect(() => {
		authenticate(WebApp.initData);
	}, []);
	useEffect(() => {
		if (!isAuthLoading && isAuthenticated) {
			setIsContentReady(true);
		}
	}, [isAuthLoading, isAuthenticated]);
	
	useEffect(() => {
		if (isContentReady && !isAuthLoading) {
			loaderRef.current?.exit();
		}
	}, [isContentReady, isAuthLoading]);

	const handleLoaderComplete = () => {
		setShowLoader(false);
	};
	
	if (authError || !isAuthenticated) {
		return <div>Authentication Error: {authError || "Not authenticated"}</div>;
	}

	const appContent = (
		<PopupProvider>
			<AppContent />
			{showLoader && <Loader ref={loaderRef} onComplete={handleLoaderComplete} />}
		</PopupProvider>
	);

	return isDev ? <DevWrapper>{appContent}</DevWrapper> : appContent;
}

export default App;
