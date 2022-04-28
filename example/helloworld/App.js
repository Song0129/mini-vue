import { h } from "../../lib/mini-vue.esm.js";

window.self = null;
export const App = {
	// .vue
	// <template></template>
	// render
	// 假设用户写的时候必须写render
	render() {
		window.self = this;

		// ui
		return h(
			"div",
			{ id: "root", class: ["red", "hard"] },
			//setupState
			// this.$el -> get root element
			"hi, " + this.msg
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
