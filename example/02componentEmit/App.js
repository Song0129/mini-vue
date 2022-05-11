import { h } from "../../lib/mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
	name: "App",
	render() {
		// emit
		return h("div", {}, [
			h("div", {}, "App"),
			// on + event
			h(Foo, {
				onAdd() {
					console.log("onAdd");
				},
			}),
		]);
	},
	setup() {
		return {};
	},
};
