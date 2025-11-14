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
		initData: "hash=8c659197b32c4eab9224032c6e85058e362de352540a32ccb11d0198a5722515&chat=%7B%22id%22%3A8036181%2C%22type%22%3A%22DIALOG%22%7D&ip=95.156.206.143&user=%7B%22id%22%3A68699971%2C%22first_name%22%3A%22%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80%22%2C%22last_name%22%3A%22%D0%9C%D0%B0%D1%80%D1%82%D1%8B%D0%BD%D0%B5%D0%BD%D0%BA%D0%BE%22%2C%22username%22%3Anull%2C%22language_code%22%3A%22ru%22%2C%22photo_url%22%3A%22https%3A%2F%2Fi.oneme.ru%2Fi%3Fr%3DBTGBPUwtwgYUeoFhO7rESmr8SRtXugA9CwIEFRkb7PpRFaZBVzvOAthNPjIn4_dI3n0%22%7D&query_id=2dcfc2a7-7f14-4723-bc3c-4ce51d9eacdd&auth_date=1763120831",
		initDataUnsafe: {
			query_id: "bded064f-ebb7-470f-a6df-48a1f439bf10",
			auth_date: 1763120480,
			hash: "5531a1f324bf389f707bf5f4f9ac50c6b7d3855bf04d7e2954a45452ae5e5ffa",
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
