class ReactiveEffect {
	private _fn: any;

	constructor(fn) {
		this._fn = fn;
	}
	run() {
		activeEffect = this;
		// 返回当前的fn
		return this._fn();
	}
}

// 依赖收集
const targetMap = new Map();
export function track(target, key) {
	let depsMap = targetMap.get(target);

	if (!depsMap) {
		depsMap = new Map();
		targetMap.set(target, depsMap);
	}

	let dep = depsMap.get(key);

	if (!dep) {
		dep = new Set();
		depsMap.set(key, dep);
	}

	dep.add(activeEffect);
}

// 依赖触发
export function trigger(target, key) {
	let depsMap = targetMap.get(target);
	let dep = depsMap.get(key);

	for (const effect of dep) {
		effect.run();
	}
}

let activeEffect;
export function effect(fn) {
	// fn
	const _effect = new ReactiveEffect(fn);
	_effect.run();

	// 返回runner函数(即run)--》执行后返回fn
	return _effect.run.bind(_effect);
}
