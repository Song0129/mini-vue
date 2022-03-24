class ReactiveEffect {
	private _fn: any;
	deps = [];

	constructor(fn, public scheduler?) {
		this._fn = fn;
	}
	run() {
		activeEffect = this;
		// 返回当前的fn
		return this._fn();
	}
	stop() {
		this.deps.forEach((dep: any) => {
			dep.delete(this);
		});
	}
}

// 依赖收集
// 依赖集合targetMap
const targetMap = new Map();
export function track(target, key) {
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

	dep.add(activeEffect);

	activeEffect.deps.push(dep);
}

// 依赖触发
export function trigger(target, key) {
	// target在targetMap对应的依赖集合
	let depsMap = targetMap.get(target);
	// key在depsMap对应的依赖
	let dep = depsMap.get(key);

	// 循环遍历执行对应的依赖
	for (const effect of dep) {
		if (effect.scheduler) {
			effect.scheduler();
		} else {
			effect.run();
		}
	}
}

let activeEffect;
export function effect(fn, options: any = {}) {
	// fn
	const _effect = new ReactiveEffect(fn, options.scheduler);
	_effect.run();

	const runner: any = _effect.run.bind(_effect);
	runner.effect = _effect;

	// 返回runner函数(即run)--》执行后返回fn
	return runner;
}

export function stop(runner) {
	runner.effect.stop();
}
