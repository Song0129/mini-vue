import { track, trigger } from "./effect";

export function reactive(raw) {
	// 返回proxy对象，代理整个对象raw
	// get时，收集依赖即收集内容改变时的回调函数fn
	// set时，触发依赖即触发内容改变时需执行的函数fn
	return new Proxy(raw, {
		get(target, key) {
			// {foo:1}
			// foo
			const res = Reflect.get(target, key);

			// TODO 依赖收集
			track(target, key);
			return res;
		},
		set(target, key, value) {
			const res = Reflect.set(target, key, value);

			// TODO 触发依赖
			trigger(target, key);
			return res;
		},
	});
}
