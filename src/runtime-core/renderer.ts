import { effect } from "../reactivity/effect";
import { EMPTY_OBJ, isObject } from "../shared/index";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function creatRenderer(options) {
	const {
		createElement: hostCreateElement,
		patchProp: hostPatchProp,
		insert: hostInsert,
		remove: hostRemove,
		setElementText: hostSetElementText,
	} = options;

	function render(vnode, container) {
		// patch
		//
		patch(null, vnode, container, null);
	}

	// n1 -> 新的
	// n2 -> 旧的
	function patch(n1, n2, container, parentComponent) {
		// 去处理组件

		// TODO 判断vnode 是不是 element
		// 是 element 那么就应该处理element
		// 思考题：如何区分是element还是component类型？
		// shapeFlags
		// vnode -> flag  给vnode添加表示
		const { type, shapeFlag } = n2;
		switch (type) {
			case Fragment:
				processFragment(n1, n2, container, parentComponent);
				break;
			case Text:
				processText(n1, n2, container);
				break;
			default:
				if (shapeFlag & ShapeFlags.ELEMENT) {
					processElement(n1, n2, container, parentComponent);
					// STATEFUL_COMPONENT
				} else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
					processComponent(n1, n2, container, parentComponent);
				}
				break;
		}
	}

	function processElement(
		n1: any,
		n2: any,
		container: any,
		parentComponent: any
	) {
		if (!n1) {
			mountElement(n2, container, parentComponent);
		} else {
			patchElement(n1, n2, container, parentComponent);
		}
	}
	function patchElement(n1, n2, container, parentComponent) {
		console.log("patchElement");
		console.log("n1", n1);
		console.log("n2", n2);

		// props
		const oldProps = n1.props || EMPTY_OBJ;
		const newProps = n2.props || EMPTY_OBJ;
		const el = (n2.el = n1.el);
		patchProps(el, oldProps, newProps);

		// children
		patchChildren(n1, n2, el, parentComponent);
	}

	function patchChildren(
		n1: any,
		n2: any,
		container: any,
		parentComponent: any
	) {
		const { shapeFlag: prevShapeFlag } = n1;
		const c1 = n1.children;

		const { shapeFlag } = n2;
		const c2 = n2.children;

		// 新的是文本节点
		if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
			// 旧的是数组节点 或 文本节点
			if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
				// 1. 把老的children清空
				unmountChildren(n1.children);
			}
			// 2. 设置text
			if (c1 !== c2) {
				hostSetElementText(container, c2);
			}
		} else {
			// 新的是组数节点
			if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
				// 旧的是文本节点
				hostSetElementText(container, "");
				mountChildren(c2, container, parentComponent);
			}
		}
	}

	// 删除子节点
	function unmountChildren(children) {
		for (let i = 0; i < children.length; i++) {
			const el = children[i].el;
			// remove
			hostRemove(el);
		}
	}

	// 对比props
	function patchProps(el: any, oldProps: any, newProps: any) {
		if (oldProps !== newProps) {
			for (const key in newProps) {
				const prevProp = oldProps[key];
				const nextProp = newProps[key];
				if (prevProp !== nextProp) {
					hostPatchProp(el, key, prevProp, nextProp);
				}
			}
			if (oldProps !== EMPTY_OBJ) {
				for (const key in oldProps) {
					if (!(key in newProps)) {
						hostPatchProp(el, key, oldProps[key], null);
					}
				}
			}
		}
	}

	// 挂载元素
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
			mountChildren(vnode.children, el, parentComponent);
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
			hostPatchProp(el, key, null, val);
		}

		// canvas  el.x = 10

		// canvas  addChild()
		// container.append(el);
		hostInsert(el, container);
	}

	// 挂载子节点
	function mountChildren(children, container, parentComponent) {
		children.forEach(v => {
			patch(null, v, container, parentComponent);
		});
	}

	function processComponent(
		n1: any,
		n2: any,
		container: any,
		parentComponent: any
	) {
		mountComponent(n2, container, parentComponent);
	}

	// 挂载组件
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
				// vnode -> patch
				// vnode -> element -> mountElement
				patch(null, subTree, container, instance);

				// element -> mount
				initialVnode.el = subTree.el;

				instance.isMounted = true;
			} else {
				console.log("update");
				const { proxy } = instance;
				const subTree = instance.render.call(proxy);
				const prevSubTree = instance.subTree;
				instance.subTree = subTree;

				patch(prevSubTree, subTree, container, instance);
			}
		});
	}

	function processFragment(
		n1: any,
		n2: any,
		container: any,
		parentComponent: any
	) {
		mountChildren(n2.children, container, parentComponent);
	}

	function processText(n1: any, n2: any, container: any) {
		const { children } = n2;
		const textNode = (n2.el = document.createTextNode(children));
		container.append(textNode);
	}

	return {
		createApp: createAppAPI(render),
	};
}
