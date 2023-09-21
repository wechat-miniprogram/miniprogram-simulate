import * as adapter from "glass-easel-miniprogram-adapter";

const glassEasel = adapter.glassEasel;
const env = new adapter.MiniProgramEnv();
const backend = new glassEasel.domlikeBackend.CurrentWindowBackendContext();
backend.onEvent((target, type, detail, options) => {
  glassEasel.Event.triggerEvent(target, type, detail, options)
});
const associatedBackend = env.associateBackend(backend);
backend.registerStyleSheetContent('', '');

export function getEnv(rootPath: string) {
  if (!env.getCodeSpace(rootPath)) {
    env.createCodeSpace(rootPath, false)
  }
  return {
    glassEasel,
    env,
    backend,
    associatedBackend,
    codeSpace: env.getCodeSpace(rootPath)!
  }
}
