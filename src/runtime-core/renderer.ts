import { effect } from "../reactivity/effect";
import { isObject } from "../shared/index";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function creatRenderer(options) {
	const {
		createElement: hostCreateElement,
		patchProp: hostPatchProp,
		insert: hostInsert,
	} = options;

	function render(vnode, container) {
		// patch
		//
		patch(vnode, container, null);
	}

	function patch(vnode, container, parentComponent) {
		// 去处理组件

		// TODO 判断vnode 是不是 element
		// 是 element 那么就应该处理element
		// 思考题：如何区分是element还是component类型？
		// shapeFlags
		// vnode -> flag  给vnode添加表示
		const { type, shapeFlag } = vnode;
		switch (type) {
			case Fragment:
				processFragment(vnode, container, parentComponent);
				break;
			case Text:
				processText(vnode, container);
				break;
			default:
				if (shapeFlag & ShapeFlags.ELEMENT) {
					processElement(vnode, container, parentComponent);
					// STATEFUL_COMPONENT
				} else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
					processComponent(vnode, container, parentComponent);
				}
				break;
		}
	}

	function processElement(vnode: any, container: any, parentComponent: any) {
		mountElement(vnode, container, parentComponent);
	}

	function mountElement(vnode: any, container: any, parentComponent: any) {
		// vnode -> element -> div
		// canvas new Element()
		const el = (vnode.el = hostCreateElement(vnode.type));

		// string  array
		const { children, shapeFlag } = vnode;

		if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
			// text_children
			el.textContent = children;
		} else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
			// array_children
			// vnode
			mountChildren(vnode, el, parentComponent);
		}

		// props
		const { props } = vnode;

		for (const key in props) {
			const val = props[key];
			// console.log(key);
			// 具体的click事件 =》抽象为通用性事件
			// on + Event name
			// const isOn = (key: string) => /^on[A-Z]/.test(key);
			// if (isOn(key)) {
			// 	const event = key.slice(2).toLowerCase();
			// 	el.addEventListener(event, val);
			// } else {
			// 	el.setAttribute(key, val);
			// }
			hostPatchProp(el, key, val);
		}

		// canvas  el.x = 10

		// canvas  addChild()
		// container.append(el);
		hostInsert(el, container);
	}

	function mountChildren(vnode, container, parentComponent) {
		vnode.children.forEach(v => {
			patch(v, container, parentComponent);
		});
	}

	function processComponent(vnode: any, container: any, parentComponent: any) {
		mountComponent(vnode, container, parentComponent);
	}

	function mountComponent(initialVnode: any, container, parentComponent) {
		const instance = createComponentInstance(initialVnode, parentComponent);

		setupComponent(instance);
		setupRenderEffect(instance, initialVnode, container);
	}

	function setupRenderEffect(instance: any, initialVnode, container) {
		effect(() => {
			if (!instance.isMounted) {
				console.log("init");
				const { proxy } = instance;
				const subTree = (instance.subTree = instance.render.call(proxy));
				console.log(subTree);
				// vnode -> patch
				// vnode -> element -> mountElement
				patch(subTree, container, instance);

				// element -> mount
				initialVnode.el = subTree.el;

				instance.isMounted = true;
			} else {
				console.log("update");
				const { proxy } = instance;
				const subTree = instance.render.call(proxy);
				const prevSubTree = instance.subTree;
				console.log("current", subTree);
				console.log("prevSubTree", prevSubTree);
			}
		});
	}
	function processFragment(vnode: any, container: any, parentComponent: any) {
		mountChildren(vnode, container, parentComponent);
	}
	function processText(vnode: any, container: any) {
		const { children } = vnode;
		const textNode = (vnode.el = document.createTextNode(children));
		container.append(textNode);
	}

	return {
		createApp: createAppAPI(render),
	};
}
