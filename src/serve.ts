import Koa from "koa";
import serve from "koa-static";
import send from "koa-send";
import path from "path";
import { createRequire } from "module";

const app = new Koa();

const cwd = process.cwd();

app.use((ctx, next) => {
  ctx.res.setHeader('Access-Control-Allow-Origin', '*')
  return next()
})

app.use(serve(cwd));

const getIndexPage = () => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MiniProgram Simulate</title>
  </head>
  <body>
    <script type="module">
      import * as simulate from '/@/dist/miniprogram_simulate.all.js';
      const componentPath = location.pathname;
      const id = simulate.load(componentPath);
      const comp = simulate.render(id);
      comp.attach(document.body);
    </script>
  </body>
</html>`;

app.use(async (ctx, next) => {
  if (ctx.method === "GET" && /^\/@\//.test(ctx.path)) {
    const res = await send(ctx, ctx.path.slice(3), {
      root: path.resolve(__dirname, ".."),
    });
    if (res) return;
  }

  await next();
});

app.use(async (ctx, next) => {
  console.log(ctx.querystring);
  if (ctx.method === "GET" && !ctx.querystring) {
    ctx.body = getIndexPage();
    ctx.res.setHeader("Content-Type", "text/html; charset=utf-8");
    return;
  }

  await next();
});

const requireFromCwd = createRequire(cwd + "/package.json");

app.use(async (ctx, next) => {
  if (ctx.method === "GET" && ctx.query.raw) {
    const resolvedPath = requireFromCwd.resolve("./" + ctx.path.slice(1));
    const res = await send(ctx, resolvedPath, { root: "/" });
    if (res) return;
  }
  await next();
});

// return 404
app.use(async (ctx) => {
  ctx.throw(404);
});

app.listen(8080);
