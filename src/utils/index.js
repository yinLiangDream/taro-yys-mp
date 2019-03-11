import pinyin from 'pinyin'

export const firstName = (value) => {
  return pinyin(value, {
    style: pinyin.STYLE_FIRST_LETTER
  }).join('')
}