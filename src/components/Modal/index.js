import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import PropTypes from 'prop-types';

class Modal extends Component {
  static options = {
    addGlobalClass: true
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  hideModal() {
    this.props.onClose();
  }

  componentDidShow() {}

  render() {
    const { show, title } = this.props;
    return (
      <View className={`${show ? 'show' : ''} cu-modal`}>
        <View className='cu-dialog'>
          <View className='cu-bar bg-white justify-end'>
            <View className='content'>{title}</View>
            <View className='action' onClick={this.hideModal}>
              <Text claclassNamess='icon-close text-red' />
            </View>
          </View>
          <view className='padding-xl'>{this.props.children}</view>
        </View>
      </View>
    );
  }
}

Modal.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string
};

export default Modal;
