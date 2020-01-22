"use strict";
const request = require("request");

exports.main_handler = async (event, context, callback) => {
  const response = await new Promise((resolve, reject) => {
    request(
      `https://www.16163.com/zt/yys/gj/fengmodatinew/js/data.js`,
      (err, res, context) => {
        const content = context.split("[")[1].split("]")[0];
        const data = JSON.parse(`[${content.replace(/'/g, '"')}]`);
        resolve(data);
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
    body: response
  };
};
