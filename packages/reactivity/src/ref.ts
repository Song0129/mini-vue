import { hasChanges, isObject } from "@mini-vue/shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
	private _value: any;
	private _rawValue: any;
	public dep;
	public __v_isRef = true;
	constructor(value) {
		this._rawValue = value;
		this._value = convert(value);
		// value -> this._value
		// 1. 看看value 是不是对象

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
		// 对比的时候 object
		if (hasChanges(newValue, this._rawValue)) {
			this._rawValue = newValue;
			this._value = convert(newValue);
			triggerEffects(this.dep);
		}
	}
}

function convert(value) {
	return isObject(value) ? reactive(value) : value;
}

function trackRefValue(ref) {
	// 如果是tracking的话，就追踪dep
	if (isTracking()) trackEffects(ref.dep);
}

export function ref(value) {
	return new RefImpl(value);
}

export function isRef(ref) {
	return !!ref.__v_isRef;
}

export function unRef(ref) {
	// 看看是不是ref -> ref.value
	// ref
	return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWithRef) {
	return new Proxy(objectWithRef, {
		get(target, key) {
			// get -> age(ref) 那么就给他返回 .value
			// not ref -> value
			return unRef(Reflect.get(target, key));
		},
		set(target, key, value) {
			// set -> ref 设置.value
			if (isRef(target[key]) && !isRef(value)) {
				return (target[key].value = value);
			} else {
				return Reflect.set(target, key, value);
			}
		},
	});
}
