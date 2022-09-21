import { h, renderSlots } from "../../dist/mini-vue.esm.js";

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
		// 实现具名slot
		// 1. 获取到要渲染的元素
		// 2. 获取到渲染的位置
		// 作用域slot
		const age = 18;
		return h("div", {}, [renderSlots(this.$slots, "header", { age }), foo, renderSlots(this.$slots, "footer")]);
	},
};
