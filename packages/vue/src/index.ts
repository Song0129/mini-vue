// mini-vue 出口
export * from "@mini-vue/runtime-dom";

import { baseCompile } from "@mini-vue/compiler-core";
import * as runtimeDom from "@mini-vue/runtime-dom";
import { registerRuntimeCompiler } from "@mini-vue/runtime-dom";

function compileFunction(template) {
	const { code } = baseCompile(template);

	const render = new Function("Vue", code)(runtimeDom);

	return render;

	// function renderFunction(Vue) {
	// 	const { toDisplayString: _toDisplayString, openBlock: _openBlock, createElementBlock: _createElementBlock } = Vue;

	// 	return function render(_ctx, _cache, $props, $setup, $data, $options) {
	// 		return _openBlock(), _createElementBlock("div", null, "hi, " + _toDisplayString(_ctx.message), 1 /* TEXT */);
	// 	};
	// }
}

registerRuntimeCompiler(compileFunction);
