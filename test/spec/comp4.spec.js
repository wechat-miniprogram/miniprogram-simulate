let simulate;

describe("comp4", () => {
  beforeAll(async () => {
    simulate = await import(
      "http://localhost:8080/@/dist/miniprogram_simulate.all.js"
    );
  });

  it("should run successfully", async () => {
    const id = simulate.loadComponent("/test/comp4/index");

    const comp = simulate.render(id);

    comp.attach(document.body);

    expect(comp.dom.innerHTML).toBe(
      "<view>1</view><other-comp><view>component b</view></other-comp>"
    );

    const child = comp.querySelector("#a");
    child.instance.triggerSome(998);
    await new Promise(resolve => setTimeout(resolve, 10))

    expect(comp.dom.innerHTML).toBe(
      "<view>998</view><other-comp><view>component b</view></other-comp>"
    );

    comp.detach()
  });
});
