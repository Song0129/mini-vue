import { hasOwn } from "@mini-vue/shared";

const publicPropertiesMap = {
	$el: i => i.vnode.el,
	// $slots
	$slots: i => i.slots,
	$props: i => i.props,
};

export const PublicInstanceProxyHandlers = {
	get({ _: instance }, key) {
		// setupState
		const { setupState, props } = instance;
		if (key in setupState) {
			return setupState[key];
		}

		if (hasOwn(instance, key)) {
			return setupState[key];
		} else if (hasOwn(props, key)) {
			return props[key];
		}
		// key -> $el
		const publicGetter = publicPropertiesMap[key];
		if (publicGetter) {
			return publicGetter(instance);
		}

		// setup(v3) -> options data(v2)
		// $data
	},
};
