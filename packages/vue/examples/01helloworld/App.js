import { h } from "../../dist/mini-vue.esm.js";

import { Foo } from "./Foo.js";

window.self = null;
export const App = {
	// .vue
	// <template></template>
	// render
	// 假设用户写的时候必须写render
	name: "App",
	render() {
		window.self = this;

		// ui
		return h(
			"div",
			{
				id: "root",
				class: ["red", "hard"],
				onClick() {
					console.log("click");
				},
				onMouseDown() {
					console.log("mouse down");
				},
			},
			//setupState
			// this.$el -> get root element
			// "hi, " + this.msg
			[h("div", {}, "hi" + this.msg), h(Foo, { count: 10 })]
		);
		// return h("div", { id: "root", class: ["red", "hard"] }, "hi, mini-vue");
		// return h("div", { id: "root", class: ["red", "hard"] }, [
		// 	h("p", { class: "red" }, "hi"),
		// 	h("p", { class: "blue" }, "mini-vue"),
		// ]);
	},
	setup() {
		// composition api 文档
		return {
			msg: "mini-vue",
		};
	},
};
