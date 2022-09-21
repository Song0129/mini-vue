import { creatRenderer } from "@mini-vue/runtime-core";

// 创建节点
function createElement(type) {
	// console.log("createElement----------");
	return document.createElement(type);
}

// 设置属性
function patchProp(el, key, prevVal, nextVal) {
	// console.log("patchProp----------");
	const isOn = (key: string) => /^on[A-Z]/.test(key);
	if (isOn(key)) {
		const event = key.slice(2).toLowerCase();
		el.addEventListener(event, nextVal);
	} else {
		if (nextVal === null || nextVal === undefined) {
			el.removeAttribute(key);
		} else {
			el.setAttribute(key, nextVal);
		}
	}
}

// 添加节点
function insert(child, parent, anchor) {
	// console.log("insert----------");
	// parent.append(child);
	parent.insertBefore(child, anchor || null);
}

// 删除节点
function remove(child) {
	const parent = child.parentNode;
	if (parent) {
		parent.removeChild(child);
	}
}

// 设置节点文本
function setElementText(el, text) {
	// console.log("setElementText----------");
	el.textContent = text;
}

const renderer: any = creatRenderer({
	createElement,
	patchProp,
	insert,
	remove,
	setElementText,
});

export function createApp(...args) {
	return renderer.createApp(...args);
}
export * from "@mini-vue/runtime-core";
