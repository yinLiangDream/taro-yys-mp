import $http from "./index";

const BASE_URL = "/yuhun";

const setUrl = url => {
  return `${BASE_URL}${url ? "/" + url : ""}`;
};

export default {
  async getYuhun() {
    return await $http({ url: setUrl("") });
  }
};
