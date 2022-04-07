export const extend = Object.assign;

export const isObject = (val: any) => val !== null && typeof val === "object";

export const hasChanges = (val, newVlaue) => {
	return !Object.is(val, newVlaue);
};
