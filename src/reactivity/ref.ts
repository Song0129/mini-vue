import { hasChanges } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";

class RefImpl {
	private _value: any;
	public dep;
	constructor(value) {
		this._value = value;
		this.dep = new Set();
	}
	get value() {
		trackRefValue(this);
		return this._value;
	}
	set value(newValue) {
		// 一定先去修改了value值
		// newValue -> this._value
		// hasChanged
		if (hasChanges(newValue, this._value)) {
			this._value = newValue;
			triggerEffects(this.dep);
		}
	}
}

function trackRefValue(ref) {
	// 如果是tracking的话，就追踪dep
	if (isTracking()) trackEffects(ref.dep);
}

export function ref(value) {
	return new RefImpl(value);
}
