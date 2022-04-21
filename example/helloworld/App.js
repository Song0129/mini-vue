export const App = {
	// .vue
	// <template></template>
	// render
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
