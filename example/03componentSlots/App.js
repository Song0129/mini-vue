import { h, createTextVNode } from "../../lib/mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
	name: "App",
	render() {
		const app = h("div", {}, "App");
		// 数组 | vnode
		const foo = h(
			Foo,
			{},
			{
				header: ({ age }) => [h("p", {}, "header" + age), createTextVNode("hello")],
				footer: () => h("p", {}, "footer"),
			}
		);
		// const foo = h(Foo, {}, h("p", {}, "123"));

		return h("div", {}, [app, foo]);
	},
	setup() {
		return {};
	},
};
