import Taro, { Component } from "@tarojs/taro";
import { View, Text, Input, Image, ScrollView } from "@tarojs/components";
import { observer, inject } from "@tarojs/mobx";

import fengmoService from "../../service/fengmo";
import { firstName } from "../../utils/index";

import styles from "./index.module.less";

@inject("rewardForSealModel", "indexModel")
@observer
class Fengmo extends Component {
  static options = {
    addGlobalClass: true
  };
  static config = {
    navigationBarTitleText: "逢魔密信查询"
  };

  constructor(props) {
    super(props);
    const { indexModel } = this.props;
    this.state = {
      showList: [],
      allDatas: [],
      statusControl: {
        searchFlag: false
      },
      staticUrl: {
        search_deatil_title: `${indexModel.baseUrl}search_detail_title.png`
      }
    };
  }

  async componentDidMount() {
    const { rewardForSealModel } = this.props;
    if (rewardForSealModel.allFengmo.length === 0) {
      try {
        const res = await fengmoService.getFengmo();
        rewardForSealModel.saveAllFengmo(res);
        this.setState({
          allDatas: res
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  search(e) {
    this.setState(
      {
        showList: !e.detail.value ? [] : this.state.showList,
        statusControl: {
          searchFlag: true
        }
      },
      () => {
        if (!e.detail.value) return;
        this.setState({
          showList: this.state.allDatas.filter(
            item =>
              item.question.includes(e.detail.value) ||
              firstName(item.question).includes(e.detail.value)
          )
        });
      }
    );
  }
  render() {
    console.log("render fengmo");
    const detailList = this.state.showList.map((item, index) => (
      <View className={styles.list} key={index}>
        <Text>{item.question}</Text>
        <Text>{item.opt1}</Text>
      </View>
    ));
    return (
      <ScrollView className={`${styles.fengmo} padding`}>
        <View className={styles.title}>
          <Image
            src={this.state.staticUrl.search_deatil_title}
            mode="aspectFit"
            className={styles.img}
          />
          <Text className={styles.text}>逢魔 ● 密信</Text>
        </View>
        <View className={styles.body}>
          <View className={styles.long}>
            <Input
              className={styles["input-box"]}
              type="text"
              placeholder="请输入题目、关键字、拼音首字母"
              onInput={this.search}
            />
          </View>
        </View>
        <ScrollView
          className={styles.find}
          scrollY
          style={{ height: `calc(100vh - ${Taro.pxTransform(400)})` }}
        >
          {this.state.showList.length === 0 &&
          this.state.statusControl.searchFlag ? (
            <Text className={styles.tip}>
              亲亲，没有找到符合条件的题目，请重新输入~
            </Text>
          ) : (
            ""
          )}
          {detailList}
        </ScrollView>
      </ScrollView>
    );
  }
}

export default Fengmo;
