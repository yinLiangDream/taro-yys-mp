module.exports = {
  "root": true,
  "extends": ["taro", "prettier"],
  "rules": {
    "no-unused-vars": ["error", { "varsIgnorePattern": "Taro" }],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".tsx"] }]
  },
  "parser": "babel-eslint",
  "env": {
    "browser": false,
    "node": true,
    "es6": true
  },
  "globals": {
    "App": true,
    "Page": true,
    "wx": true,
    "swan": true,
    "tt": true,
    "my": true,
    "getApp": true,
    "getPage": true,
    "requirePlugin": true,
  }
}
