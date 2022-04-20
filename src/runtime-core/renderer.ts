export function render(vnode, container) {
	// patch
	//
	patch(vnode, container);
}

function patch(vnode, container) {
	// 去处理组件
	processComponent(vnode, container);
}

function processComponent(vnode: any, container: any) {
	mountComponent(vnode);
}

function mountComponent(vnode: any) {}
