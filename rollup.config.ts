import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { ModuleFormat, RollupOptions } from "rollup";
import dts from "rollup-plugin-dts";
import { wasm } from "./build/rollup-plugin-wasm";

const dtsCompilation: RollupOptions = {
  input: "./src/index.ts",
  output: { file: `dist/miniprogram_simulate.d.ts`, format: "es" },
  plugins: [
    nodeResolve({
      extensions: [".ts", "js"],
    }),
    dts(),
  ],
};

const browserCompilation: RollupOptions = {
  input: "./src/index.ts",
  output: {
    file: `dist/miniprogram_simulate.all.js`,
    format: "esm",
  },
  plugins: [
    commonjs(),
    nodeResolve({
      browser: true,
      extensions: [".ts", ".js"],
    }),
    typescript(),
    nodePolyfills(),
    wasm({
      targetEnv: "browser",
    }),
    // minimize
    //   ? terser({
    //       sourceMap: sourcemap,
    //     })
    //   : null,
  ],
};

const esmCompilation: RollupOptions = {
  input: "./src/index.ts",
  output: {
    file: `dist/miniprogram_simulate.esm.js`,
    format: "esm",
  },
  external: /\/node_modules\//,
  preserveSymlinks: true,
  plugins: [
    nodeResolve({
      browser: true,
      extensions: [".ts", ".js"],
    }),
    typescript(),
    // minimize
    //   ? terser({
    //       sourceMap: sourcemap,
    //     })
    //   : null,
  ],
}

const cjsCompilation: RollupOptions = {
  input: "./src/index.ts",
  output: {
    file: `dist/miniprogram_simulate.cjs.js`,
    format: "cjs",
  },
  external: /\/node_modules\//,
  preserveSymlinks: true,
  plugins: [
    nodeResolve({
      browser: true,
      extensions: [".ts", ".js"],
    }),
    typescript(),
    // minimize
    //   ? terser({
    //       sourceMap: sourcemap,
    //     })
    //   : null,
  ],
}

const serveCompilation: RollupOptions = {
  input: "./src/serve.ts",
  output: {
    file: `dist/serve.js`,
    format: "commonjs",
  },
  external: /\/node_modules\//,
  plugins: [
    nodeResolve({
      browser: true,
      extensions: [".ts", ".js"],
    }),
    typescript(),
    // minimize
    //   ? terser({
    //       sourceMap: sourcemap,
    //     })
    //   : null,
  ],
}

export default [
  dtsCompilation,
  browserCompilation,
  esmCompilation,
  cjsCompilation,
  serveCompilation,
];
