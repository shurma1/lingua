import {HAPTIC_AVAILABLE_PLATFORMS} from "./config";
import {WebAppRoot} from "./WebApp";

import type {
	ImpactStyle,
	NotificationType,
	Platform,
} from "@WebApp/types";


class HapticFeedback {

	private platform: Platform;
	
	constructor(platform: Platform) {
		this.platform = platform;
	}
	
	get isHapticAvailable() {
		return HAPTIC_AVAILABLE_PLATFORMS.includes(this.platform);
	}
	
	impactOccurred(impactStyle: ImpactStyle, force = false, disableVibrationFallback = true) {
		if(! force && ! this.isHapticAvailable) return;
		WebAppRoot.HapticFeedback.impactOccurred(impactStyle, disableVibrationFallback);
	}
	
	notificationOccurred(notificationType: NotificationType, force = false, disableVibrationFallback = false) {
		if(! force && ! this.isHapticAvailable) return;
		WebAppRoot.HapticFeedback.notificationOccurred(notificationType, disableVibrationFallback);
	}
	
	selectionChanged(force = false, disableVibrationFallback = false) {
		if(! force && ! this.isHapticAvailable) return;
		WebAppRoot.HapticFeedback.selectionChanged(disableVibrationFallback);
	}
}

export default HapticFeedback;
