import {WebAppRoot} from "./WebApp";

class SecureStorage {
	
	setItem(key: string, value: string) {
		WebAppRoot.SecureStorage.setItem(key, value);
	}
	
	getItem(key: string): string | null {
		return WebAppRoot.SecureStorage.getItem(key);
	}
	
	removeItem(key: string) {
		WebAppRoot.SecureStorage.removeItem(key);
	}
}

export default SecureStorage;
