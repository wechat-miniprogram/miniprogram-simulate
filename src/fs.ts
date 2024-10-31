import path from "path";
import { isNodeJs } from "./utils";

export function readFileSync(filePath: string): string {
  if (isNodeJs) {
    const fs = require("fs");
    return fs.readFileSync(filePath, "utf8");
  }
  if (typeof XMLHttpRequest !== "undefined") {
    const request = new XMLHttpRequest();
    let url: string;
    if (document.currentScript) {
      url = new URL(
        filePath,
        new URL((document.currentScript as HTMLScriptElement).src).pathname ||
          location.pathname
      ).pathname;
    } else {
      url = import.meta.resolve(
        filePath[0] !== "/" && filePath[0] !== "." ? "./" + filePath : filePath
      );
    }
    request.open("GET", url + "?raw=1", false);
    request.send();

    if (request.status !== 200) throw new Error(`GOT ${request.statusText}`);
    return request.responseText;
  }
  throw new Error("Unknown environment");
}

const modules = Object.create(null) as Record<
  string,
  { exports: Record<string, unknown> }
>;

const createRequire =
  (scriptPath?: string) =>
  (requirePath: string): unknown => {
    const filePath = !scriptPath
      ? requirePath
      : path.resolve(path.dirname(scriptPath), requirePath);
    if (!modules[filePath]) {
      const rawContent = readFileSync(filePath);
      const content =
        path.extname(filePath) !== ".json"
          ? rawContent
          : `module.exports = (${rawContent})`;
      const module = (modules[filePath] = { exports: {} });
      const factory = new Function("require", "module", "exports", content);
      factory(createRequire(filePath), module, module.exports);
    }
    return modules[filePath].exports;
  };

export const requireScript = isNodeJs ? require : createRequire();
