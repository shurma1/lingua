import { createMockWebAppAPI } from "@components/development/mockWebAppAPI";

let notificationHandler: ((message: string, duration: number) => void) | null = null;
let backButtonChangeHandler: ((isVisible: boolean) => void) | null = null;
let closeHandler: (() => void) | null = null;

export const setDevModeHandlers = (
	onNotification: (message: string, duration: number) => void,
	onBackButtonChange: (isVisible: boolean) => void,
	onClose: () => void,
) => {
	notificationHandler = onNotification;
	backButtonChangeHandler = onBackButtonChange;
	closeHandler = onClose;
};

export const getNotificationHandler = () => notificationHandler || (() => {});
export const getBackButtonChangeHandler = () => backButtonChangeHandler || (() => {});
export const getCloseHandler = () => closeHandler || (() => {});

if (import.meta.env.DEV) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const maxWindow = window as any;

	console.log('[setupDevMode] Creating mock WebApp API...');
	const mockAPI = createMockWebAppAPI(
		(message, duration) => getNotificationHandler()(message, duration),
		(isVisible) => getBackButtonChangeHandler()(isVisible),
		() => getCloseHandler()(),
	);

	maxWindow.WebApp = mockAPI;
}
