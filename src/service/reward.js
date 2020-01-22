import $http from "./index";

const BASE_URL = "/reward";

const setUrl = url => {
  return `${BASE_URL}/${url}`;
};

export default {
  async getList() {
    return await $http({ url: setUrl("list") });
  },
  async getDetail() {
    return await $http({ url: setUrl("detail") });
  }
};
