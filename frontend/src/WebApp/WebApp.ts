import {Platform} from "@WebApp/types";

import BackButton from "./BackButton";
import HapticFeedback from "./HapticFeedback";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
let _webAppRoot: MAX.WebApp = null;
const getWebAppRoot = (): MAX.WebApp => {
	if (!_webAppRoot) {
		_webAppRoot = window.WebApp;
	}
	return _webAppRoot;
};

const WebAppRoot = window.WebApp;

class WebApp {
	
	public HapticFeedback: HapticFeedback;
	public BackButton: BackButton;
	
	constructor() {
		const platform = this.Platform;
		this.HapticFeedback = new HapticFeedback(platform);
		this.BackButton = new BackButton();
	}
	
	get initData(): string {
		return getWebAppRoot().initData;
	}
	
	public shareMaxContent(text: string, link: string) {
		WebAppRoot.shareMaxContent({text, link});
	}
	
	public shareContent(text: string, link: string) {
		WebAppRoot.shareContent({text, link});
	}
	
	public openLink(url: string) {
		WebAppRoot.openLink(url);
	}
	
	public openMaxLink(url: string) {
		WebAppRoot.openMaxLink(url);
	}
	
	public requestContact() {
		WebAppRoot.requestContact();
	}
	
	public enableClosingConfirmation() {
		WebAppRoot.enableClosingConfirmation();
	}
	
	public disableClosingConfirmation() {
		WebAppRoot.disableClosingConfirmation();
	}
	
	public downloadFile(url: string, fileName: string) {
		WebAppRoot.downloadFile(url, fileName);
	}
	
	public openCodeReader(fileSelect?: boolean) {
		WebAppRoot.openCodeReader(fileSelect);
	}
	
	public ready() {
		WebAppRoot.ready();
	}
	
	public close() {
		WebAppRoot.close();
	}
	
	get Platform(): Platform {
		return WebAppRoot.platform as Platform;
	}
	
	get ScreenCapture() {
		return WebAppRoot.ScreenCapture;
	}
	
	get DeviceStorage() {
		return WebAppRoot.DeviceStorage;
	}
	
	get SecureStorage() {
		return WebAppRoot.SecureStorage;
	}
	
	get BiometricManager() {
		return WebAppRoot.BiometricManager;
	}
}

export {WebAppRoot};
export default new WebApp();
