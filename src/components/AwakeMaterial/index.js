import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import PropTypes from 'prop-types';

import styles from './index.module.less';

class AwakeMaterial extends Component {
  static options = {
    addGlobalClass: true
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data } = this.props;
    return (
      <View className={`${styles.material} padding`}>
        <Image src={data.url} className={styles.img} mode='widthFix' />
        <View className={styles.text}>
          {data.name}
          <Text className={styles.num}>x{data.num}</Text>
        </View>
      </View>
    );
  }
}

AwakeMaterial.propTypes = {
  data: PropTypes.object
};

export default AwakeMaterial;
