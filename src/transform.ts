import { getEnv } from "./env";
import * as templateCompiler from "glass-easel-template-compiler";
import postcss from "postcss";
import path from "path";
import type { CodeSpace, ComponentConstructor } from "glass-easel-miniprogram-adapter";
import { extractDomain } from "./utils";
import { readFileSync, requireScript } from "./fs";

export type ComponentStaticConfig = Parameters<
  CodeSpace["addComponentStaticConfig"]
>[1];

export type ComponentDefinitionParam = Parameters<ComponentConstructor>[0]

export function loadCompByDef(
  componentName: string,
  tagName: string,
  rootPath: string,
  staticConfig: ComponentStaticConfig,
  template: string,
  definition: ComponentDefinitionParam,
): string {
  const { codeSpace, backend } = getEnv(rootPath);
  const componentPath = path.join(rootPath, componentName);

  if (codeSpace.getComponentStaticConfig(componentName)) return componentName;

  codeSpace.addComponentStaticConfig(componentName, staticConfig);
  const genObjectGroupList = new Function(
    "return " + generateTmplGroupByWxml(template, componentName, rootPath).getTmplGenObjectGroups()
  )() as { [key: string]: any };
  codeSpace.addCompiledTemplate(componentName, {
    groupList: genObjectGroupList,
    content: genObjectGroupList[componentName],
  });
  const stylePrefix = tagName;
  backend.registerStyleSheetContent(componentPath, "");
  codeSpace.addStyleSheet(componentName, componentPath, stylePrefix);
  codeSpace.componentEnv(componentName, ({ Component }) => {
    Component(definition)
  })

  if (staticConfig.usingComponents) {
    Object.entries(staticConfig.usingComponents).forEach(
      ([tagName, usingPath]) => {
        const { domain, componentName } = extractDomain(usingPath);
        const resolvedCompName = path.isAbsolute(componentName)
          ? componentName.slice(1)
          : path.relative(
              rootPath,
              path.resolve(path.dirname(componentPath), componentName)
            );
        loadComp(resolvedCompName, tagName, domain || rootPath);
      }
    );
  }

  return componentName
}

export function loadComp(
  componentName: string,
  tagName: string,
  rootPath: string,
  overrideStaticConfig: ComponentStaticConfig = {}
): string {
  const { codeSpace, backend } = getEnv(rootPath);
  const componentPath = path.join(rootPath, componentName);

  if (codeSpace.getComponentStaticConfig(componentName)) return componentName;

  let staticConfig: ComponentStaticConfig;
  try {
    staticConfig = requireScript(`${componentPath}.json`) || {};
  } catch (e) {
    staticConfig = {};
  }

  const finalStaticConfig = { ...staticConfig, ...overrideStaticConfig };

  codeSpace.addComponentStaticConfig(componentName, finalStaticConfig);
  const genObjectGroupList = new Function(
    "return " + loadWxml(componentName, rootPath).getTmplGenObjectGroups()
  )() as { [key: string]: any };
  codeSpace.addCompiledTemplate(componentName, {
    groupList: genObjectGroupList,
    content: genObjectGroupList[componentName],
  });
  const stylePrefix = tagName;
  try {
    const rawStyleSheet = loadWxss(componentName, rootPath);
    const styleSheetContent = postcss([
      addClassPrefixPlugin(stylePrefix),
    ]).process(rawStyleSheet, {
      from: undefined,
      map: undefined,
    }).css;
    backend.registerStyleSheetContent(componentPath, styleSheetContent);
  } catch (e) {
    backend.registerStyleSheetContent(componentPath, "");
    throw e;
  }
  codeSpace.addStyleSheet(componentName, componentPath, stylePrefix);
  codeSpace.globalComponentEnv(globalThis, componentName, () => {
    requireScript(`${componentPath}.js`);
  });

  if (finalStaticConfig.usingComponents) {
    Object.entries(finalStaticConfig.usingComponents).forEach(
      ([tagName, usingPath]) => {
        const { domain, componentName } = extractDomain(usingPath);
        const resolvedCompName = path.isAbsolute(componentName)
          ? componentName.slice(1)
          : path.relative(
              rootPath,
              path.resolve(path.dirname(componentPath), componentName)
            );
        loadComp(resolvedCompName, tagName, domain || rootPath);
      }
    );
  }

  return componentName;
}

