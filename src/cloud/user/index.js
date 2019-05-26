const TcbRouter = require('tcb-router');
const request = require('request');
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

exports.main = (event, context) => {
  const app = new TcbRouter({ event });
  app.use(async (ctx, next) => {
    ctx.data = {};
    await next();
  });

  // 用户登录数据库查询
  app.router('login', async (ctx, next) => {
    const { env } = context;
    ctx.data = await new Promise((resolve, reject) => {
      const { OPENID } = cloud.getWXContext();
      db.collection('user')
        .get(env)
        .then(e => {
          if (!e.data.length) db.collection('user').add({
            data: {
              _openId: OPENID
            }
          })
        });
      resolve({
        openId: OPENID
      });
      reject('fail');
    });
    ctx.body = {
      data: ctx.data
    };
  });

  return app.serve();
};
