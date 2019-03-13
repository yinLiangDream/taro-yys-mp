import pinyin from 'pinyin';
import Taro from '@tarojs/taro';

/**
 * 将中文转换成英文首字符
 * @param {*} value
 */
export const firstName = value => {
  return pinyin(value, {
    style: pinyin.STYLE_FIRST_LETTER
  }).join('');
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
