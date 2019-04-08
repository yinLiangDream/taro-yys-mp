const name = 'role'

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
   * 属性
   * @param {*} data
   */
  attr (data = {}) {
    return returnObj({
      ...data,
      $url: 'attr'
    })
  },
  /**
   * 技能
   * @param {*} data
   */
  skills (data = {}) {
    return returnObj({
      ...data,
      $url: 'skills'
    })
  },
  /**
   * 故事
   * @param {*} data
   */
  story (data = {}) {
    return returnObj({
      ...data,
      $url: 'story'
    })
  },
  /**
   * 式神传记解锁
   * @param {*} data
   */
  storyUnlock (data = {}) {
    return returnObj({
      ...data,
      $url: 'storyUnlock'
    })
  },
  /**
   * 获取式神 皮肤Id
   * @param {*} data
   */
  skinIds (data = {}) {
    return returnObj({
      ...data,
      $url: 'skinIds'
    })
  },
  /**
   * 获取御魂推荐
   * @param {*} data
   */
  yuhuntuijian (data = {}) {
    return returnObj({
      ...data,
      $url: 'yuhuntuijian'
    })
  },
  zrtj (data = {}) {
    return returnObj({
      ...data,
      $url: 'zrtj'
    })
  }
}
