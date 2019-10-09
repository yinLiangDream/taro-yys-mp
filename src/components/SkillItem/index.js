import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import PropTypes from 'prop-types';

import styles from './index.module.less';

class SkillItem extends Component {
  static options = {
    addGlobalClass: true
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { skills, awake } = this.props;
    return (
      <View className={styles.skillDetail}>
        {skills.map((item, index) => (
          <View key={index} className={styles.item}>
            <View className={`${styles.skillItem} shadow-blur padding bg-gray`}>
              {awake ? <View className={styles.awake}>式神觉醒</View> : ''}
              {item.url ? (
                <View className={styles.skillIcon}>
                  <Image
                    src={item.url}
                    mode='widthFix'
                    className={styles.img}
                  />
                  <View className={styles.title}>{item.text.name}</View>
                </View>
              ) : (
                ''
              )}
              <View className={styles.skillDes}>{item.text.normaldesc}</View>
              <View className={styles.skillLevel}>
                {item.text.desc.map((itemDesc, indexDesc) => (
                  <View key={indexDesc}>{itemDesc}</View>
                ))}
              </View>
              {awake ? (
                <View className={styles.awakeText}>{skills[0].text.add}</View>
              ) : (
                ''
              )}
            </View>
          </View>
        ))}
      </View>
    );
  }
}

SkillItem.propTypes = {
  skills: PropTypes.array,
  awake: PropTypes.bool
};

export default SkillItem;
