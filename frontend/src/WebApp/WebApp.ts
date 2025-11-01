import BackButton from "./BackButton.ts";
import HapticFeedback from "./HapticFeedback.ts";
import {Platform} from "./types/Platform.ts";

const WebAppRoot = window.Telegram.WebApp;

class WebApp {
	
	public HapticFeedback: HapticFeedback;
	public BackButton: BackButton;
	
	constructor() {
		const platoform = this.Platform;
		this.HapticFeedback = new HapticFeedback(platoform);
		this.BackButton = new BackButton();
	}
	
	get Platform(): Platform {
		return WebAppRoot.platform as Platform;
	}
}

export {WebAppRoot};
export default new WebApp();
