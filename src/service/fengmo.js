import $http from "./index";

const BASE_URL = "/fengmo";

export default {
  async getFengmo() {
    return await $http({ url: BASE_URL });
  }
};
