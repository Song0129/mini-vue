import { h } from "../../lib/mini-vue.esm.js";

export const App = {
	// .vue
	// <template></template>
	// render
	// 假设用户写的时候必须写render
	render() {
		// ui
		return h("div", "hi, " + this.msg);
	},
	setup() {
		// composition api 文档
		return {
			msg: "mini-vue",
		};
	},
};
