import $http from "./index";

const BASE_URL = "/charts";

const setUrl = url => {
  return `${BASE_URL}/${url}`;
};

export default {
  /**
   * 获取服务器列表
   */
  async getServerList() {
    return await $http({ url: setUrl("server") });
  },
  /**
   * 获取斗技排行
   */
  async getChartsList({ server = "all", page = 1 }) {
    return await $http({ url: setUrl("list"), data: { server, page } });
  }
};
