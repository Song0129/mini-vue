import { computed } from "../computed";
import { reactive } from "../reactive";

describe("computed", () => {

  it("happy path", () => {
    // ref 
    // .value
    // 1.缓存
    const user = reactive({age:1});

    const age = computed(() => user.age);
    
    expect(age.value).toBe(1);
  })
})