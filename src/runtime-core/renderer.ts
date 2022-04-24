import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
	// patch
	//
	patch(vnode, container);
}

function patch(vnode, container) {
	// 去处理组件

	// TODO 判断vnode 是不是 element
	// 是 element 那么就应该处理element
	// 思考题：如何区分是element还是component类型？
	// processElement();
	processComponent(vnode, container);
}

function processComponent(vnode: any, container: any) {
	mountComponent(vnode, container);
}

function mountComponent(vnode: any, container) {
	const instance = createComponentInstance(vnode);
	setupComponent(instance);
	setupRenderEffect(instance, container);
}

function setupRenderEffect(instance: any, container) {
	const subTree = instance.render();
	// vnode -> patch
	// vnode -> element -> mountElement
	patch(subTree, container);
}
