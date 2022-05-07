const publicPropertiesMap = {
	$el: i => i.vnode.el,
};

export const PublicInstanceProxyHandlers = {
	get({ _: instance }, key) {
		// setupState
		const { setupState } = instance;
		if (key in setupState) {
			return setupState[key];
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