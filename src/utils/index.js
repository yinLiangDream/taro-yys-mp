import tinypinyin from 'tiny-pinyin';
import Taro from '@tarojs/taro';

/**
 * 将中文转换成拼音
 * @param {*} value
 */
export const firstName = value => {
  const pinyin = tinypinyin.convertToPinyin(value, '-', true);
  return pinyin
    .split('-')
    .map(key => key.slice(0, 1))
    .join('');
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
