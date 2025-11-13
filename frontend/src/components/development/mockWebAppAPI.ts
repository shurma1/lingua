export interface MockWebAppAPI {
	platform: string;
	version: string;
	initData: string;
	initDataUnsafe: any;
	BackButton: {
		isVisible: boolean;
		show: () => void;
		hide: () => void;
		onClick: (callback: () => void) => void;
		offClick: (callback: () => void) => void;
	};
	HapticFeedback: {
		impactOccurred: (style: string, disableVibrationFallback?: boolean) => void;
		notificationOccurred: (type: string, disableVibrationFallback?: boolean) => void;
		selectionChanged: (disableVibrationFallback?: boolean) => void;
	};
	ScreenCapture: {
		isScreenCaptureEnabled: boolean;
		enableScreenCapture: () => void;
		disableScreenCapture: () => void;
	};
	DeviceStorage: {
		setItem: (key: string, value: string) => void;
		getItem: (key: string) => string | null;
		removeItem: (key: string) => void;
		clear: () => void;
	};
	SecureStorage: {
		setItem: (key: string, value: string) => void;
		getItem: (key: string) => string | null;
		removeItem: (key: string) => void;
	};
	BiometricManager: {
		isInited: boolean;
		isBiometricAvailable: boolean;
		biometricType: string[];
		deviceId: string | null;
		isAccessRequested: boolean;
		isAccessGranted: boolean;
		isBiometricTokenSaved: boolean;
		init: () => void;
		requestAccess: () => void;
		authenticate: () => void;
		updateBiometricToken: (token: string) => void;
		openSettings: () => void;
	};
	ready: () => void;
	close: () => void;
	requestContact: () => void;
	enableClosingConfirmation: () => void;
	disableClosingConfirmation: () => void;
	openLink: (url: string) => void;
	openMaxLink: (url: string) => void;
	shareContent: (text: string, link: string) => void;
	shareMaxContent: (text: string, link: string) => void;
	downloadFile: (url: string, fileName: string) => void;
	openCodeReader: (fileSelect?: boolean) => void;
	onEvent: (eventName: string, callback: (...args: any[]) => void) => void;
	offEvent: (eventName: string, callback: (...args: any[]) => void) => void;
}

export type DevNotificationCallback = (message: string, duration: number) => void;

const backButtonCallbacksStore: Array<() => void> = [];
const deviceStorageData = new Map<string, string>();
const secureStorageData = new Map<string, string>();

