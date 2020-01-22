"use strict";
const request = require("request");

exports.main_handler = async (event, context, callback) => {
  const data = await new Promise((resolve, reject) => {
    request(
      `https://mp-yys-1255362963.cos.ap-chengdu.myqcloud.com/ss_json/skill.json`,
      (err, res, content) => {
        err ? reject(err) : resolve(JSON.parse(content));
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
