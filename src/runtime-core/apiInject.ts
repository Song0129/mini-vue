import { getCurrentInstance } from "./component";

export function provide(key, val) {
	// set
	const currentInstance: any = getCurrentInstance();
	if (currentInstance) {
		const { provides } = currentInstance;
		provides[key] = val;
	}
}

export function inject(key) {
	// get
	const currentInstance: any = getCurrentInstance();
	if (currentInstance) {
		const parentProvides = currentInstance.parent.provides;
		return parentProvides[key];
	}
}
