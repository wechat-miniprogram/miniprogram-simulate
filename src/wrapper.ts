import { glassEasel } from "glass-easel-miniprogram-adapter";
import { getInnerHTML, getOuterHTML } from "./utils";

export class ElementWrapper {
  constructor(protected _node: glassEasel.Element) {}

  get dom() {
    if (this._node.isVirtual()) {
      const frag = new DocumentFragment();
      this._node.forEachNonVirtualComposedChild((node) => {
        frag.appendChild(node.$$ as any as Node);
      });
      return frag;
    }
    return this._node.$$ as any as Node;
  }

  get innerHTML(): string {
    return getInnerHTML(this.dom);
  }

  get outerHTML(): string {
    return getOuterHTML(this.dom);
  }

  dispatchTapEvent() {
    const target = this.dom as Element;
    const touch = {
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
      target,
    };
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

  get instance() {
    return this._node.getMethodCaller();
  }

  querySelector(selector: string): ComponentWrapper | ElementWrapper | null {
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
      this._node._$nodeTreeContext.render(callback);
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
    parent.appendChild(this.dom);
    this.parent = parent;
    glassEasel.Element.pretendAttached(this._node);
    this._node.triggerLifetime("ready", []);
  }

  detach() {
    if (!this.parent) return;

    this.parent.removeChild(this.dom);
    this.parent = null;

    glassEasel.Element.pretendDetached(this._node);
  }

  override toJSON() {
    return glassEasel.dumpElementToString(this._node.shadowRoot, true);
  }
}
