import { useState, useEffect, useRef } from "react";

import Loader, { type LoaderRef } from "./components/Loader/Loader";
import PopupContainer from "./components/PopupContainer/PopupContainer";
import TabNavigator from "./components/TabNavigator/TabNavigator";
import { tabsConfig } from "./config/tabsConfig";
import { PopupProvider } from "./contexts/PopupContext";

function App() {
	const [showLoader, setShowLoader] = useState(true);
	const [isContentReady, setIsContentReady] = useState(false);
	const loaderRef = useRef<LoaderRef>(null);
	
	useEffect(() => {
		setIsContentReady(true);
	}, []);
	
	useEffect(() => {
		if (isContentReady) {
			loaderRef.current?.exit();
		}
	}, [isContentReady]);

	const handleLoaderComplete = () => {
		setShowLoader(false);
	};

	return (
		<PopupProvider>
			<TabNavigator tabs={tabsConfig} defaultTabId="puzzle" />
			{showLoader && <Loader ref={loaderRef} onComplete={handleLoaderComplete} />}
			<PopupContainer />
		</PopupProvider>
	);
}

export default App;
