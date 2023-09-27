import * as fs from "fs";
import * as path from "path";
import { createHash } from "crypto";
import * as t from "@webassemblyjs/ast";
import * as WasmParser from "@webassemblyjs/wasm-parser";

import type { Plugin } from "rollup";

import type { RollupWasmOptions } from "./types";

import { getHelpersModule, HELPERS_ID } from "./helper";

export function wasm(options: RollupWasmOptions = {}): Plugin {
  const {
    publicPath = "",
    targetEnv = "auto",
    fileName = "[hash][extname]",
  } = options;

  const copies = Object.create(null) as Record<
    string,
    { filename: string; publicFilepath: string; buffer: Buffer }
  >;

  return {
    name: "wasm",

    resolveId(id) {
      if (id === HELPERS_ID) {
        return id;
      }

      return null;
    },

    async load(id) {
      if (id === HELPERS_ID) {
        return getHelpersModule(targetEnv);
      }

      if (!/\.wasm$/.test(id)) {
        return null;
      }

      const buffer = await fs.promises.readFile(id);

      const hash = createHash("sha1")
        .update(buffer)
        .digest("hex")
        .substr(0, 16);
      const ext = path.extname(id);
      const name = path.basename(id, ext);

      const outputFileName = fileName
        .replace(/\[hash\]/g, hash)
        .replace(/\[extname\]/g, ext)
        .replace(/\[name\]/g, name);

      const publicFilepath = `${publicPath}${outputFileName}`;

      copies[id] = {
        filename: outputFileName,
        publicFilepath,
        buffer,
      };

      return buffer.toString("binary");
    },

    transform(code, id) {
      if (code && /\.wasm$/.test(id)) {
        if (!copies[id])
          throw new Error(`Transforming unloaded wasm file ${id}`);

        const publicFilepath = copies[id].publicFilepath;

        const program = WasmParser.decode(Buffer.from(code, "binary"), {
          ignoreCodeSection: true,
          ignoreDataSection: true,

          // this will avoid having to lookup with identifiers in the ModuleContext
          ignoreCustomNameSection: true,
        });
        const module = program.body[0];

        const imports: Record<string, string[]> = Object.create(null);
        const exports: string[] = [];

        t.traverse(module, {
          ModuleExport({ node }) {
            exports.push(node.name);
          },
          ModuleImport({ node }) {
            if (!imports[node.module]) imports[node.module] = [];
            imports[node.module].push(node.name);
          },
        });

        return {
          map: {
            mappings: "",
          },
          code: `import { _loadWasmModule } from ${JSON.stringify(HELPERS_ID)};
${Object.keys(imports)
  .map(
    (module, index) =>
      `import * as module_${index} from ${JSON.stringify(module)};`
  )
  .join("\n")}

const wasm = await _loadWasmModule(
  ${JSON.stringify(publicFilepath)},
  {
    ${Object.entries(imports)
      .map(
        ([module, names], index) => `${JSON.stringify(module)}: {
  ${names
    .map(
      (name) =>
        `${JSON.stringify(name)}: module_${index}[${JSON.stringify(name)}]`
    )
    .join(",")}
  }`
      )
      .join(",")}
});
const exports = wasm.instance.exports;

${exports.map((name) => `const export_${name} = exports.${name};`).join("\n")}

export {${exports.map((name) => `export_${name} as ${name}`).join(",\n")}};`,
        };
      }
      return null;
    },
    generateBundle: async function write() {
      await Promise.all(
        Object.keys(copies).map(async (name) => {
          const copy = copies[name];

          this.emitFile({
            type: "asset",
            source: copy.buffer,
            name: "Rollup WASM Asset",
            fileName: copy.filename,
          });
        })
      );
    },
  };
}

export default wasm;
