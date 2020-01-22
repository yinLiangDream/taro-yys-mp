'use strict';
const request = require("request");
exports.main_handler = async (event, context, callback) => {
    const data = await new Promise((resolve, reject) => {
    request(
      "https://mp-yys-1255362963.cos.ap-chengdu.myqcloud.com/gonggao_json/updateList.json",
      (err, res, resData) => {
        resolve(JSON.parse(resData));
        err && reject(err);
      }
    );
  });

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: data
  };
};