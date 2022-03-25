import { mutableHandlers, readonlyHandlers } from "./baseHandler";
import { track, trigger } from "./effect";

export function reactive(raw) {
	return createActiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
	return createActiveObject(raw, readonlyHandlers);
}
function createActiveObject(raw: any, baseHandler) {
	return new Proxy(raw, baseHandler);
}
