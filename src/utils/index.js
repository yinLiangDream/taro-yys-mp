import tinypinyin from "tiny-pinyin";
import Taro from "@tarojs/taro";

/**
 * 将中文转换成拼音
 * @param {*} value
 */
export const firstName = value => {
  const pinyin = tinypinyin.convertToPinyin(value, "-", true);
  return pinyin
    .split("-")
    .map(key => key.slice(0, 1))
    .join("");
};

/**
 * 设置标题
 * @param {*} name
 */
export const setNavTitle = name => {
  return Taro.setNavigationBarTitle({
    title: name
  });
};

/**
 * 函数防抖
 * @param {*} fn 传入执行的函数
 * @param {*} wait 防抖时间, 默认 500 毫秒
 */
let time = null;
export const debounce = (fn, wait = 200) => {
  if (time !== null) clearTimeout(time);
  time = setTimeout(fn, wait);
};

/**
 *  分数换算名士星级
 */
export const getStar = currentScore => {
  return Math.floor((currentScore - 3000) / 30);
};

/**
 * 积分换算等级名称
 */
export const scoreLevel = score => {
  if (score >= 3900) return "大名士";
  if (score >= 3000 && score < 3900) return "名士";
  if (score >= 2700 && score < 3000) return "九段";
  if (score >= 2400 && score < 2700) return "八段";
  if (score >= 2200 && score < 2400) return "七段";
  return "";
};
