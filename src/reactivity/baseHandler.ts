import { track, trigger } from "./effect";
import { ReactiveFlags } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

function createGetter(isReadonly = false) {
	// 返回proxy对象，代理整个对象raw
	// get时，收集依赖即收集内容改变时的回调函数fn
	// set时，触发依赖即触发内容改变时需执行的函数fn
	return function get(target, key) {
		if (key === ReactiveFlags.IS_REACTIVE) {
			return !isReadonly;
		} else if (key === ReactiveFlags.IS_READONLY) {
			return isReadonly;
		}

		const res = Reflect.get(target, key);

		if (!isReadonly) {
			track(target, key);
		}
		return res;
	};
}

function createSetter() {
	return function set(target, key, value) {
		const res = Reflect.set(target, key, value);

		// TODO 触发依赖
		trigger(target, key);
		return res;
	};
}

export const mutableHandlers = {
	get,
	set,
};

export const readonlyHandlers = {
	get: readonlyGet,
	set(target, key, value) {
		console.warn(`key:${key} set 失败 因为 target 是readonly`, target);
		return true;
	},
};
