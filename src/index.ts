import { getEnv } from "./env";
import {
  ComponentDefinitionParam,
  ComponentStaticConfig,
  loadComp,
  loadCompByDef,
} from "./transform";
import path from "path";
import { RootComponentWrapper } from "./wrapper";
import { extractDomain, formatDomain, guid } from "./utils";

const tagNameMapping: Record<string, string> = {};

type LoadOptions = {
  rootPath?: string;
  usingComponents?: Record<string, string>;
  componentGenerics?: Record<string, true | { default?: string }>;
  componentPlaceholder?: Record<string, string>;
};

export function loadComponent(componentPath: string): string;
export function loadComponent(
  componentPath: string,
  options: LoadOptions
): string;
export function loadComponent(
  componentPath: string,
  tagName: string,
  options?: LoadOptions
): string;
export function loadComponent(
  componentPath: string,
  tagName?: string | LoadOptions,
  options?: LoadOptions
): string {
  if (typeof componentPath !== "string") {
    throw new Error("Loading a definition object is not supported.");
  }
  const realTagName = typeof tagName === "string" ? tagName : "main";
  const realOptions =
    (tagName && typeof tagName !== "string" ? tagName : options) || {};
  const { rootPath, ...overrideStaticConfig } = realOptions;
  const finalRootPath = rootPath || path.dirname(componentPath);
  const componentName = path.relative(finalRootPath, componentPath);
  if (componentName[0] === ".")
    throw new Error(
      `path ${componentPath} is not in root path ${finalRootPath}`
    );
  const compName = loadComp(
    componentName,
    realTagName,
    finalRootPath,
    overrideStaticConfig
  );
  tagNameMapping[compName] = realTagName;
  return formatDomain(finalRootPath, componentName);
}

export function loadComponentByDef(
  staticConfig: ComponentStaticConfig,
  template: string,
  definition: ComponentDefinitionParam,
  tagName: string = "",
  rootPath: string = path.resolve()
): string {
  const compName = loadCompByDef(
    guid(),
    tagName,
    rootPath,
    staticConfig,
    template,
    definition
  );
  tagNameMapping[compName] = tagName;
  return formatDomain(rootPath, compName);
}

export function render(componentId: string, properties?: Record<string, any>) {
  const { domain: rootPath, componentName } = extractDomain(componentId);
  const { associatedBackend, codeSpace } = getEnv(rootPath);
  const root = associatedBackend.createRoot(
    tagNameMapping[componentName] || "main",
    codeSpace,
    componentName
  );
  const comp = root.getComponent();
  if (properties) {
    comp.setData(properties);
  }
  return new RootComponentWrapper(comp);
}

export { trimHTML } from "./utils";
