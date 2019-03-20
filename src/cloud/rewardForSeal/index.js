const TcbRouter = require('tcb-router')
const request = require('request')

exports.main = (event, context) => {
  const app = new TcbRouter({ event })
  app.use(async (ctx, next) => {
    ctx.data = {}
    await next()
  })

  // 悬赏封印式神名字查询
  app.router('list', async (ctx, next) => {
    ctx.data = await new Promise((resolve, reject) => {
      request(
        'https://nie.res.netease.com/xcx/yys/tools/fy/json/shishendatas.json',
        (err, res, content) => {
          resolve(JSON.parse(content))
          reject(err)
        }
      )
    })
    ctx.body = {
      data: ctx.data
    }
  })

  // 悬赏封印详情
  app.router('detail', async (ctx, next) => {
    ctx.data = await new Promise((resolve, reject) => {
      request(
        'https://nie.res.netease.com/xcx/yys/tools/fy/json/datas.json',
        (err, res, content) => {
          resolve(JSON.parse(content))
          reject(err)
        }
      )
    })
    ctx.body = {
      data: ctx.data
    }
  })

  // 逢魔密信
  app.router('fengmo', async (ctx, next) => {
    ctx.data = await new Promise((resolve, reject) => {
      request(
        `https://www.16163.com/zt/yys/gj/fengmodatinew/js/data.js`,
        (err, res, context) => {
          const content = context.split('[')[1].split(']')[0]
          const data = JSON.parse(`[${content.replace(/'/g, '"')}]`)
          resolve(data)
          reject(err)
        }
      )
    })
    ctx.body = {
      data: ctx.data
    }
  })

  return app.serve()
}
