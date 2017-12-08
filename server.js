const fs = require('fs');
const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');

app.use(serve(`${__dirname}/docs`, {
  gzip: true,
}));

app.use(serve(`${__dirname}/static`, {
  gzip: true,
  setHeaders: (res, path) => {
    if (path.indexOf('apple-app-site-association') > -1) {
      res.setHeader('Content-Type', 'application/json');
    }
  }
}));

app.use(async function pageNotFound(ctx) {
  if (ctx.status !== 404) return;

  ctx.status = 404;

  switch (ctx.accepts('html', 'json')) {
    case 'html':
      ctx.type = 'html';
      ctx.body = 'Page Not Found';
      break;
    case 'json':
      ctx.body = { message: 'Page Not Found' };
      break;
    default:
      ctx.type = 'text';
      ctx.body = 'Page Not Found';
  }
});

app.listen(process.env.PORT || 3000);
