import { mutableHandlers, readonlyHandlers } from "./baseHandler";

export const enum ReactiveFlags {
	IS_REACTIVE = "__v_is_reactive",
}

export function reactive(raw) {
	return createActiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
	return createActiveObject(raw, readonlyHandlers);
}

export function isReactive(value) {
	return !!value[ReactiveFlags.IS_REACTIVE];
}

function createActiveObject(raw: any, baseHandler) {
	return new Proxy(raw, baseHandler);
}
