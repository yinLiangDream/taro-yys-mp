import Taro from "@tarojs/taro";

const BASE_URL =
  "https://service-fd6s17jb-1255362963.sh.apigw.tencentcs.com/api/v1";

const $http = async ({ url, method = "GET", data = {} }) => {
  const res = await Taro.request({
    url: `${BASE_URL}${url}`,
    method,
    data
  });
  return res.data.body;
};

export default $http;
