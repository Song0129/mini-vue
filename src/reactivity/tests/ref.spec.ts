import { effect } from "../effect";

describe("ref", () => {
	it("happy path", () => {
		const a = ref(1);
		expect(a.value).toBe(1);
	});
});
