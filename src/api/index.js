import role from './role'
import rewardForSeal from './rewardForSeal'
import game from './game'

const httpRequest = async params => {
  try {
    wx.cloud.init({
      env: process.env.NODE_ENV === 'development' ? 'test-ee83d3' : 'formal-265d2c'
    })
    const promise = await new Promise((resolve, reject) => {
      const data = params.data || {}
      wx.cloud.callFunction({
        data,
        name: params.name,
        success (res) {
          resolve(res)
        },
        fail (err) {
          reject(err)
        }
      })
    })
    return promise
  } catch (error) {
    throw error
  }
}

/**
 * 角色相关
 * @param {*} name
 * @param {*} params
 */
export const roleApi = async (name, params = {}) => {
  return httpRequest(role[name](params))
}

/**
 * 悬赏封印相关
 * @param {*} name
 * @param {*} params
 */
export const rewardForSealApi = async (name, params = {}) => {
  return httpRequest(rewardForSeal[name](params))
}

/**
 * 游戏信息相关
 * @param {*} name
 * @param {*} params
 */
export const gameApi = async (name, params = {}) => {
  return httpRequest(game[name](params))
}
