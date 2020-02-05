import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import PropTypes from "prop-types";

import styles from "./index.module.less";

class RewardForSealDetailBlock extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { data, category } = this.props;
    const loopDetails = data.map((item, index) => (
      <View key={index}>
        <Text className={styles.adviceName}>{item.name}</Text>
        <View className={styles.adviceDetail}>
          {item.monster.map((monster, index1) => (
            <View key={index1}>
              <Text>{monster.name}</Text>
              <Text className={styles.key}>{monster.value}</Text>
            </View>
          ))}
        </View>
      </View>
    ));
    return (
      <View className={styles.mainBody}>
        <Text className={styles.title}>{category}：</Text>
        <View className={styles.detail}>{loopDetails}</View>
      </View>
    );
  }
}

RewardForSealDetailBlock.propTypes = {
  data: PropTypes.array,
  category: PropTypes.string
};

export default RewardForSealDetailBlock;
