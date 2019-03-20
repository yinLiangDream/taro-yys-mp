module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  copy: {
    patterns: [
      {
        from: 'src/cloud/',
        to: 'dist/cloud/'
      }
    ],
    options: {
    }
  },
  weapp: {
  },
  h5: {
  }
}
