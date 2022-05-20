import { createVNode } from "../vnode";

export function renderSlots(slots, name) {
	// 创建虚拟节点
	const slot = slots[name];
	if (slot) {
		return createVNode("div", {}, slot);
	}
}
