import { NodeTypes } from "../src/ast";
import { baseParse } from "../src/parse";
import { describe, it, expect, test } from "vitest";

describe("Parse", () => {
	describe("interpolation", () => {
		test("simple interpolation", () => {
			const ast = baseParse("{{ message }}");

			// root
			expect(ast.children[0]).toStrictEqual({
				type: NodeTypes.INTERPOLATION,
				content: {
					type: NodeTypes.SIMPLE_EXPRESSION,
					content: "message",
				},
			});
		});
	});

	describe("element", () => {
		it("simple element div", () => {
			const ast = baseParse("<div></div>");
			// console.log(ast);

			expect(ast.children[0]).toStrictEqual({
				type: NodeTypes.ELEMENT,
				tag: "div",
				children: [],
			});
		});
	});

	describe("text", () => {
		it("simple text", () => {
			const ast = baseParse("some text");
			console.log(ast);

			expect(ast.children[0]).toStrictEqual({
				type: NodeTypes.TEXT,
				content: "some text",
			});
		});
	});

	test("hello world", () => {
		const ast = baseParse("<div>hi,{{message}}</div>");
		// console.log(ast);

		expect(ast.children[0]).toStrictEqual({
			type: NodeTypes.ELEMENT,
			tag: "div",
			children: [
				{
					type: NodeTypes.TEXT,
					content: "hi,",
				},
				{
					type: NodeTypes.INTERPOLATION,
					content: {
						type: NodeTypes.SIMPLE_EXPRESSION,
						content: "message",
					},
				},
			],
		});
	});

	test("Nested element", () => {
		const ast = baseParse("<div><p>hi,</p>{{message}}</div>");
		// console.log(ast);

		expect(ast.children[0]).toStrictEqual({
			type: NodeTypes.ELEMENT,
			tag: "div",
			children: [
				{
					type: NodeTypes.ELEMENT,
					tag: "p",
					children: [
						{
							type: NodeTypes.TEXT,
							content: "hi,",
						},
					],
				},
				{
					type: NodeTypes.INTERPOLATION,
					content: {
						type: NodeTypes.SIMPLE_EXPRESSION,
						content: "message",
					},
				},
			],
		});
	});

	test("should throw error when lack end tag", () => {
		// baseParse("<div><span></div>");
		expect(() => {
			baseParse("<div><span></div>");
		}).toThrow("缺少结束标签:span");
	});
});
