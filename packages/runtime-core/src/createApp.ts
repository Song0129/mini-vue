import { createVNode } from "./vnode";

// render
export function createAppAPI(render) {
	return function createApp(rootComponent) {
		return {
			mount(rootContainer) {
				// 先转换为 vnode
				// component -> vnode
				// 所有逻辑操作都会基于 vnode 做处理
				const vnode = createVNode(rootComponent);
				render(vnode, rootContainer);
			},
		};
	};
}
