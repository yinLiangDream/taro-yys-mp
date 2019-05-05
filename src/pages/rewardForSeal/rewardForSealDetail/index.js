import Taro, { Component } from '@tarojs/taro';
import {View, Text, Image, ScrollView} from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import RewardForSealDetailBlock from '../../../components/RewardForSealDetailBlock/index';

import styles from './index.module.less';

import { setNavTitle } from '../../../utils/index';
import StatusBar from "../../../components/StatusBar";

let routerParams = {};
@inject('rewardForSealModel', 'indexModel')
@observer
class RewardForSeal extends Component {
  static options = {
    addGlobalClass: true
  };
  constructor(props) {
    super(props);
    const { indexModel } = this.props;
    this.state = {
      name: '',
      advice: [],
      categories: [],
      staticUrl: {
        baseUrl: indexModel.baseUrl,
        search_deatil_title: `${indexModel.baseUrl}search_detail_title.png`
      }
    };
  }
  async componentDidMount() {}
  async componentWillMount() {
    routerParams = this.$router.params;
    this.state.name = routerParams.name;
  }
  componentDidShow() {
    const { rewardForSealModel } = this.props;
    const keys = ['chapter', 'yuhun', 'yqfy', 'jbyg', 'jyyg', 'secret'];
    const keyMap = {
      chapter: '章节',
      yuhun: '御魂副本',
      yqfy: '妖气封印',
      jbyg: '金币妖怪',
      jyyg: '经验妖怪',
      secret: '秘闻副本'
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
    console.log('render rewardForSealDetail');
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
      <ScrollView className={styles.rewardForSealDetail} scrollY>
        <StatusBar content={routerParams.name} fontColor='text-black' isBack backText='返回查询' />
        <View className={styles.title}>
          <Image
            src={this.state.staticUrl.search_deatil_title}
            mode='aspectFit'
            className={styles.img}
          />
          <Text className={styles.text}>{this.state.name}</Text>
        </View>
        <ScrollView className={styles.body} scrollY>
          {this.state.advice.length > 0 ? (
            <View className={`${styles.advice} ${styles.mainBody}`}>
              <View className={styles.title}>推荐副本：</View>
              <View className={styles.detail}>{adviceList}</View>
            </View>
          ) : (
            ''
          )}
          {this.state.categories.map((item, index) => (
            <View key={index} style='width: 100%'>
              {item.data.length > 0 ? (
                <RewardForSealDetailBlock
                  data={item.data}
                  category={item.category}
                />
              ) : (
                ''
              )}
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    );
  }
}

export default RewardForSeal;
