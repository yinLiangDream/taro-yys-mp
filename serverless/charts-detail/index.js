"use strict";
const request = require("request");

exports.main_handler = async (event, context, callback) => {
  const { server, id } = event.queryString;
  const data = await new Promise((resolve, reject) => {
    request(
      `https://bdapi.gameyw.netease.com/ky59/v1/g37_charts/oneuid?server=${server}&roleid=${id}`,
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
