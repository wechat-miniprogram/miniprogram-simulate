let simulate;

describe("comp11", () => {
  beforeAll(async () => {
    simulate = await import(
      "http://localhost:8080/@/dist/miniprogram_simulate.all.js"
    );
  });

  it("should run successfully", async () => {
    const comp2Id = simulate.loadComponent("/test/comp11/comp/comp2", "comp2", { rootPath: '/test/comp11' });
    const id = simulate.loadComponent("/test/comp11/index", "custom-comp", {
      usingComponents: {
        comp1: "./comp/comp1",
        comp2: comp2Id,
      },
    });
    const comp = simulate.render(id, { prop: "index.test.properties" });

    comp.attach(document.body);

    expect(comp.innerHTML).toBe(
      simulate.trimHTML(`
      <view>root</view>
      <comp1 class="custom-comp--comp1">
          <view class="comp1--index">from root</view>
          <comp2 class="comp1--comp2">
              <view class="comp2--index">from comp1</view>
          </comp2>
      </comp1>
  `)
    );
    expect(comp.querySelector(".comp1").instance.getStr).toBeInstanceOf(
      Function
    );
    expect(comp.querySelector(".comp1").instance.getStr()).toBe("comp1");
    expect(
      comp.querySelector(".comp1").querySelector(".comp2").instance.getStr
    ).toBeInstanceOf(Function);
    expect(
      comp.querySelector(".comp1").querySelector(".comp2").instance.getStr()
    ).toBe("comp2");
    expect(comp.dom.tagName).toBe("CUSTOM-COMP");

    comp.detach();
  });
});
