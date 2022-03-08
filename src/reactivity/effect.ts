class ReactiveEffect {
	private _fn: any;

	constructor(fn) {
		this._fn = fn;
	}
	run() {
		activeEffect = this._fn;
		this._fn();
	}
}

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
	}

	dep.push();
}

let activeEffect;
export function effect(fn) {
	// fn
	const _effect = new ReactiveEffect(fn);
	_effect.run();
}