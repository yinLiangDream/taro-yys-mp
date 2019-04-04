import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';


export default class UpdateDetail extends Component {
  static options = {
    addGlobalClass: true
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View className='flex flex-direction justify-center margin bg-gray' style={{ border: '1rpx solid lightgray', borderRadius: '10rpx' }} >
        <View className='flex text-lg text-bold justify-center padding'>
          {this.props.detail.title}
        </View>
        <View className='text-sm justify-end flex padding-right text-gray'>
          {this.props.detail.time}
        </View>
        <View className='padding'>
          {this.props.detail.desc.map(item => (
            <View key={item.title}>
              <View className='text-bold text-red text-df'>{item.title}</View>
              {item.desc.map(itemDesc => (
                <View className='text-sm' key={itemDesc}>
                  {itemDesc}
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  }
}

UpdateDetail.propTypes = {
  detail: PropTypes.object
};