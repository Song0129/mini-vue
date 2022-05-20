import { createVNode } from "../vnode";

export function renderSlots(slots) {
	// 创建虚拟节点
	return createVNode("div", {}, slots);
}
