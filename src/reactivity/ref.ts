import { isTracking, trackEffects, triggerEffects } from "./effect";

class RefImpl {
	private _value: any;
	public dep;
	constructor(value) {
		this._value = value;
		this.dep = new Set();
	}
	get value() {
		if (isTracking()) trackEffects(this.dep);
		return this._value;
	}
	set value(newValue) {
		// 一定先去修改了value值
		// newValue -> this._value
		if (Object.is(newValue, this._value)) return;

		this._value = newValue;
		triggerEffects(this.dep);
	}
}

export function ref(value) {
	return new RefImpl(value);
}
