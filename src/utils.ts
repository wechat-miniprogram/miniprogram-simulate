import { ElementWrapper } from "./wrapper";

export const guid = (): string =>
  Math.floor((1 + Math.random()) * 0x100000000)
    .toString(16)
    .slice(1);

export function formatDomain(domain: string, componentName: string): string {
  return `${domain}://${componentName}`;
}

export function extractDomain(id: string): {
  domain: string;
  componentName: string;
} {
  const index = id.indexOf("://");
  if (index === -1) return { domain: "", componentName: id };
  const domain = id.slice(0, index);
  const componentName = id.slice(index + 3);
  return { domain, componentName };
}

export function getOuterHTML(node: Node): string {
  if (node instanceof Element) {
    return node.outerHTML;
  }
  return getInnerHTML(node);
}

export function getInnerHTML(node: Node): string {
  if (node instanceof Element) {
    return node.innerHTML;
  } else if (node instanceof DocumentFragment) {
    return Array.from(node.childNodes)
      .map((child) => getOuterHTML(child))
      .join("");
  } else if (node instanceof Text) {
    return node.textContent || "";
  }
  return "";
}

export function match(dom: Node, html: string) {
  if (
    !(
      dom instanceof window.Element || dom instanceof window.DocumentFragment
    ) ||
    !html ||
    typeof html !== "string"
  )
    return false;

  const a = document.createElement("div");
  const b = document.createElement("div");

  a.innerHTML = getInnerHTML(dom);
  b.innerHTML = trimHTML(html);

  return a.isEqualNode(b);
}

export function trimHTML(html: string) {
  return html.trim().replace(/(>)[\n\r\s\t]+(<)/g, "$1$2");
}

export const sleep = (time = 0) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), time));

export const isNodeJs = typeof process !== "undefined";

export function scroll(
  elemWrapper: ElementWrapper,
  destOffset = 0,
  times = 20,
  propName: "scrollTop" | "scrollLeft" = "scrollTop"
) {
  if (typeof times !== "number" || times <= 0) times = 1;

  destOffset = destOffset < 0 ? 0 : destOffset;

  const dom = elemWrapper.dom;

  if (!(dom instanceof Element)) throw new Error("Not an element.");

  if (isNodeJs) {
    const delta = destOffset - dom[propName];
    const unit = ~~(delta / times);
    for (let i = 0; i < times; i++) {
      // nodejs 环境
      setTimeout(() => {
        if (i === times - 1) dom[propName] = destOffset;
        else dom[propName] += unit;

        // 模拟异步触发
        dom.dispatchEvent(
          new Event("scroll", { bubbles: true, cancelable: false })
        );
      }, 0);
    }
  } else {
    // 浏览器
    dom[propName] = destOffset;
  }
}
