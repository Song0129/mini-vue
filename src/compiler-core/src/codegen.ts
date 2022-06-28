export function generate(ast) {
	const context = creatCodegenContext();
	const { push } = context;

	push("return");
	const functionName = "render";
	const args = ["_ctx", "_cache"];
	const signature = args.join(", ");

	push(`function ${functionName}(${signature}){`);
	push("return");

	getNode(ast.codegenNode, context);
	push("}");

	return {
		code: context.code,
	};
}

function creatCodegenContext(): any {
	const context = {
		code: "",
		push(source) {
			context.code += source;
		},
	};
	return context;
}

function getNode(node: any, context) {
	const { push } = context;
	push(` '${node.content}'`);
}
