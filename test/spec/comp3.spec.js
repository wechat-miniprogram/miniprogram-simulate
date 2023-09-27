let simulate;

describe("comp3", () => {
  beforeAll(async () => {
    simulate = await import(
      "http://localhost:8080/@/dist/miniprogram_simulate.all.js"
    );
  });

  it("should run successfully", () => {
    const id = simulate.loadComponent("/test/comp3/index");

    const comp = simulate.render(id);

    const parent = document.body;
    comp.attach(parent);

    const view = comp.querySelector(".index");
    expect(view.dom.innerHTML).toBe("index.properties");
    expect(
      window.getComputedStyle(comp.querySelector(".inner").dom).color
    ).toBe("rgb(255, 0, 0)");

    view.dispatchTapEvent();
    expect(view.dom.innerHTML).toBe("comp3.properties");

    expect(comp.instance.print()).toBe(123);

    comp.detach();
  });
});
