import { useState, useEffect, useRef } from "react";

import DevWrapper from "@components/development/DevWrapper";
import HelloAndSelectLanguage from "@components/HelloAndSelectLanguage";
import TabNavigator from "@components/TabBar/TabNavigator";
import Loader, { type LoaderRef } from "@components/ui/Loader";
import PopupContainer from "@components/ui/PopupContainer";
import { getTabsConfig } from "@config/tabsConfig";
import { PopupProvider, usePopup } from "@contexts/PopupContext";
import WebApp from "@WebApp/WebApp";

import {useFriendsMutations} from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { useModuleInitialization } from "@/hooks/useModuleInitialization";
import { useUser } from "@/hooks/useUser";

const isDev = import.meta.env.DEV;

const AppContent = () => {
	const { openPopup } = usePopup();
	const { user } = useUser();
	const tabsConfig = getTabsConfig(openPopup);
	const { acceptInvite } = useFriendsMutations();
	const [inviteProcessed, setInviteProcessed] = useState(false);
	
	useModuleInitialization();
 
	const handleAccept = () => {
		const inviteId = WebApp.initDataUnsafe.start_param;
		
		if (!inviteId || inviteProcessed) {
			return;
		}
		
		setInviteProcessed(true);
		
		acceptInvite(Number(inviteId));
	};

	useEffect(() => {
		if (!inviteProcessed && WebApp.initDataUnsafe.start_param) {
			handleAccept();
		}
	}, [inviteProcessed]);
 
	return (
		<>
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
