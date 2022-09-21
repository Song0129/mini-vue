import { h } from "../../dist/mini-vue.esm.js";

export const Foo = {
	setup(props) {
		// props.count
		console.log(props);

		// 3.props只读
		// shallow readonly
	},
	render() {
		return h("div", {}, "foo:" + this.count);
	},
};
