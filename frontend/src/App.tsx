import { useState, useEffect, useRef } from "react";

import DevWrapper from "@components/DEVELOPMENT/DevWrapper/DevWrapper";
import Loader, { type LoaderRef } from "@components/Loader/Loader";
import PopupContainer from "@components/PopupContainer/PopupContainer";
import TabNavigator from "@components/TabNavigator/TabNavigator";
import { getTabsConfig } from "@config/tabsConfig";
import { PopupProvider, usePopup } from "@contexts/PopupContext";
import { useAuth } from "@hooks/useAuth";
import ApiLoader from "@components/ApiLoader/ApiLoader";

const isDev = import.meta.env.DEV;

const AppContent = () => {
	const { openPopup } = usePopup();
	const tabsConfig = getTabsConfig(openPopup);
	
	console.log('AppContent rendered, openPopup:', openPopup);
	
	return (
		<>
			<ApiLoader/>
			<TabNavigator tabs={tabsConfig} defaultTabId="puzzle" />
			<PopupContainer />
		</>
	);
};

function App() {
	const { isLoading: isAuthLoading, error: authError, isAuthenticated, user } = useAuth();
	const [showLoader, setShowLoader] = useState(true);
	const [isContentReady, setIsContentReady] = useState(false);
	const loaderRef = useRef<LoaderRef>(null);
	
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
	
	
	useEffect(() => {
		console.log(user);
	}, [user]);
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
