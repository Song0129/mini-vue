export const extend = Object.assign;

export const EMPTY_OBJ = {};

export const isObject = (val: any) => val !== null && typeof val === "object";

export const isString = value => typeof value === "string";

export const hasChanges = (val, newVlaue) => {
	return !Object.is(val, newVlaue);
};

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);

export const capitalize = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const camelize = (str: string) => {
	return str.replace(/-(\w)/g, (_, c: string) => {
		return c ? c.toUpperCase() : "";
	});
};

export const toHandlerKey = (str: string) => {
	return str ? "on" + capitalize(str) : "";
};
