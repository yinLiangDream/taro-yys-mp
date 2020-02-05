import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { observer, inject } from "@tarojs/mobx";
import { ClLayout } from "mp-colorui";

import RewardForSealDetailBlock from "../../components/RewardForSealDetailBlock/index";

import styles from "./index.module.less";

let routerParams = {};
@inject("rewardForSealModel", "indexModel")
@observer
class RewardForSeal extends Component {
  static options = {
    addGlobalClass: true
  };
  static config = {
    navigationBarTitleText: "式神详情"
  };
  constructor(props) {
    super(props);
    const { indexModel } = this.props;
    this.state = {
      name: "",
      advice: [],
      categories: [],
      staticUrl: {
        baseUrl: indexModel.baseUrl,
        search_deatil_title: `${indexModel.baseUrl}search_detail_title.png`
      }
    };
  }
  async componentWillMount() {
    routerParams = this.$router.params;
    this.state.name = routerParams.name;
    Taro.setNavigationBarTitle({
      title: routerParams.name
    });
  }
  componentDidShow() {
    const { rewardForSealModel } = this.props;
    const keys = ["chapter", "yuhun", "yqfy", "jbyg", "jyyg", "secret"];
    const keyMap = {
      chapter: "章节",
      yuhun: "御魂副本",
      yqfy: "妖气封印",
      jbyg: "金币妖怪",
      jyyg: "经验妖怪",
      secret: "秘闻副本"
    };
    const categories = keys.map(key => ({
      category: keyMap[key],
      data: rewardForSealModel.filterDetail(this.state.name, key)
    }));
    this.setState({
      advice: JSON.parse(routerParams.advice),
      categories,
      name: this.state.name
    });
  }

  render() {
    console.log("render rewardForSealDetail");
    const adviceList = this.state.advice.map((item, index) => (
      <View key={index}>
        <Text className={styles.adviceName}>{item[0][0]}</Text>
        <View className={styles.adviceDetail}>
          {item[0][1].map((everyitem, index1) => (
            <View key={index1}>
              <Text>{everyitem[0]}</Text>
              <Text className={styles.key}>
                ({this.state.name}*{everyitem[1]})
              </Text>
            </View>
          ))}
        </View>
        <View className={styles.consumption}>
          体力消耗：<Text className={styles.key}>{item[1]}</Text>
        </View>
      </View>
    ));
    return (
      <View className={styles.rewardForSealDetail}>
        <View className={styles.title}>
          <Image
            src={this.state.staticUrl.search_deatil_title}
            mode="aspectFit"
            className={styles.img}
          />
          <Text className={styles.text}>{this.state.name}</Text>
        </View>
        <ClLayout className={`${styles.body} solid radius`} padding="normal">
          <ScrollView className={`${styles.body}`} scrollY>
            {this.state.advice.length > 0 ? (
              <View className={`${styles.advice} ${styles.mainBody}`}>
                <View className={styles.title}>推荐副本：</View>
                <View className={styles.detail}>{adviceList}</View>
              </View>
            ) : (
              ""
            )}
            {this.state.categories.map((item, index) => (
              <View key={index + Math.random()} style="width: 100%">
                {item.data.length > 0 ? (
                  <RewardForSealDetailBlock
                    data={item.data}
                    category={item.category}
                  />
                ) : (
                  ""
                )}
              </View>
            ))}
          </ScrollView>
        </ClLayout>
      </View>
    );
  }
}

export default RewardForSeal;
