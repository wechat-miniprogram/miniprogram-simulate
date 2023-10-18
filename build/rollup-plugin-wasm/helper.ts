import type { TargetEnv } from './types';

export const HELPERS_ID = '\0wasmHelpers.js';

const nodeFilePath = `
var fs = require("fs")
var path = require("path")

await return new Promise((resolve, reject) => {
  fs.readFile(path.resolve(__dirname, filepath), (error, buffer) => {
    if (error != null) {
      reject(error);
    } else {
      source = buffer;
      stream = false;
    }
  });
});
`;

const browserFilePath = `
var url;
if (document.currentScript) {
  url = new URL(filepath, (new URL(document.currentScript.src).pathname || location.pathname)).pathname;
} else {
  url = import.meta.resolve('./' + filepath);
}
source = fetch(url);
stream = true;
`;

const autoModule = `
var isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

if (isNode) {
  ${nodeFilePath}
} else {
  ${browserFilePath}
}
`;

const nodeModule = nodeFilePath

const browserModule = browserFilePath

const envModule = (env: TargetEnv) => {
  switch (env) {
    case 'auto':
      return autoModule;
    case 'browser':
      return browserModule;
    case 'node':
      return nodeModule;
    default:
      return null;
  }
};

export const getHelpersModule = (env: TargetEnv) => `
export async function _loadWasmModule (filepath, imports) {
  var source = null;
  var stream = false;

  ${envModule(env)}

  var instantiateFunc = stream ? WebAssembly.instantiateStreaming : WebAssembly.instantiate;
  var compileFunc = stream ? WebAssembly.compileStreaming : WebAssembly.compile;

  return instantiateFunc(source, imports);
}
`;