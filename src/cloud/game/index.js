const TcbRouter = require('tcb-router');
const request = require('request');

exports.main = (event, context) => {
  const app = new TcbRouter({ event });
  app.use(async (ctx, next) => {
    ctx.data = {};
    await next();
  });

  // 游戏更新公告
  app.router('update', async (ctx, next) => {
    // 获取所有日志
    // const form = {
    //   count: 100,
    //   topicName: '阴阳师更新公告'
    // };
    // ctx.data = await new Promise((resolve, reject) => {
    //   request(
    //     {
    //       url:
    //         'https://god.gameyw.netease.com/v1/app/topic/getHandpickedFeeds/v2',
    //       method: 'POST',
    //       headers: {
    //         'content-type': 'application/json',
    //         'GL-ClientType': '50',
    //         'GL-Version': '0'
    //       },
    //       body: JSON.stringify(form)
    //     },
    //     (error, res, response) => {
    //       const data = JSON.parse(response);
    //       // console.log(data)
    //       const dataArr = data.result.feeds;
    //       resolve(dataArr);
    //       reject(error);
    //     }
    //   );
    // });
    ctx.data = await new Promise((resolve, reject) => {
      request(
        'https://mp-yys-1255362963.cos.ap-chengdu.myqcloud.com/gonggao_json/updateGame.json',
        (err, res, resData) => {
          resolve(JSON.parse(resData));
          err && reject(err);
        }
      );
    });
    ctx.body = {
      data: ctx.data
    };
  });

  // 游戏更新列表
  app.router('updateList', async (ctx, next) => {
    ctx.data = await new Promise((resolve, reject) => {
      request(
        'https://mp-yys-1255362963.cos.ap-chengdu.myqcloud.com/gonggao_json/updateList.json',
        (err, res, resData) => {
          resolve(JSON.parse(resData));
          err && reject(err);
        }
      )
    });
    ctx.body = {
      data: ctx.data
    };
  });

  // 获取更新详情
  app.router('updateDetail', async (ctx, next) => {
    const { time } = event;
    ctx.data = await new Promise((resolve, reject) => {
      request(
        `https://mp-yys-1255362963.cos.ap-chengdu.myqcloud.com/gonggao_json/${time}.json`,
        (err, res, resData) => {
          resolve(JSON.parse(resData));
          err && reject(err);
        }
      )
    });
    ctx.body = {
      data: ctx.data
    };
  });

  // 获取御魂
  app.router('yuhun', async (ctx, next) => {
    ctx.data = await new Promise((resolve, reject) => {
      request(
        {
          url: 'https://www.16163.com/zt/dashen/gj/yys/data/yhtj.js',
          method: 'GET'
        },
        (err, res, response) => {
          const firstIndex = response.indexOf('[');
          const lastIndex = response.lastIndexOf(']');
          const data = response.slice(firstIndex, lastIndex + 1);
          resolve(JSON.parse(data));
          reject(err);
        }
      );
    });
    ctx.body = {
      data: ctx.data
    };
  });

  // 获取活动信息
  app.router('active', async (ctx, next) => {
    ctx.data = await new Promise((resolve, reject) => {
      request(
        {
          url:
            'https://mp-yys-1255362963.cos.ap-chengdu.myqcloud.com/active/data.json',
          method: 'GET'
        },
        (err, res, response) => {
          resolve(JSON.parse(response));
          reject(err);
        }
      );
    });
    ctx.body = {
      data: ctx.data
    };
  });

  return app.serve();
};
