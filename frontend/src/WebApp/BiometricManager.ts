import {WebAppRoot} from "./WebApp";

class BiometricManager {
	
	get isInited() {
		return WebAppRoot.BiometricManager.isInited;
	}
	
	get isBiometricAvailable() {
		return WebAppRoot.BiometricManager.isBiometricAvailable;
	}
	
	get biometricType() {
		return WebAppRoot.BiometricManager.biometricType;
	}
	
	get deviceId() {
		return WebAppRoot.BiometricManager.deviceId;
	}
	
	get isAccessRequested() {
		return WebAppRoot.BiometricManager.isAccessRequested;
	}
	
	get isAccessGranted() {
		return WebAppRoot.BiometricManager.isAccessGranted;
	}
	
	get isBiometricTokenSaved() {
		return WebAppRoot.BiometricManager.isBiometricTokenSaved;
	}
	
	init() {
		WebAppRoot.BiometricManager.init();
	}
	
	requestAccess() {
		WebAppRoot.BiometricManager.requestAccess();
	}
	
	authenticate() {
		WebAppRoot.BiometricManager.authenticate();
	}
	
	updateBiometricToken(token: string) {
		WebAppRoot.BiometricManager.updateBiometricToken(token);
	}
	
	openSettings() {
		WebAppRoot.BiometricManager.openSettings();
	}
}

export default BiometricManager;
