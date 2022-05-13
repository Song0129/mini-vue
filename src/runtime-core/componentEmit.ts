export function emit(instance, event) {
	console.log("emit", event);

	// instance.props -> event
	const { props } = instance;
}
