import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import PropTypes from 'prop-types';

import styles from './index.module.less';

class FloatButton extends Component {
  static options = {
    addGlobalClass: true
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidShow() {}

  componentWillReceiveProps() {}

  click() {
    this.props.onClickButton()
  }

  render() {
    const { type, detail } = this.props;
    return (
      <View className={`${styles.floatButton} round bg-blue shadow`} onClick={this.click}>
        <View className={styles.main}>
          {type !== 'image' ? detail : <Image src={detail} mode='aspectFill' />}
        </View>
      </View>
    );
  }
}

FloatButton.propTypes = {
  type: PropTypes.string,
  detail: PropTypes.string
};

export default FloatButton;
