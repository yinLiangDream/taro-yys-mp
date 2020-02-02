"use strict";
const request = require("request");

exports.main_handler = async (event, context, callback) => {
  const data = await new Promise((resolve, reject) => {
    request(
      "https://mp-yys-1255362963.cos.ap-chengdu.myqcloud.com/yuhun/json/yuhun.json",
      (err, res, content) => {
        resolve(JSON.parse(content));
        reject(err);
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
