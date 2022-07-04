import { effect } from "../reactivity/effect";
import { EMPTY_OBJ, isObject } from "../shared/index";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { shouldUpdateComponent } from "./componentUpdateUtils";
import { createAppAPI } from "./createApp";
import { queueJobs } from "./scheduler";
import { Fragment, Text } from "./vnode";

export function creatRenderer(options) {
	const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert, remove: hostRemove, setElementText: hostSetElementText } = options;

	function render(vnode, container) {
		// patch
		//
		patch(null, vnode, container, null, null);
	}

	// n1 -> 新的
	// n2 -> 旧的
	function patch(n1, n2, container, parentComponent, anchor) {
		// 去处理组件

		// TODO 判断vnode 是不是 element
		// 是 element 那么就应该处理element
		// 思考题：如何区分是element还是component类型？
		// shapeFlags
		// vnode -> flag  给vnode添加表示
		const { type, shapeFlag } = n2;
		switch (type) {
			case Fragment:
				processFragment(n1, n2, container, parentComponent, anchor);
				break;
			case Text:
				processText(n1, n2, container);
				break;
			default:
				if (shapeFlag & ShapeFlags.ELEMENT) {
					processElement(n1, n2, container, parentComponent, anchor);
					// STATEFUL_COMPONENT
				} else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
					processComponent(n1, n2, container, parentComponent, anchor);
				}
				break;
		}
	}

	function processElement(n1: any, n2: any, container: any, parentComponent: any, anchor: any) {
		if (!n1) {
			mountElement(n2, container, parentComponent, anchor);
		} else {
			patchElement(n1, n2, container, parentComponent, anchor);
		}
	}
	function patchElement(n1, n2, container, parentComponent, anchor) {
		console.log("patchElement");
		console.log("n1", n1);
		console.log("n2", n2);

		// props
		const oldProps = n1.props || EMPTY_OBJ;
		const newProps = n2.props || EMPTY_OBJ;
		const el = (n2.el = n1.el);
		patchProps(el, oldProps, newProps);

		// children
		patchChildren(n1, n2, el, parentComponent, anchor);
	}

	function patchChildren(n1: any, n2: any, container: any, parentComponent: any, anchor: any) {
		const { shapeFlag: prevShapeFlag } = n1;
		const c1 = n1.children; //老的子节点

		const { shapeFlag } = n2;
		const c2 = n2.children; //新的子节点

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
				mountChildren(c2, container, parentComponent, anchor);
			} else {
				// 旧的是数组节点
				// array diff array
				patchKeyedChildren(c1, c2, container, parentComponent, anchor);
			}
		}
	}

	// 对比数组节点
	function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
		const l2 = c2.length; //新的子节点的长度
		let i = 0; //指针位置
		let e1 = c1.length - 1; //老的最后一位下标
		let e2 = l2 - 1; //新的自后一位下标

		function isSomeVNodeType(n1, n2) {
			// type
			// key
			return n1.type === n2.type && n1.key === n2.key;
		}

		// 左侧对比
		// (a b) c
		// (a b) d e
		while (i <= e1 && i <= e2) {
			const n1 = c1[i];
			const n2 = c2[i];

			if (isSomeVNodeType(n1, n2)) {
				patch(n1, n2, container, parentComponent, parentAnchor);
			} else {
				break;
			}
			i++;
		}

		// 右侧对比
		// a (b c)
		// d e (b c)
		while (i <= e1 && i <= e2) {
			const n1 = c1[e1];
			const n2 = c2[e2];

			if (isSomeVNodeType(n1, n2)) {
				patch(n1, n2, container, parentComponent, parentAnchor);
			} else {
				break;
			}
			e1--;
			e2--;
		}

		if (i > e1) {
			// 新的比老的多 --> 创建新的
			// 左侧对比
			// (a b)
			// (a b) c
			// 右侧对比
			// (a b)
			// c (a b)
			if (i <= e2) {
				const nextPos = e2 + 1;
				const anchor = nextPos < l2 ? c2[nextPos].el : null;

				while (i <= e2) {
					patch(null, c2[i], container, parentComponent, anchor);
					i++;
				}
			}
		} else if (i > e2) {
			// 新的比老的少 --> 删除老的
			// 左侧对比
			// (a b) c
			// (a b)
			// 右侧对比
			// (a b) c
			// (b c)
			while (i <= e1) {
				hostRemove(c1[i].el);
				i++;
			}
		} else {
			// 乱序的部分 --- 中间遍历
			let s1 = i; //老的中间部位的开始位置
			let s2 = i; //新的中间部位的开始位置

			const toBePatched = e2 - s2 + 1; //应该被patch的数量
			let patched = 0; //已经被patch的数量
			const keyToNewIndexMap = new Map(); //key的映射 提高diff的效率

			const newIndexToOldIndexMap = new Array(toBePatched); //老节点在新节点位置映射--不同部分
			let moved = false; //是否需要移动
			let maxNewIndexSoFar = 0; //最大的新的下标

			for (let i = 0; i < toBePatched; i++) {
				newIndexToOldIndexMap[i] = 0;
			}

			// 映射key
			for (let i = s2; i <= e2; i++) {
				const nextChild = c2[i];
				keyToNewIndexMap.set(nextChild.key, i);
			}

			// 遍历---确定节点在不在新节点中
			for (let i = s1; i <= e1; i++) {
				const prevChild = c1[i];

				// 如果已经patch的数量超过了应该patch的数量 后面的应自动删除
				if (patched >= toBePatched) {
					hostRemove(prevChild.el);
					continue;
				}

				// null undefined
				let newIndex;
				// 查找旧结点是否存在于新节点中
				if (prevChild.key != null) {
					// 有key-->映射查找
					newIndex = keyToNewIndexMap.get(prevChild.key);
				} else {
					// 无key-->遍历查找
					for (let j = 0; j <= e2; j++) {
						if (isSomeVNodeType(prevChild, c2[j])) {
							newIndex = j;
							break;
						}
					}
				}

				if (newIndex === undefined) {
					// 不在-->删除
					hostRemove(prevChild.el);
				} else {
					if (newIndex >= maxNewIndexSoFar) {
						maxNewIndexSoFar = newIndex;
					} else {
						moved = true;
					}
					newIndexToOldIndexMap[newIndex - s2] = i + 1;
					// 在-->更新
					patch(prevChild, c2[newIndex], container, parentComponent, null);
					patched++;
				}
			}

			const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : [];
			let j = increasingNewIndexSequence.length - 1;
			for (let i = toBePatched; i >= 0; i--) {
				const nextIndex = i + s2;
				const nextChild = c2[nextIndex];
				const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null;

				if (newIndexToOldIndexMap[i] === 0) {
					patch(null, nextChild, container, parentComponent, anchor);
				} else if (moved) {
					if (j < 0 || i !== increasingNewIndexSequence[j]) {
						console.log("移动位置");
						hostInsert(nextChild.el, container, anchor);
					} else {
						j--;
					}
				}
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
	function mountElement(vnode: any, container: any, parentComponent: any, anchor: any) {
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
			mountChildren(vnode.children, el, parentComponent, anchor);
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
		hostInsert(el, container, anchor);
	}

	// 挂载子节点
	function mountChildren(children, container, parentComponent, anchor) {
		children.forEach(v => {
			patch(null, v, container, parentComponent, anchor);
		});
	}

	function processComponent(n1: any, n2: any, container: any, parentComponent: any, anchor: any) {
		if (!n1) {
			mountComponent(n2, container, parentComponent, anchor);
		} else {
			updateComponent(n1, n2);
		}
	}

	// 更新组件
	function updateComponent(n1, n2) {
		const instance = (n2.component = n1.component);

		if (shouldUpdateComponent(n1, n2)) {
			instance.next = n2;
			instance.update();
		} else {
			n2.el = n1.el;
			n2.vnode = n2;
		}
	}

	// 挂载组件
	function mountComponent(initialVnode: any, container, parentComponent, anchor) {
		const instance = (initialVnode.component = createComponentInstance(initialVnode, parentComponent));

		setupComponent(instance);
		setupRenderEffect(instance, initialVnode, container, anchor);
	}

	function setupRenderEffect(instance: any, initialVnode, container, anchor) {
		instance.update = effect(
			() => {
				if (!instance.isMounted) {
					console.log("init");
					const { proxy } = instance;
					const subTree = (instance.subTree = instance.render.call(proxy, proxy));
					// vnode -> patch
					// vnode -> element -> mountElement
					patch(null, subTree, container, instance, anchor);

					// element -> mount
					initialVnode.el = subTree.el;

					instance.isMounted = true;
				} else {
					console.log("update");
					// 需要一个 vnode
					const { next, vnode } = instance;
					if (next) {
						next.el = vnode.el;
						updateComponentPreRender(instance, next);
					}
					const { proxy } = instance;
					const subTree = instance.render.call(proxy, proxy);
					const prevSubTree = instance.subTree;
					instance.subTree = subTree;

					patch(prevSubTree, subTree, container, instance, anchor);
				}
			},
			{
				scheduler() {
					console.log("update - scheduler");

					queueJobs(instance.update);
				},
			}
		);
	}

	function processFragment(n1: any, n2: any, container: any, parentComponent: any, anchor: any) {
		mountChildren(n2.children, container, parentComponent, anchor);
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

// 更新组件props
function updateComponentPreRender(instance, nextVNode) {
	instance.vnode = nextVNode;
	instance.next = null;

	instance.props = nextVNode.props;
}

// 最长递增子序列算法
function getSequence(arr) {
	const p = arr.slice();
	const result = [0];
	let i, j, u, v, c;
	const len = arr.length;
	for (i = 0; i < len; i++) {
		const arrI = arr[i];
		if (arrI !== 0) {
			j = result[result.length - 1];
			if (arr[j] < arrI) {
				p[i] = j;
				result.push(i);
				continue;
			}
			u = 0;
			v = result.length - 1;
			while (u < v) {
				c = (u + v) >> 1;
				if (arr[result[c]] < arrI) {
					u = c + 1;
				} else {
					v = c;
				}
			}
			if (arrI < arr[result[u]]) {
				if (u > 0) {
					p[i] = result[u - 1];
				}
				result[u] = i;
			}
		}
	}
	u = result.length;
	v = result[u - 1];
	while (u-- > 0) {
		result[u] = v;
		v = p[v];
	}
	return result;
}
