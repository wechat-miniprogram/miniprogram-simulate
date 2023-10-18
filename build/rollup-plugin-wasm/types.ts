/**
 * - `"auto"` will determine the environment at runtime and invoke the correct methods accordingly
 * - `"browser"` omits emitting code that requires node.js builtin modules that may play havoc on downstream bundlers
 * - `"node"` omits emitting code that requires `fetch`
 */
export type TargetEnv = 'auto' | 'browser' | 'node';

export interface RollupWasmOptions {
  /**
   * String used to rename the emitted Wasm files.
   */
  fileName?: string;
  /**
   * A string which will be added in front of filenames when they are not inlined but are copied.
   */
  publicPath?: string;
  /**
   * Configures what code is emitted to instantiate the Wasm (both inline and separate)
   */
  targetEnv?: TargetEnv;
}
