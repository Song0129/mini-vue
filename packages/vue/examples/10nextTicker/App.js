import { h, ref, getCurrentInstance, nextTick } from "../../dist/mini-vue.esm.js";

export default {
	name: "App",
	setup() {
		const count = ref(1);
		const instance = getCurrentInstance();

		const onClick = () => {
			for (let i = 0; i < 100; i++) {
				count.value = i;
			}

			console.log(instance);
			nextTick(() => {
				console.log(instance);
			});

			// await nextTick()
			// console.log(instance);
		};

		return { onClick, count };
	},

	render() {
		const button = h("button", { onClick: this.onClick }, "update");
		const p = h("p", {}, "count:" + this.count);
		return h("div", {}, [button, p]);
	},
};
