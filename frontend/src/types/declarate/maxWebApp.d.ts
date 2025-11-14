// maxWebApp.d.ts
// Type definitions for MAX Bridge API

export {};

declare global {
	namespace MAX {
		interface WebApp {
			// --- Core properties ----------------------------------------------------
			initData: string;
			initDataUnsafe: WebAppData;
			version: string;
			platform: "ios" | "android" | "desktop" | "web";
			
			// --- Controllers --------------------------------------------------------
			BackButton: BackButton;
			HapticFeedback: HapticFeedback;
			ScreenCapture: ScreenCapture;
			DeviceStorage: DeviceStorage;
			SecureStorage: SecureStorage;
			BiometricManager: BiometricManager;
			
			// --- Methods ------------------------------------------------------------
			onEvent(eventName: string, callback: (...args: unknown[]) => void): void;
			offEvent(eventName: string, callback: (...args: unknown[]) => void): void;
			ready(): void;
			close(): void;
			requestContact(): void;
			enableClosingConfirmation(): void;
			disableClosingConfirmation(): void;
			openLink(url: string): void;
			openMaxLink(url: string): void;
			shareContent({text: string, link: string}): void;
			shareMaxContent({text: string, link: string}): void;
			downloadFile(url: string, fileName: string): void;
			openCodeReader(fileSelect?: boolean): void;
		}
		
		// --- Supporting types ----------------------------------------------------
		interface WebAppData {
			query_id?: string;
			auth_date: number;
			hash: string;
			start_param?: WebAppStartParam;
			user?: {
				id: number;
				first_name: string;
				last_name?: string;
				username?: string;
				language_code?: string;
				photo_url?: string;
			};
			chat?: {
				id: number;
				type: string;
			};
		}
		
		type WebAppStartParam = string;
		
		// --- Controllers ---------------------------------------------------------
		interface BackButton {
			isVisible: boolean;
			onClick(callback: () => void): void;
			offClick(callback: () => void): void;
			show(): void;
			hide(): void;
		}
		
		interface HapticFeedback {
			impactOccurred(
				impactStyle: "soft" | "light" | "medium" | "heavy" | "rigid",
				disableVibrationFallback?: boolean
			): void;
			notificationOccurred(
				notificationType: "error" | "success" | "warning",
				disableVibrationFallback?: boolean
			): void;
			selectionChanged(disableVibrationFallback?: boolean): void;
		}
		
		interface ScreenCapture {
			isScreenCaptureEnabled: boolean;
			enableScreenCapture(): void;
			disableScreenCapture(): void;
		}
		
		interface DeviceStorage {
			setItem(key: string, value: string): void;
			getItem(key: string): string | null;
			removeItem(key: string): void;
			clear(): void;
		}
		
		interface SecureStorage {
			setItem(key: string, value: string): void;
			getItem(key: string): string | null;
			removeItem(key: string): void;
		}
		
		interface BiometricManager {
			isInited: boolean;
			isBiometricAvailable: boolean;
			biometricType: string[];
			deviceId: string | null;
			isAccessRequested: boolean;
			isAccessGranted: boolean;
			isBiometricTokenSaved: boolean;
			
			init(): void;
			requestAccess(): void;
			authenticate(): void;
			updateBiometricToken(token: string): void;
			openSettings(): void;
		}
	}
	
	interface Window {
		WebApp: MAX.WebApp;
	}
}
