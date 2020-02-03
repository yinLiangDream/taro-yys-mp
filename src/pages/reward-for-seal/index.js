import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, Input, ScrollView } from "@tarojs/components";
import { observer, inject } from "@tarojs/mobx";

import styles from "./index.module.less";
import { firstName, debounce } from "../../utils/index";
import rewardService from "../../service/reward";

@inject("rewardForSealModel", "indexModel", "userModel")
@observer
class RewardForSeal extends Component {
  static options = {
    addGlobalClass: true
  };
  static config = {
    navigationBarTitleText: "悬赏封印查询"
  };
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      showList: [],
      searchFlag: false,
      tempSelect: []
    };
  }
  async componentDidMount() {
    const { rewardForSealModel } = this.props;
    try {
      const res = await rewardService.getList();
      rewardForSealModel.saveAllReward(res);
    } catch (err) {
      console.error(err);
    }
    if (!Object.keys(rewardForSealModel.allRewardsDetails).length) {
      try {
        const res = await rewardService.getDetail();
        rewardForSealModel.saveAllRewardsDetails(res);
        this.state.data = res;
      } catch (err) {
        console.error(err);
      }
    }
  }
  search(e) {
    const { rewardForSealModel } = this.props;
    debounce(() => {
      this.setState(
        {
          searchFlag: true,
          showList: !e.detail.value ? [] : this.state.showList
        },
        () => {
          if (!e.detail.value) return;
          const data = rewardForSealModel.allRewards;
          this.setState({
            showList:
              data.filter(
                item =>
                  firstName(item.name).includes(e.detail.value) ||
                  item.name.includes(e.detail.value) ||
                  (item.othername && item.othername.includes(e.detail.value)) ||
                  (item.clue && item.clue.includes(e.detail.value))
              ) || []
          });
        }
      );
    });
  }
  async deatil(item) {
    Taro.navigateTo({
      url: `/pages/reward-for-seal/reward-for-seal-detail/index?id=${
        item.id
      }&advice=${JSON.stringify(item.advice)}&name=${item.name}`
    });
  }
  clickAvatar(id) {
    const findIndex = this.state.tempSelect.findIndex(item => item === id);
    if (findIndex >= 0) this.state.tempSelect.splice(findIndex, 1);
    else this.state.tempSelect.push(id);
    this.setState({
      tempSelect: this.state.tempSelect
    });
  }
  searchByName(name) {
    this.setState({
      searchValue: name
    });
    this.search({
      detail: {
        value: name
      }
    });
  }
  render() {
    console.log("render rewardForSeal");
    const findList = this.state.showList.map((item, index) => (
      <View
        className={styles.list}
        key={index}
        onClick={this.deatil.bind(this, item)}
      >
        <Text>
          {item.name}
          {item.othername ? "(" + item.othername + ")" : ""}
        </Text>
        {item.clue ? <Text>线索：{item.clue}</Text> : ""}
      </View>
    ));
    return (
      <ScrollView className={styles.RewardForSeal}>
        <View className={styles.header}>
          <Image
            src="https://mp-yys-1255362963.cos.ap-chengdu.myqcloud.com/search_title.png"
            className={styles.img}
            mode="aspectFit"
          />
        </View>
        <View className={styles.body}>
          <Input
            type="text"
            className={styles["input-box"]}
            placeholder="输入妖怪（简写亦可）、线索、关键词"
            onInput={this.search}
            value={this.state.searchValue}
          />
        </View>
        <ScrollView className={styles.find} scrollY>
          {this.state.showList.length === 0 && this.state.searchFlag ? (
            <Text className={styles.tip}>
              亲亲，没有找到符合条件的妖怪，请重新输入~
            </Text>
          ) : (
            findList
          )}
        </ScrollView>
      </ScrollView>
    );
  }
}
export default RewardForSeal;
