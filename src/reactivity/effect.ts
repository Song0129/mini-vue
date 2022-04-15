import { extend } from "../shared";

let activeEffect;
let shouldTrack = true;

export class ReactiveEffect {
	private _fn: any;
	deps = [];
	active = true;
	onStop?: () => void;
	public scheduler: Function | undefined;
	constructor(fn, scheduler?: Function) {
		this._fn = fn;
		this.scheduler = scheduler;
	}
	run() {
		activeEffect = this;
		// 1. 会收集依赖
		//  shouldTrack 来区分
		if (!this.active) {
			return this._fn();
		}

		shouldTrack = true;
		activeEffect = this;

		const result = this._fn();
		// reset
		shouldTrack = false;

		// 返回当前的fn
		return result;
	}
	stop() {
		if (this.active) {
			cleanupEffect(this);
			if (this.onStop) {
				this.onStop();
			}
			this.active = false;
		}
	}
}

function cleanupEffect(effect) {
	effect.deps.forEach((dep: any) => {
		dep.delete(effect);
	});
	effect.deps.length = 0;
}

// 依赖收集
// 依赖集合targetMap
const targetMap = new Map();
export function track(target, key) {
	if (!isTracking()) return;

	// target在targetMap对应的依赖集合
	let depsMap = targetMap.get(target);

	if (!depsMap) {
		depsMap = new Map();
		// 存储集合
		targetMap.set(target, depsMap);
	}

	// key在depsMap对应的依赖
	let dep = depsMap.get(key);

	if (!dep) {
		dep = new Set();
		depsMap.set(key, dep);
	}

	trackEffects(dep);
}

export function trackEffects(dep) {
	// 已经存在于dep中了
	// 看看dep之前有没有添加过，添加过的话，就不添加了
	if (dep.has(activeEffect)) return;
	dep.add(activeEffect);

	activeEffect.deps.push(dep);
}

export function isTracking() {
	return shouldTrack && activeEffect !== undefined;
}

// 依赖触发
export function trigger(target, key) {
	// target在targetMap对应的依赖集合
	let depsMap = targetMap.get(target);
	// key在depsMap对应的依赖
	let dep = depsMap.get(key);

	triggerEffects(dep);
}
export function triggerEffects(dep) {
	// 循环遍历执行对应的依赖
	for (const effect of dep) {
		if (effect.scheduler) {
			effect.scheduler();
		} else {
			effect.run();
		}
	}
}

export function effect(fn, options: any = {}) {
	// fn
	const _effect = new ReactiveEffect(fn, options.scheduler);

	// options 复杂时
	// Object.assign(_effect, options);
	extend(_effect, options);

	_effect.run();

	const runner: any = _effect.run.bind(_effect);
	runner.effect = _effect;

	// 返回runner函数(即run)--》执行后返回fn
	return runner;
}

export function stop(runner) {
	runner.effect.stop();
}
