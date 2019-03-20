const TcbRouter = require('tcb-router')
const request = require('request')

exports.main = (event, context) => {
  const app = new TcbRouter({ event })
  app.use(async (ctx, next) => {
    ctx.data = {}
    await next()
  })

  // 游戏更新公告
  app.router('update', async (ctx, next) => {
    // 获取所有日志
    const form = {
      count: 100,
      topicName: '阴阳师更新公告'
    }
    ctx.data = await new Promise((resolve, reject) => {
      request(
        {
          url: 'https://god.gameyw.netease.com/v1/app/topic/getHandpickedFeeds/v2',
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'GL-ClientType': '50',
            'GL-Version': '0'
          },
          body: JSON.stringify(form)
        },
        (error, res, context) => {
          const data = JSON.parse(context)
          // console.log(data)
          const dataArr = data.result.feeds
          resolve(dataArr)
          reject(error)
        }
      )
    })
    ctx.body = {
      data: ctx.data
    }
  })

  return app.serve()
}