export const createMockWebAppAPI = (
	onNotification: DevNotificationCallback,
	onBackButtonChange: (isVisible: boolean) => void,
	onClose: () => void,
): MockWebAppAPI => {
	let backButtonVisible = false;
	let screenCaptureEnabled = false;

	return {
		platform: "web",
		version: "25.9.16",
		initData: "auth_date%3D1733485316394%26query_id%3D158b120b-7aa3-4a0f-a198-52ace06d0658%26user%3D%257B%2522language_code%2522%253A%2522ru%2522%252C%2522first_name%2522%253A%2522%25D0%2592%25D0%25B0%25D1%2581%25D1%258F%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522photo_url%2522%253Anull%252C%2522username%2522%253Anull%252C%2522id%2522%253A400%257D%26hash%3Df982406d90b118d8e90e26b33c5cec0cadd3fc30354f2955c75ff8e3d14d130d",
		initDataUnsafe: {
			query_id: "158b120b-7aa3-4a0f-a198-52ace06d0658",
			auth_date: 1733485316394,
			hash: "f982406d90b118d8e90e26b33c5cec0cadd3fc30354f2955c75ff8e3d14d130d",
			user: {
				id: 400,
				first_name: "Вася",
				last_name: "",
				language_code: "ru",
			},
		},

		BackButton: {
			get isVisible() {
				return backButtonVisible;
			},
			show() {
				backButtonVisible = true;
				onBackButtonChange(true);
				onNotification("BackButton.show()", 1000);
			},
			hide() {
				backButtonVisible = false;
				onBackButtonChange(false);
				onNotification("BackButton.hide()", 1000);
			},
			onClick(callback: () => void) {
				backButtonCallbacksStore.push(callback);
				onNotification(`BackButton.onClick() registered (${backButtonCallbacksStore.length} total)`, 1000);
			},
			offClick(callback: () => void) {
				const index = backButtonCallbacksStore.indexOf(callback);
				if (index > -1) {
					backButtonCallbacksStore.splice(index, 1);
					onNotification(`BackButton.offClick() removed (${backButtonCallbacksStore.length} left)`, 1000);
				} else {
					onNotification(`BackButton.offClick() - callback not found (${backButtonCallbacksStore.length} total)`, 1000);
				}
			},
		},

		HapticFeedback: {
			impactOccurred(style: string, disableVibrationFallback?: boolean) {
				onNotification(`Haptic: impact (${style}), fallback=${!disableVibrationFallback}`, 1000);
			},
			notificationOccurred(type: string, disableVibrationFallback?: boolean) {
				onNotification(`Haptic: notification (${type}), fallback=${!disableVibrationFallback}`, 1000);
			},
			selectionChanged(disableVibrationFallback?: boolean) {
				onNotification(`Haptic: selection changed, fallback=${!disableVibrationFallback}`, 1000);
			},
		},

		ScreenCapture: {
			get isScreenCaptureEnabled() {
				return screenCaptureEnabled;
			},
			enableScreenCapture() {
				screenCaptureEnabled = true;
				onNotification("ScreenCapture enabled (screenshots blocked)", 1000);
			},
			disableScreenCapture() {
				screenCaptureEnabled = false;
				onNotification("ScreenCapture disabled (screenshots allowed)", 1000);
			},
		},

		DeviceStorage: {
			setItem(key: string, value: string) {
				deviceStorageData.set(key, value);
				onNotification(`DeviceStorage.setItem("${key}")`, 1000);
			},
			getItem(key: string) {
				const value = deviceStorageData.get(key) || null;
				onNotification(`DeviceStorage.getItem("${key}"): ${value}`, 1000);
				return value;
			},
			removeItem(key: string) {
				deviceStorageData.delete(key);
				onNotification(`DeviceStorage.removeItem("${key}")`, 1000);
			},
			clear() {
				deviceStorageData.clear();
				onNotification("DeviceStorage.clear()", 1000);
			},
		},

		SecureStorage: {
			setItem(key: string, value: string) {
				secureStorageData.set(key, value);
				onNotification(`SecureStorage.setItem("${key}")`, 1000);
			},
			getItem(key: string) {
				const value = secureStorageData.get(key) || null;
				onNotification(`SecureStorage.getItem("${key}"): ${value}`, 1000);
				return value;
			},
			removeItem(key: string) {
				secureStorageData.delete(key);
				onNotification(`SecureStorage.removeItem("${key}")`, 1000);
			},
		},

		BiometricManager: {
			isInited: false,
			isBiometricAvailable: false,
			biometricType: ["unknown"],
			deviceId: null,
			isAccessRequested: false,
			isAccessGranted: false,
			isBiometricTokenSaved: false,
			init() {
				onNotification("BiometricManager.init()", 1000);
			},
			requestAccess() {
				onNotification("BiometricManager.requestAccess()", 1000);
			},
			authenticate() {
				onNotification("BiometricManager.authenticate()", 1000);
			},
			updateBiometricToken(token: string) {
				onNotification(`BiometricManager.updateBiometricToken("${token}")`, 1000);
			},
			openSettings() {
				onNotification("BiometricManager.openSettings()", 1000);
			},
		},

		ready() {
			onNotification("WebApp.ready()", 1000);
		},

		close() {
			onClose();
			onNotification("WebApp.close()", 1000);
		},

		requestContact() {
			onNotification("WebApp.requestContact()", 2000);
		},

		enableClosingConfirmation() {
			onNotification("Closing confirmation enabled", 1000);
		},

		disableClosingConfirmation() {
			onNotification("Closing confirmation disabled", 1000);
		},

		openLink(url: string) {
			onNotification(`openLink: ${url}`, 2000);
			window.open(url, "_blank");
		},

		openMaxLink(url: string) {
			onNotification(`openMaxLink: ${url}`, 2000);
		},

		shareContent(text: string, link: string) {
			onNotification(`shareContent: ${text}, ${link}`, 2000);
		},

		shareMaxContent(text: string, link: string) {
			onNotification(`shareMaxContent: ${text}, ${link}`, 2000);
		},

		downloadFile(url: string, fileName: string) {
			onNotification(`downloadFile: ${fileName} from ${url}`, 2000);
		},

		openCodeReader(fileSelect = true) {
			onNotification(`openCodeReader(fileSelect=${fileSelect})`, 2000);
		},

		onEvent(eventName: string, _callback: (...args: any[]) => void) {
			onNotification(`onEvent: ${eventName}`, 1000);
		},

		offEvent(eventName: string, _callback: (...args: any[]) => void) {
			onNotification(`offEvent: ${eventName}`, 1000);
		},
	};
};

export const triggerBackButtonCallbacks = () => {
	const callbacks = [...backButtonCallbacksStore];
	callbacks.forEach((callback) => {
		try {
			callback();
		} catch (error) {
			console.error("Error in BackButton callback:", error);
		}
	});
};
