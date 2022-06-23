import { NodeTypes } from "./ast";

export function baseParse(content: string) {
	const context = createParseContext(content);

	return createRoot(parseChildren(context));
}

function parseChildren(context) {
	const nodes: any[] = [];

	// 满足插值表达式  {{}}
	let node;
	if (context.source.startsWith("{{")) {
		node = parseInterPolation(context);
	}
	nodes.push(node);

	return nodes;
}

function parseInterPolation(context) {
	// {{message}}
	const openDelimiter = "{{";
	const clostDelimiter = "}}";
	const closeIndex = context.source.indexOf(clostDelimiter, openDelimiter.length);

	advanceBy(context, openDelimiter.length);

	const rawContentLength = closeIndex - openDelimiter.length;
	const rawContent = context.source.slice(0, rawContentLength);
	const content = rawContent.trim();

	advanceBy(context, rawContentLength + clostDelimiter.length);

	console.log(context.source);
	return {
		type: NodeTypes.INTERPOLATION,
		content: {
			type: NodeTypes.SIMPLE_INTERPOLATION,
			content: content,
		},
	};
}

function advanceBy(context: any, length: number) {
	context.source = context.source.slice(length);
}

function createRoot(children) {
	return {
		children,
	};
}

function createParseContext(content: string): any {
	return {
		source: content,
	};
}
