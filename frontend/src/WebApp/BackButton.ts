import {WebAppRoot} from "./WebApp.ts";

type CallbackFunction = () => void;

class BackButton {
	
	public activeCallbacks: CallbackFunction[] = [];
	
	get isVisible() {
		return WebAppRoot.BackButton.isVisible;
	}
	
	get callbacks() {
		return [...this.activeCallbacks];
	}
	
	onClick(callback: () => void) {
		WebAppRoot.BackButton.onClick(callback);
	}
	
	offClick(callback: () => void) {
		WebAppRoot.BackButton.offClick(callback);
	}
	
	offClickAll() {
		this.activeCallbacks.forEach(this.offClick);
		this.activeCallbacks = [];
	}
	
	show() {
		WebAppRoot.BackButton.show();
	}
	
	hide() {
		WebAppRoot.BackButton.hide();
	}
}

export default BackButton;
