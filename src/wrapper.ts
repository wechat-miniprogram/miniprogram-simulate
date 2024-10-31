import { glassEasel, component } from "glass-easel-miniprogram-adapter";
import { getInnerHTML, getOuterHTML, isNodeJs } from "./utils";
import { ComponentCaller } from "glass-easel-miniprogram-adapter/dist/types/src/component";

const Touch =
  globalThis.Touch ||
  class Touch {
    constructor(init: TouchInit) {
      Object.assign(this, init);
    }
  };

const TouchEvent =
  globalThis.TouchEvent ||
  class TouchEvent extends Event {
    constructor(type: string, init: TouchEventInit) {
      super(type, init);
      Object.assign(this, {
        touches: init.touches,
        changedTouches: init.changedTouches,
      });
    }
  };

export class ElementWrapper {
  constructor(protected _node: glassEasel.Element) {}

  get dom(): Node | null {
    return this._node.$$ as any as Node | null;
  }

  get innerHTML(): string {
    return getInnerHTML(this._node);
  }

  get outerHTML(): string {
    return getOuterHTML(this._node);
  }

  dispatchTapEvent() {
    const target = this.dom as Element;
    const touch = new Touch({
      identifier: 0,
      clientX: -1,
      clientY: -1,
      pageX: -1,
      pageY: -1,
      screenX: -1,
      screenY: -1,
      force: 1,
      radiusX: 1,
      radiusY: 1,
      rotationAngle: 0,
      target: target,
    });
    const touchstart = new TouchEvent("touchstart", {
      touches: [touch],
      changedTouches: [touch],
      bubbles: true,
      composed: true,
    });
    target.dispatchEvent(touchstart);
    const touchend = new TouchEvent("touchend", {
      touches: [],
      changedTouches: [touch],
      bubbles: true,
      composed: true,
    });
    target.dispatchEvent(touchend);
  }

  dispatchEvent(type: string, options?: EventInit) {
    (this.dom as Element)?.dispatchEvent(new Event(type, options));
  }

  scrollTo(options: ScrollToOptions): void;
  scrollTo(top: number, left: number): void;
  scrollTo(top: number | ScrollToOptions, left?: number): void {
    const options: ScrollToOptions =
      typeof top === "object" ? top : { top, left };
    const dom = this.dom;
    if (!dom) throw new Error("Cannot scroll on a virtual node.");
    if (!(dom instanceof Element)) throw new Error("Not an element.");

    if (isNodeJs) {
      setTimeout(() => {
        if (options.top !== undefined) dom.scrollTop = options.top;
        if (options.left !== undefined) dom.scrollLeft = options.left;
        dom.dispatchEvent(
          new Event("scroll", { bubbles: true, cancelable: false })
        );
      }, 0);
    } else {
      dom.scrollTo(options);
    }
  }

  addEventListener(
    eventName: string,
    handler: glassEasel.EventListener<unknown>,
    options?: glassEasel.EventListenerOptions | boolean
  ) {
    this._node.addListener(
      eventName,
      handler,
      typeof options === "boolean" ? { capture: options } : options
    );
  }

  removeEventListener(
    eventName: string,
    handler: glassEasel.EventListener<unknown>,
    options?: glassEasel.EventListenerOptions | boolean
  ) {
    this._node.removeListener(
      eventName,
      handler,
      typeof options === "boolean" ? { capture: options } : options
    );
  }

  toJSON() {
    return glassEasel.dumpElementToString(this._node, true);
  }
}

export class ComponentWrapper extends ElementWrapper {
  constructor(protected _node: glassEasel.GeneralComponent) {
    super(_node);
  }

  get data() {
    return this._node.getMethodCaller().data;
  }

  get instance(): component.ComponentCaller<any, any, any, never> {
    return this._node.getMethodCaller() as any;
  }

  querySelector(selector: string): ElementWrapper | null {
    const elem = this._node.getShadowRoot()!.querySelector(selector);
    if (elem instanceof glassEasel.Component) {
      return new ComponentWrapper(elem);
    }
    return elem ? new ElementWrapper(elem) : null;
  }

  querySelectorAll(selector: string) {
    return this._node
      .getShadowRoot()!
      .querySelectorAll(selector)
      .map((elem) => {
        if (elem instanceof glassEasel.Component) {
          return new ComponentWrapper(elem);
        }
        return elem ? new ElementWrapper(elem) : null;
      });
  }

  setData(data: Record<string, unknown>, callback?: () => void) {
    this.instance.setData(data);
    if (callback) {
      setTimeout(() => {
        callback();
      }, 0);
    }
  }

  triggerLifeTime(lifeTime: string, ...args: any[]) {
    this._node.triggerLifetime(lifeTime, args);
  }

  triggerPageLifeTime(lifeTime: string, ...args: any[]) {
    this._node.triggerPageLifetime(lifeTime, args);
  }
}

export class RootComponentWrapper extends ComponentWrapper {
  private parent: HTMLElement | null = null;

  attach(parent: HTMLElement) {
    const frag = document.createDocumentFragment();
    if (this._node.isVirtual()) {
      this._node.forEachNonVirtualComposedChild((node) => {
        frag.appendChild(node.$$ as any as Node);
      });
    } else {
      frag.appendChild(this.dom!);
    }
    parent.appendChild(frag);
    this.parent = parent;
    glassEasel.Element.pretendAttached(this._node);
    this._node.triggerLifetime("ready", []);
  }

  detach() {
    if (!this.parent) return;

    if (this._node.isVirtual()) {
      this._node.forEachNonVirtualComposedChild((node) => {
        this.parent!.removeChild(node.$$ as any as Node);
      });
    } else {
      this.parent.removeChild(this.dom!);
    }
    this.parent = null;

    glassEasel.Element.pretendDetached(this._node);
  }

  override toJSON() {
    return glassEasel.dumpElementToString(this._node.shadowRoot, true);
  }
}
