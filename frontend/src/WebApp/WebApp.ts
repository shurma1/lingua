import BackButton from "./BackButton";
import HapticFeedback from "./HapticFeedback";
import {Platform} from "@WebApp/types";

const WebAppRoot = window.Telegram.WebApp;

class WebApp {
	
	public HapticFeedback: HapticFeedback;
	public BackButton: BackButton;
	public initData: string;
	
	constructor() {
		const platoform = this.Platform;
		this.HapticFeedback = new HapticFeedback(platoform);
		this.BackButton = new BackButton();
		this.initData = WebAppRoot.initData;
	}
	
	get Platform(): Platform {
		return WebAppRoot.platform as Platform;
	}
}

export {WebAppRoot};
export default new WebApp();
