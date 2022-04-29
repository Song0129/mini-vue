import { isObject } from "../shared/index";
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
	if (typeof vnode.type === "string") {
		processElement(vnode, container);
	} else if (isObject(vnode.type)) {
		processComponent(vnode, container);
	}
}

function processElement(vnode: any, container: any) {
	mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
	// vnode -> element -> div
	const el = (vnode.el = document.createElement(vnode.type));

	// string  array
	const { children } = vnode;

	if (typeof children === "string") {
		el.textContent = children;
	} else if (Array.isArray(children)) {
		// vnode
		mountChildren(vnode, el);
	}

	// props
	const { props } = vnode;
	for (const key in props) {
		const val = props[key];
		el.setAttribute(key, val);
	}

	container.append(el);
}

function mountChildren(vnode, container) {
	vnode.children.forEach(v => {
		patch(v, container);
	});
}

function processComponent(vnode: any, container: any) {
	mountComponent(vnode, container);
}

function mountComponent(initialVnode: any, container) {
	const instance = createComponentInstance(initialVnode);

	setupComponent(instance);
	setupRenderEffect(instance, initialVnode, container);
}

function setupRenderEffect(instance: any, initialVnode, container) {
	const { proxy } = instance;
	const subTree = instance.render.call(proxy);
	// vnode -> patch
	// vnode -> element -> mountElement
	patch(subTree, container);

	// element -> mount
	initialVnode.el = subTree.el;
}
