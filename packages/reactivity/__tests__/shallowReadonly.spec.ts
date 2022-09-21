import { isReadonly, shallowReadonly } from "../src/reactive";
import { vi } from "vitest";

describe("shallowReadonly", () => {
	test("should not make non-reactive properties reactive", () => {
		const porps = shallowReadonly({ n: { foo: 1 } });
		expect(isReadonly(porps)).toBe(true);
		expect(isReadonly(porps.n)).toBe(false);
	});

	it("should call console.warn then call set", () => {
		// console.warn()
		// mock
		console.warn = vi.fn();
		const user = shallowReadonly({
			age: 10,
		});
		user.age = 11;

		expect(console.warn).toBeCalled();
	});
});
