import { h } from "../../lib/mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
	name: "App",
	render() {
		const app = h("div", {}, "App");
		// 数组 | vnode
		const foo = h(Foo, {}, [h("p", {}, "123"), h("p", {}, "456")]);
		// const foo = h(Foo, {}, h("p", {}, "123"));

		return h("div", {}, [app, foo]);
	},
	setup() {
		return {};
	},
};
