import { glassEasel } from "glass-easel-miniprogram-adapter";

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

export function getOuterHTML(node: glassEasel.Node): string {
  const domNode = node.$$ as any as Node
  if (domNode && domNode instanceof Element) {
    return domNode.outerHTML
  }
  return getInnerHTML(node)
}

export function getInnerHTML(node: glassEasel.Node): string {
  if (node instanceof glassEasel.Element && node.isVirtual()) {
    const html: string[] = []
    node.forEachNonVirtualComposedChild(node => { html.push(getOuterHTML(node)) })
    return html.join('')
  }
  const domNode = node.$$ as any as Node
  if (domNode instanceof Text) {
    return domNode.textContent || ''
  } else if (domNode instanceof Element) {
    return domNode.innerHTML
  }
  return ''
}

export function trimHTML(html: string) {
  return html.trim().replace(/(>)[\n\r\s\t]+(<)/g, "$1$2");
}

export const isNodeJs = typeof process !== "undefined";
