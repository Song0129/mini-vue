import { isObject } from "../shared/index";
import { ShapeFlags } from "../shared/ShapeFlags";
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
	// shapeFlags
	// vnode -> flag  给vnode添加表示
	const { shapeFlag } = vnode;
	if (shapeFlag & ShapeFlags.ELEMENT) {
		processElement(vnode, container);
		// STATEFUL_COMPONENT
	} else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
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
	const { children, shapeFlag } = vnode;

	if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
		// text_children
		el.textContent = children;
	} else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
		// array_children
		// vnode
		mountChildren(vnode, el);
	}

	// props
	const { props } = vnode;

	for (const key in props) {
		const val = props[key];
		console.log(key);
		// 具体的click事件 =》抽象为通用性事件
		// on + Event name
		const isOn = (key: string) => /^on[A-Z]/.test(key);
		if (isOn(key)) {
			const event = key.slice(2).toLowerCase();
			el.addEventListener(event, val);
		} else {
			el.setAttribute(key, val);
		}
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
