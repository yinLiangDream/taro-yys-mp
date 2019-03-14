import tinypinyin from 'tiny-pinyin';
import Taro from '@tarojs/taro';

/**
 * 将中文转换成拼音
 * @param {*} value
 */
export const firstName = value => {
  const pinyin = tinypinyin.convertToPinyin(value, '-', true);
  return pinyin.split('-').map(key => key.slice(0, 1)).join('')
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
