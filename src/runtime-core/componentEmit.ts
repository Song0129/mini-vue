export function emit(instance, event) {
	console.log("emit", event);

	// instance.props -> event
	const { props } = instance;

	// TPP
	// 先写一个特定的行为 -》 重构成通用的行为
	// add->add
	const capitalize = (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	const toHandlerKey = (str: string) => {
		return str ? "on" + capitalize(str) : "";
	};

	const handlerName = toHandlerKey(event);
	const handler = props[handlerName];
	handler && handler();
}
