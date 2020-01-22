"use strict";
const request = require("request");

exports.main_handler = async (event, context, callback) => {
  const { level, id, star } = event.queryString;
  const data = await new Promise((resolve, reject) => {
    request(
      `https://g37simulator.webapp.163.com/get_hero_attr?heroid=${id}&awake=0&level=${level ||
        1}&star=${star || 2}`,
      (err, res, content) => {
        const noAwake = JSON.parse(content).data;
        request(
          `https://g37simulator.webapp.163.com/get_hero_attr?heroid=${id}&awake=1&level=${level ||
            1}&star=${star || 2}`,
          (error, res, response) => {
            const awake = JSON.parse(response).data;
            resolve({
              noAwake,
              awake
            });
            reject(error);
          }
        );
        console.log(err);
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
