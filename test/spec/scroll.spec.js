let simulate;

describe("scroll", () => {
  beforeAll(async () => {
    simulate = await import(
      "http://localhost:8080/@/dist/miniprogram_simulate.all.js"
    );
  });

  it("should run successfully", async () => {
    let scrollEvents = [];

    const id = simulate.loadComponentByDef(
      {},
      `
        <div id="container" style="relative; width: 100px; height: 100px; overflow: scroll;" bind:scroll="onScroll">
          <div id="child" style="position: relative; width: 1000px; height: 1000px;"></div>
        </div>
      `,
      {
        methods: {
          onScroll(e) {
          },
        },
      }
    );

    const comp = simulate.render(id);
    const container = comp.querySelector('#container')

    container.dom.addEventListener('scroll', (e) => {
      scrollEvents.push(e);
    })

    comp.attach(document.body);

    expect(container.dom.scrollTop).toBe(0);
    container.scrollTo(40);
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(container.dom.scrollTop).toBe(40);
    // expect(scrollEvents.length).not.toBe(0);

    scrollEvents = [];
    container.scrollTo(30);
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(container.dom.scrollTop).toBe(30);
    // expect(scrollEvents.length).not.toBe(0);

    scrollEvents = [];
    container.scrollTo(-100);
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(container.dom.scrollTop).toBe(0);
    // expect(scrollEvents.length).not.toBe(0);

    scrollEvents = [];
    container.scrollTo({ left: 10 });
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(container.dom.scrollTop).toBe(0);
    expect(container.dom.scrollLeft).toBe(10);
    // expect(scrollEvents.length).not.toBe(0);

    comp.detach()
  }, 5000);
});
