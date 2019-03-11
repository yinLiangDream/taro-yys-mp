const name = 'game'

const returnObj = data => {
  return {
    name,
    data
  }
}
export default {
  /**
   * 游戏公告
   * @param {*} data
   */
  update (data = {}) {
    return returnObj({
      ...data,
      $url: 'update'
    })
  }
}
