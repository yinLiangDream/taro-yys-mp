const TcbRouter = require('tcb-router')
const request = require('request')
const jsdom = require('jsdom')

const { JSDOM } = jsdom

exports.main = (event, context) => {
  const app = new TcbRouter({ event })
  app.use(async (ctx, next) => {
    ctx.data = {}
    await next()
  })

  // 式神列表查询
  app.router('list', async (ctx, next) => {
    ctx.data = await new Promise((resolve, reject) => {
      request(
        'https://yys.res.netease.com/m/gw/20180918135651/js/app/shishen.json',
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

  // 式神属性
  app.router('attr', async (ctx, next) => {
    const { level, id, star } = event
    console.log(event)
    ctx.data = await new Promise((resolve, reject) => {
      request(
        `https://g37simulator.webapp.163.com/get_hero_attr?heroid=${id}&awake=0&level=${level ||
          1}&star=${star || 2}`,
        (err, res, content) => {
          const noAwake = JSON.parse(content).data
          request(
            `https://g37simulator.webapp.163.com/get_hero_attr?heroid=${id}&awake=1&level=${level ||
              1}&star=${star || 2}`,
            (error, res, response) => {
              const awake = JSON.parse(response).data
              resolve({
                noAwake,
                awake
              })
              reject(error)
            }
          )
          console.log(err)
        }
      )
    })
    ctx.body = {
      data: ctx.data
    }
  })

  // 式神技能
  app.router('skills', async (ctx, next) => {
    const { id } = event
    ctx.data = await new Promise((resolve, reject) => {
      request(
        `https://g37simulator.webapp.163.com/get_hero_skill?heroid=${id}&awake=0&level=1&star=2`,
        (err, res, content) => {
          const noAwake = JSON.parse(content).data
          request(
            `https://g37simulator.webapp.163.com/get_hero_skill?heroid=${id}&awake=1&level=1&star=2`,
            (error, res, response) => {
              const awake = JSON.parse(response).data
              resolve({
                noAwake,
                awake
              })
              reject(error)
            }
          )
          console.log(err)
        }
      )
    })
    ctx.body = {
      data: ctx.data
    }
  })

  // 式神传记
  app.router('story', async (ctx, next) => {
    ctx.data = await new Promise((resolve, reject) => {
      request(
        `https://g37simulator.webapp.163.com/get_hero_story?heroid=${event.id}`,
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

  // 式神传记解锁
  app.router('storyUnlock', async (ctx, next) => {
    ctx.data = await new Promise((resolve, reject) => {
      request(
        `https://mp-yys-1255362963.cos.ap-chengdu.myqcloud.com/json/sszjjs.json`,
        (err, res, response) => {
          resolve(JSON.parse(response))
          reject(err)
        }
      )
    })
    ctx.body = {
      data: ctx.data
    }
  })

  // 获取式神皮肤id
  app.router('skinIds', async (ctx, next) => {
    const { id } = event
    ctx.data = await new Promise((resolve, reject) => {
      request(
        `https://yys.163.com/m/shishen/${id}.html`,
        (err, res, response) => {
          const dom = new JSDOM(response)
          const skins = JSON.parse(
            dom.window.document.querySelector('#skin').textContent
          )
          resolve(skins)
          console.log(skins)
          reject(err)
        }
      )
    })
    ctx.body = {
      data: ctx.data
    }
  })

  // 获取式神御魂推荐（式神定位、攻击方式等，技能消耗）
  app.router('yuhuntuijian', async (ctx, next) => {
    ctx.data = await new Promise((resolve, reject) => {
      request('https://yys.16163.com/zt/yys/ds/gj/data/ss.js',
      (err, res, response) => {
        const firstIndex = response.indexOf('[')
          const lastIndex = response.lastIndexOf(']')
          const data = response.slice(firstIndex, lastIndex + 1)
          resolve(JSON.parse(data))
          reject(err)
      })
    })
    ctx.body = {
      data: ctx.data
    }
  })

  return app.serve()
}