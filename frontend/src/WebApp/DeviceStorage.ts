import {WebAppRoot} from "./WebApp";

class DeviceStorage {
	
	setItem(key: string, value: string) {
		WebAppRoot.DeviceStorage.setItem(key, value);
	}
	
	getItem(key: string): string | null {
		return WebAppRoot.DeviceStorage.getItem(key);
	}
	
	removeItem(key: string) {
		WebAppRoot.DeviceStorage.removeItem(key);
	}
	
	clear() {
		WebAppRoot.DeviceStorage.clear();
	}
}

export default DeviceStorage;
