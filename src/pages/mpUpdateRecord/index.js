import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import styles from './index.module.less';

import updateData from '../../utils/mpUpdateModel';

@inject('indexModel')
@observer
class Record extends Component {
  static options = {
    addGlobalClass: true
  }
  config = {
    navigationBarTitleText: '小程序更新记'
  };
  constructor(props) {
    super(props);
  }
  showQR() {
    const { indexModel } = this.props;
    Taro.previewImage({
      current: indexModel.baseUrl + 'mpQRcode.png',
      urls: [indexModel.baseUrl + 'mpQRcode.png']
    });
  }

  render() {
    const updateList = updateData.map((item, index) => (
      <View
        key={index}
        className={`${
          index === 0 ? 'text-blue' : 'text-Abc'
        } cu-item text-blue`}
      >
        <View className='content bg-gradual-blue shadow-blur'>
          <View className={`${styles.cusTag} cu-capsule radius`}>
            <View className='cu-tag bg-cyan radius padding'>
              {item.version}
            </View>
            <View className='cu-tag bg-cyan round sm'>{item.date}</View>
          </View>
          <View className='margin-top'>
            {item.desc.map((itemDesc, indexDesc) => (
              <View key={indexDesc}>{itemDesc}</View>
            ))}
          </View>
        </View>
      </View>
    ));
    return (
      <View className={styles.mpUpdateRecord}>
        <View className='padding'>
          <View className='text-grey sm bg-gray radius padding text-bold text-sm'>
            Tips: 如果您觉得好用，请点击{' '}
            <Button
              onClick={this.showQR}
              className='cu-btn sm bg-gradual-pink text-Abc round shadow'
            >
              这里
            </Button>{' '}
            保存小程序二维码，让更多的小伙伴知道吧~
          </View>
        </View>
        <View className='cu-timeline'>{updateList}</View>
      </View>
    );
  }
}

export default Record
