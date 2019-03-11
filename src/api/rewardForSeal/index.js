const name = 'rewardForSeal'

const returnObj = data => {
  return {
    name,
    data
  }
}
export default {
  /**
   * 列表
   * @param {*} data
   */
  list (data = {}) {
    return returnObj({
      ...data,
      $url: 'list'
    })
  },
  /**
   * 详情
   * @param {*} data
   */
  detail (data = {}) {
    return returnObj({
      ...data,
      $url: 'detail'
    })
  },
  /**
   * 逢魔
   * @param {*} data
   */
  fengmo (data = {}) {
    return returnObj({
      ...data,
      $url: 'fengmo'
    })
  }
}
