import $http from "./index";

const BASE_URL = "/partner";

const setUrl = url => {
  return `${BASE_URL}/${url}`;
};

export default {
  async getList() {
    return await $http({ url: setUrl("list") });
  },
  async getStory() {
    return await $http({ url: setUrl("story") });
  },
  async getAttr(data) {
    return await $http({ url: setUrl("attr"), data });
  },
  async getSkills() {
    return await $http({ url: setUrl("skills") });
  }
};
