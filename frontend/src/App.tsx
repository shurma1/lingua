import { useState, useEffect, useRef } from "react";

// import ApiLoader from "@components/ApiLoader";
import DevWrapper from "@components/development/DevWrapper";
import HelloAndSelectLanguage from "@components/HelloAndSelectLanguage";
import TabNavigator from "@components/TabBar/TabNavigator";
import Loader, { type LoaderRef } from "@components/ui/Loader";
import { getTabsConfig } from "@config/tabsConfig";
import { PopupProvider, usePopup } from "@contexts/PopupContext";
import {Typography} from "@maxhub/max-ui";
import WebApp from "@WebApp/WebApp";

import Popup  from "@/components/ui/Popup";
import {useFriendsMutations} from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";

const isDev = import.meta.env.DEV;

const AppContent = () => {
	const { openPopup, closePopup } = usePopup();
	const { user } = useUser();
	const tabsConfig = getTabsConfig(openPopup);
	const { acceptInvite, fetchFriends } = useFriendsMutations();
	const [inviteProcessed, setInviteProcessed] = useState(false);
	
	useEffect(() => {
		console.log(WebApp.initDataUnsafe);
	});
    
	const handleAccept = () => {
		const inviteId = WebApp.initDataUnsafe.start_param;
		
		if (!inviteId || inviteProcessed) {
			return;
		}

		try {
			setInviteProcessed(true);
			
			const handleAcceptInvite = async () => {
				const friendship = await acceptInvite(Number(inviteId));
				const friendId = friendship.user2Id;
				const friends = await fetchFriends();
				const currentFriend = friends.find(friend => friend.userId === friendId);
				alert(JSON.stringify(currentFriend));
			};
            
			openPopup(
				<Popup title="Приглашение принято" buttonText="Отлично" onButtonClick={handleAcceptInvite}>,
					<Typography.Body>Вы успешно приняли приглашение!</Typography.Body>
					<Typography.Body>Пользователь добавлен в ваш список друзей</Typography.Body>
				</Popup>,
			);
		} catch (e) {
			console.error(e);
			openPopup(
				<Popup title="Ошибка" buttonText="Понятно" onButtonClick={closePopup}>
					<Typography.Body>Не удалось принять приглашение</Typography.Body>
				</Popup>,
			);
		}
	};

	useEffect(() => {
		if (!inviteProcessed && WebApp.initDataUnsafe.start_param) {
			handleAccept();
		}
	}, [inviteProcessed]);
        
	return (
		<>
			<TabNavigator tabs={tabsConfig} defaultTabId="puzzle" />
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
