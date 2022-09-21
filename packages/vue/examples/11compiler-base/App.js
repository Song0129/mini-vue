import { ref } from "../../dist/mini-vue.esm.js";

// export const App = {
// 	name: "App",
// 	template: `<div>hi,{{message}}</div>`,
// 	setup() {
// 		return {
// 			message: "mini-vue",
// 		};
// 	},
// };

export const App = {
	name: "App",
	template: `<div>hi,{{count}}</div>`,
	setup() {
		const count = (window.count = ref(1));
		return {
			count,
		};
	},
};
