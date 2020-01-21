module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {},
  copy: {
    patterns: [
      {
        from: "src/cloud/",
        to: "dist/weapp/cloud/"
      }
    ],
    options: {}
  },
  mini: {},
  h5: {}
};
