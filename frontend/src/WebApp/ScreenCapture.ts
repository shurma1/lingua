import {WebAppRoot} from "./WebApp";

class ScreenCapture {
	
	get isScreenCaptureEnabled() {
		return WebAppRoot.ScreenCapture.isScreenCaptureEnabled;
	}
	
	enableScreenCapture() {
		WebAppRoot.ScreenCapture.enableScreenCapture();
	}
	
	disableScreenCapture() {
		WebAppRoot.ScreenCapture.disableScreenCapture();
	}
}

export default ScreenCapture;
