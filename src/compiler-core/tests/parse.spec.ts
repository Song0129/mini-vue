import { NodeTypes } from "../src/ast";
import { baseParse } from "../src/parse";

describe("Parse", () => {
	describe("interpolation", () => {
		test("simple interpolation", () => {
			const ast = baseParse("{{ message }}");

			// root
			expect(ast.children[0]).toStrictEqual({
				type: NodeTypes.INTERPOLATION,
				content: {
					type: NodeTypes.SIMPLE_INTERPOLATION,
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
			});
		});
	});

	describe("text", () => {
		it("simple text", () => {
			const ast = baseParse("some text");
			// console.log(ast);

			expect(ast.children[0]).toStrictEqual({
				type: NodeTypes.TEXT,
				content: "some text",
			});
		});
	});
});
