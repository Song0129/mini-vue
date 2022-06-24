import { NodeTypes } from "./ast";

const enum TagType {
	Start,
	End,
}

export function baseParse(content: string) {
	const context = createParseContext(content);

	return createRoot(parseChildren(context));
}

function parseChildren(context) {
	const nodes: any[] = [];

	// 满足插值表达式  {{}}
	let node;
	const s = context.source;

	if (s.startsWith("{{")) {
		node = parseInterPolation(context);
	} else if (s[0] === "<") {
		if (/[a-z]/i.test(s[1])) {
			node = parseElement(context);
		}
	}
	nodes.push(node);

	return nodes;
}

function parseElement(context) {
	// Implement

	const element = parseTag(context, TagType.Start);
	parseTag(context, TagType.End);

	return element;
}

function parseTag(context: any, type: TagType) {
	// 1. 解析tag
	const match: any = /^<\/?([a-z]*)/i.exec(context.source);

	const tag = match[1];
	// 2. 删除处理完成的代码
	advanceBy(context, match[0].length);
	advanceBy(context, 1);

	if (type === TagType.End) return;

	return { type: NodeTypes.ELEMENT, tag };
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