function generateTmplGroupByWxml(
  wxml: string,
  componentName: string,
  rootPath: string
): templateCompiler.TmplGroup {
  const componentPath = path.join(rootPath, componentName);
  const group = new templateCompiler.TmplGroup();

  group.addTmpl(componentName, wxml);

  group
    .getScriptDependencies(componentName)
    .forEach((dep) =>
      group.addScript(
        dep,
        loadWxs(
          path.isAbsolute(dep)
            ? dep.slice(1)
            : path.relative(
                rootPath,
                path.resolve(path.dirname(componentPath), dep)
              ),
          rootPath
        )
      )
    );
  group
    .getDirectDependencies(componentName)
    .forEach((dep) =>
      group.importGroup(
        loadWxml(
          path.isAbsolute(dep)
            ? dep.slice(1)
            : path.relative(
                rootPath,
                path.resolve(path.dirname(componentPath), dep)
              ),
          rootPath
        )
      )
    );

  return group;
}

const loadWxmlCache: Record<string, templateCompiler.TmplGroup> = {};

export function loadWxml(
  componentName: string,
  rootPath: string
): templateCompiler.TmplGroup {
  const componentPath = path.join(rootPath, componentName);
  if (loadWxmlCache[componentPath]) return loadWxmlCache[componentPath];
  const content = readFileSync(`${componentPath}.wxml`);
  const group = generateTmplGroupByWxml(content, componentName, rootPath)

  loadWxmlCache[componentName] = group;
  return group;
}

const loadWxsCache: Record<string, string> = {};

export function loadWxs(componentName: string, rootPath: string): string {
  const componentPath = path.join(rootPath, componentName);
  if (loadWxsCache[componentPath]) return loadWxsCache[componentPath];

  const result = readFileSync(`${componentPath}.wxs`);

  loadWxsCache[componentPath] = result;

  return result;
}

const addClassPrefixPlugin = (prefix = "") =>
  postcss.plugin("addClassPrefix", () => (root) => {
    root.walk((child) => {
      if (child.type === "rule") {
        const selectors: string[] = [];

        child.selectors.forEach((selector) => {
          // 处理 class 选择器
          selectors.push(
            selector.replace(/(.)?\.([-_a-zA-Z0-9]+)/gis, (all, $1, $2) =>
              /\d/.test($1) ? all : `${$1 || ""}.${prefix}--${$2}`
            )
          );
        });

        child.selectors = selectors;
      }
    });
  });

function forEachImport(
  wxss: string,
  callback: (url: string) => string
): string {
  const reg = /@import\s+(?:(?:"([^"]+)")|(?:'([^']+)'));/gi;
  let result = "";
  let index = 0;
  let execRes = reg.exec(wxss);

  while (execRes && (execRes[1] || execRes[2])) {
    const transformed = callback(execRes[1] || execRes[2]);
    result += wxss.slice(index, execRes.index) + transformed;
    index = execRes.index + execRes[0].length;
    execRes = reg.exec(wxss);
  }

  result += wxss.slice(index);

  return result;
}

function transformRpx(style: string) {
  return style.replace(
    /(\d+)rpx/gi,
    (_, $1) => `${(Number($1) * 100) / 750}vw`
  );
}

const loadWxssCache: Record<string, string> = {};

export function loadWxss(componentName: string, rootPath: string): string {
  const componentPath = path.join(rootPath, componentName);
  if (loadWxssCache[componentPath]) return loadWxssCache[componentPath];

  const content = readFileSync(`${componentPath}.wxss`);

  const result = transformRpx(
    forEachImport(content, (url) => {
      const resolved = path.isAbsolute(url)
        ? url.slice(1)
        : path.relative(
            rootPath,
            path.resolve(path.dirname(componentPath), url)
          );
      return loadWxss(resolved, rootPath);
    })
  );

  loadWxssCache[componentPath] = result;
  return result;
}
