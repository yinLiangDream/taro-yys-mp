const name = 'user';

const returnObj = data => {
  return {
    name,
    data
  };
};
export default {
  /**
   * 获取用户登录信息
   * @param {*} data
   */
  login(data = {}) {
    return returnObj({
      ...data,
      $url: 'login'
    });
  }
};
