import { h, renderSlots } from "../../lib/mini-vue.esm.js";

export const Foo = {
	setup() {
		return {};
	},
	render() {
		const foo = h("p", {}, "foo");

		// 获取到foo组件的 vnode  找到其children
		console.log(this.$slots);
		// children -> vnode

		// renderSlots
		return h("div", {}, [foo, renderSlots(this.$slots)]);
	},
};
