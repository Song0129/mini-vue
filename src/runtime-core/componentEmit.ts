export function emit(instance, event, ...args) {
	console.log("emit", event);

	// instance.props -> event
	const { props } = instance;

	// TPP
	// 先写一个特定的行为 -》 重构成通用的行为
	// add->Add
	// add-foo -> addFoo
	const capitalize = (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	const camelize = (str: string) => {
		return str.replace(/-(\w)/g, (_, c: string) => {
			return c ? c.toUpperCase() : "";
		});
	};

	const toHandlerKey = (str: string) => {
		return str ? "on" + capitalize(str) : "";
	};

	const handlerName = toHandlerKey(camelize(event));
	const handler = props[handlerName];
	handler && handler(...args);
}
