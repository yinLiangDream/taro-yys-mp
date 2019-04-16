const name = 'game';

const returnObj = data => {
  return {
    name,
    data
  };
};
export default {
  /**
   * 获取游戏公告列表
   * @param {*} data
   */
  updateList(data = {}) {
    return returnObj({
      ...data,
      $url: 'updateList'
    });
  },
  updateDetail(data = {}) {
    return returnObj({
      ...data,
      $url: 'updateDetail'
    });
  },
  /**
   * 获取御魂详情
   * @param {*} data
   */
  yuhun(data = {}) {
    return returnObj({
      ...data,
      $url: 'yuhun'
    });
  },
  /**
   * 获取活动信息
   * @param {*} data
   */
  active(data = {}) {
    return returnObj({
      ...data,
      $url: 'active'
    });
  }
};
