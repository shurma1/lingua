// tgWebapp.d.ts
// Type definitions for Telegram Web Apps (Bot API 8.0+)

export {};

declare global {
	namespace Telegram {
		interface WebApp {
			// --- Core properties ----------------------------------------------------
			initData: string;
			initDataUnsafe: WebAppInitData;
			version: string;
			platform: string;
			colorScheme: "light" | "dark";
			themeParams: ThemeParams;
			isActive: boolean;
			isExpanded: boolean;
			viewportHeight: number;
			viewportStableHeight: number;
			headerColor: string;
			backgroundColor: string;
			bottomBarColor: string;
			isClosingConfirmationEnabled: boolean;
			isVerticalSwipesEnabled: boolean;
			isFullscreen: boolean;
			isOrientationLocked: boolean;
			safeAreaInset: SafeAreaInset;
			contentSafeAreaInset: ContentSafeAreaInset;
			
			// --- Controllers --------------------------------------------------------
			BackButton: BackButton;
			MainButton: BottomButton;
			SecondaryButton: BottomButton;
			SettingsButton: SettingsButton;
			HapticFeedback: HapticFeedback;
			CloudStorage: CloudStorage;
			BiometricManager: BiometricManager;
			Accelerometer: Accelerometer;
			DeviceOrientation: DeviceOrientation;
			Gyroscope: Gyroscope;
			LocationManager: LocationManager;
			DeviceStorage: DeviceStorage;
			SecureStorage: SecureStorage;
			
			// --- Methods ------------------------------------------------------------
			isVersionAtLeast(version: string): boolean;
			setHeaderColor(color: string | "bg_color" | "secondary_bg_color"): WebApp;
			setBackgroundColor(color: string | "bg_color" | "secondary_bg_color"): WebApp;
			setBottomBarColor(color: string | "bg_color" | "secondary_bg_color" | "bottom_bar_bg_color"): WebApp;
			enableClosingConfirmation(): WebApp;
			disableClosingConfirmation(): WebApp;
			enableVerticalSwipes(): WebApp;
			disableVerticalSwipes(): WebApp;
			requestFullscreen(): WebApp;
			exitFullscreen(): WebApp;
			lockOrientation(): WebApp;
			unlockOrientation(): WebApp;
			addToHomeScreen(): WebApp;
			checkHomeScreenStatus(callback?: (status: HomeScreenStatus) => void): WebApp;
			
			onEvent<T = unknown>(eventType: WebAppEventType, handler: EventHandler<T>): WebApp;
			offEvent<T = unknown>(eventType: WebAppEventType, handler: EventHandler<T>): WebApp;
			
			sendData(data: string): void;
			switchInlineQuery(query: string, chooseChatTypes?: ChatType[]): WebApp;
			openLink(url: string, options?: { try_instant_view?: boolean }): WebApp;
			openTelegramLink(url: string): WebApp;
			openInvoice(url: string, callback?: (status: InvoiceStatus) => void): WebApp;
			shareToStory(mediaUrl: string, params?: StoryShareParams): WebApp;
			shareMessage(msgId: string, callback?: (success: boolean) => void): WebApp;
			setEmojiStatus(
				customEmojiId: string,
				params?: EmojiStatusParams,
				callback?: (success: boolean) => void
			): WebApp;
			requestEmojiStatusAccess(callback?: (granted: boolean) => void): WebApp;
			downloadFile(params: DownloadFileParams, callback?: (accepted: boolean) => void): WebApp;
			hideKeyboard(): WebApp;
			
			showPopup(params: PopupParams, callback?: (buttonId: string | null) => void): WebApp;
			showAlert(message: string, callback?: () => void): WebApp;
			showConfirm(message: string, callback?: (ok: boolean) => void): WebApp;
			showScanQrPopup(params?: ScanQrPopupParams, callback?: (text: string) => boolean | void): WebApp;
			closeScanQrPopup(): WebApp;
			readTextFromClipboard(callback?: (text: string | null) => void): WebApp;
			requestWriteAccess(callback?: (granted: boolean) => void): WebApp;
			requestContact(callback?: (shared: boolean) => void): WebApp;
			
			ready(): WebApp;
			expand(): WebApp;
			close(): WebApp;
		}
		
		// --- Events --------------------------------------------------------------
		type WebAppEventType =
			| "activated"
			| "deactivated"
			| "themeChanged"
			| "viewportChanged"
			| "safeAreaChanged"
			| "contentSafeAreaChanged"
			| "mainButtonClicked"
			| "secondaryButtonClicked"
			| "backButtonClicked"
			| "settingsButtonClicked"
			| "invoiceClosed"
			| "popupClosed"
			| "qrTextReceived"
			| "scanQrPopupClosed"
			| "clipboardTextReceived"
			| "writeAccessRequested"
			| "contactRequested"
			| "biometricManagerUpdated"
			| "biometricAuthRequested"
			| "biometricTokenUpdated"
			| "fullscreenChanged"
			| "fullscreenFailed"
			| "homeScreenAdded"
			| "homeScreenChecked"
			| "accelerometerStarted"
			| "accelerometerStopped"
			| "accelerometerChanged"
			| "accelerometerFailed"
			| "deviceOrientationStarted"
			| "deviceOrientationStopped"
			| "deviceOrientationChanged"
			| "deviceOrientationFailed"
			| "gyroscopeStarted"
			| "gyroscopeStopped"
			| "gyroscopeChanged"
			| "gyroscopeFailed"
			| "locationRequested"
			| "locationChecked";
		
		type EventHandler<T = void> = (this: WebApp, payload: T) => void;
		
		// --- Supporting types ----------------------------------------------------
		interface ThemeParams {
			bg_color?: string;
			text_color?: string;
			hint_color?: string;
			link_color?: string;
			button_color?: string;
			button_text_color?: string;
			secondary_bg_color?: string;
			header_bg_color?: string;
			bottom_bar_bg_color?: string;
			accent_text_color?: string;
			section_bg_color?: string;
			section_header_text_color?: string;
			section_separator_color?: string;
			subtitle_text_color?: string;
			destructive_text_color?: string;
		}
		
		interface WebAppInitData {
			query_id?: string;
			user?: WebAppUser;
			receiver?: WebAppUser;
			chat?: WebAppChat;
			chat_type?: ChatType;
			chat_instance?: string;
			start_param?: string;
			can_send_after?: number;
			auth_date: number;
			hash: string;
			signature?: string;
		}
		
		interface WebAppUser {
			id: number;
			is_bot?: boolean;
			first_name: string;
			last_name?: string;
			username?: string;
			language_code?: string;
			is_premium?: true;
			added_to_attachment_menu?: true;
			allows_write_to_pm?: true;
			photo_url?: string;
		}
		
		interface WebAppChat {
			id: number;
			type: "group" | "supergroup" | "channel";
			title: string;
			username?: string;
			photo_url?: string;
		}
		
		type ChatType = "sender" | "private" | "group" | "supergroup" | "channel" | "users" | "bots";
		type InvoiceStatus = "paid" | "cancelled" | "failed" | "pending";
		type HomeScreenStatus = "unsupported" | "unknown" | "added" | "missed";
		
		interface StoryShareParams {
			text?: string;
			widget_link?: StoryWidgetLink;
		}
		
		interface StoryWidgetLink {
			url: string;
			name?: string;
		}
		
		interface ScanQrPopupParams {
			text?: string;
		}
		
		interface PopupParams {
			title?: string;
			message: string;
			buttons?: PopupButton[];
		}
		
		interface PopupButton {
			id?: string;
			type?: "default" | "ok" | "close" | "cancel" | "destructive";
			text?: string;
		}
		
		interface EmojiStatusParams {
			duration?: number;
		}
		
		interface DownloadFileParams {
			url: string;
			file_name: string;
		}
		
		interface SafeAreaInset {
			top: number;
			bottom: number;
			left: number;
			right: number;
		}
		
		interface ContentSafeAreaInset {
			top: number;
			bottom: number;
			left: number;
			right: number;
		}
		
		// --- Controllers ---------------------------------------------------------
		interface BackButton {
			isVisible: boolean;
			onClick(callback: () => void): BackButton;
			offClick(callback: () => void): BackButton;
			show(): BackButton;
			hide(): BackButton;
		}
		
		interface BottomButton {
			readonly type: "main" | "secondary";
			text: string;
			color: string;
			textColor: string;
			isVisible: boolean;
			isActive: boolean;
			hasShineEffect: boolean;
			position?: "left" | "right" | "top" | "bottom";
			readonly isProgressVisible: boolean;
			
			setText(text: string): BottomButton;
			onClick(callback: () => void): BottomButton;
			offClick(callback: () => void): BottomButton;
			show(): BottomButton;
			hide(): BottomButton;
			enable(): BottomButton;
			disable(): BottomButton;
			showProgress(leaveActive?: boolean): BottomButton;
			hideProgress(): BottomButton;
			setParams(params: Partial<BottomButtonParams>): BottomButton;
		}
		
		interface BottomButtonParams {
			text?: string;
			color?: string;
			text_color?: string;
			has_shine_effect?: boolean;
			position?: "left" | "right" | "top" | "bottom";
			is_active?: boolean;
			is_visible?: boolean;
		}
		
		interface SettingsButton {
			isVisible: boolean;
			onClick(callback: () => void): SettingsButton;
			offClick(callback: () => void): SettingsButton;
			show(): SettingsButton;
			hide(): SettingsButton;
		}
		
		interface HapticFeedback {
			impactOccurred(style: "light" | "medium" | "heavy" | "rigid" | "soft"): HapticFeedback;
			notificationOccurred(type: "error" | "success" | "warning"): HapticFeedback;
			selectionChanged(): HapticFeedback;
		}
		
		interface CloudStorage {
			setItem(key: string, value: string, callback?: (error: unknown, success: boolean) => void): CloudStorage;
			getItem(key: string, callback: (error: unknown, value: string | null) => void): CloudStorage;
			getItems(keys: string[], callback: (error: unknown, values: Record<string, string>) => void): CloudStorage;
			removeItem(key: string, callback?: (error: unknown, success: boolean) => void): CloudStorage;
			removeItems(keys: string[], callback?: (error: unknown, success: boolean) => void): CloudStorage;
			getKeys(callback: (error: unknown, keys: string[]) => void): CloudStorage;
		}
		
		interface BiometricManager {
			isInited: boolean;
			isBiometricAvailable: boolean;
			biometricType: "finger" | "face" | "unknown" | "";
			isAccessRequested: boolean;
			isAccessGranted: boolean;
			isBiometricTokenSaved: boolean;
			deviceId: string;
			
			init(callback?: () => void): BiometricManager;
			requestAccess(params?: BiometricRequestAccessParams, callback?: (granted: boolean) => void): BiometricManager;
			authenticate(params?: BiometricAuthenticateParams, callback?: (success: boolean, token?: string) => void): BiometricManager;
			updateBiometricToken(token: string, callback?: (success: boolean) => void): BiometricManager;
			openSettings(): BiometricManager;
		}
		
		interface BiometricRequestAccessParams {
			reason?: string;
		}
		
		interface BiometricAuthenticateParams {
			reason?: string;
		}
		
		interface Accelerometer {
			isStarted: boolean;
			x: number;
			y: number;
			z: number;
			
			start(params?: AccelerometerStartParams, callback?: (started: boolean) => void): Accelerometer;
			stop(callback?: (stopped: boolean) => void): Accelerometer;
		}
		
		interface AccelerometerStartParams {
			refresh_rate?: number; // 20-1000 ms
		}
		
		interface DeviceOrientation {
			isStarted: boolean;
			absolute: boolean;
			alpha: number;
			beta: number;
			gamma: number;
			
			start(params?: DeviceOrientationStartParams, callback?: (started: boolean) => void): DeviceOrientation;
			stop(callback?: (stopped: boolean) => void): DeviceOrientation;
		}
		
		interface DeviceOrientationStartParams {
			refresh_rate?: number; // 20-1000 ms
			need_absolute?: boolean;
		}
		
		interface Gyroscope {
			isStarted: boolean;
			x: number;
			y: number;
			z: number;
			
			start(params?: GyroscopeStartParams, callback?: (started: boolean) => void): Gyroscope;
			stop(callback?: (stopped: boolean) => void): Gyroscope;
		}
		
		interface GyroscopeStartParams {
			refresh_rate?: number; // 20-1000 ms
		}
		
		interface LocationManager {
			isInited: boolean;
			isLocationAvailable: boolean;
			isAccessRequested: boolean;
			isAccessGranted: boolean;
			
			init(callback?: () => void): LocationManager;
			getLocation(callback: (data: LocationData | null) => void): LocationManager;
			openSettings(): LocationManager;
		}
		
		interface LocationData {
			latitude: number;
			longitude: number;
			altitude: number | null;
			course: number | null;
			speed: number | null;
			horizontal_accuracy: number | null;
			vertical_accuracy: number | null;
			course_accuracy: number | null;
			speed_accuracy: number | null;
		}
		
		interface DeviceStorage {
			setItem(key: string, value: string, callback?: (error: unknown, success: boolean) => void): DeviceStorage;
			getItem(key: string, callback: (error: unknown, value: string | null) => void): DeviceStorage;
			removeItem(key: string, callback?: (error: unknown, success: boolean) => void): DeviceStorage;
			clear(callback?: (error: unknown, success: boolean) => void): DeviceStorage;
		}
		
		interface SecureStorage {
			setItem(key: string, value: string, callback?: (error: unknown, success: boolean) => void): SecureStorage;
			getItem(key: string, callback: (error: unknown, value: string | null, restorable?: boolean) => void): SecureStorage;
			restoreItem(key: string, callback?: (error: unknown, value: string | null) => void): SecureStorage;
			removeItem(key: string, callback?: (error: unknown, success: boolean) => void): SecureStorage;
			clear(callback?: (error: unknown, success: boolean) => void): SecureStorage;
		}
	}
	
	interface Window {
		Telegram: {
			WebApp: Telegram.WebApp;
		};
	}
}
