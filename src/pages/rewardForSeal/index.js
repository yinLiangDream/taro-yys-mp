import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Input } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import styles from './index.module.less';
import { rewardForSealApi } from '../../api/index';
import { firstName } from '../../utils/index';

@inject('rewardForSealModel')
@observer
class RewardForSeal extends Component {
  static options = {
    addGlobalClass: true
  };
  constructor(props) {
    super(props);
    this.state = {
      showList: [],
      searchFlag: false
    };
  }
  async componentDidMount() {
    const { rewardForSealModel } = this.props;
    try {
      const res = await rewardForSealApi('list', {});
      rewardForSealModel.saveAllReward(res.result.data);
    } catch (err) {
      console.error(err);
    }
    if (!Object.keys(rewardForSealModel.allRewardsDetails).length) {
      try {
        const res = await rewardForSealApi('detail', {});
        rewardForSealModel.saveAllRewardsDetails(res.result.data);
        this.state.data = res.result.data;
      } catch (err) {
        console.error(err);
      }
    }
  }
  search(e) {
    const { rewardForSealModel } = this.props;
    console.log(e.detail)
    this.setState({
      searchFlag: true,
      showList: !e.detail.value ? [] : this.state.showList
    }, () => {
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
    });
  }
  async deatil(item) {
    Taro.navigateTo({
      url: `/pages/rewardForSeal/rewardForSealDetail/index?id=${
        item.id
      }&advice=${JSON.stringify(item.advice)}&name=${item.name}`
    });
  }
  render() {
    console.log('render rewardForSeal');
    const findList = this.state.showList.map((item, index) => (
      <View
        className={styles.list}
        key={index}
        onClick={this.deatil.bind(this, item)}
      >
        <Text>
          {item.name}
          {item.othername ? '(' + item.othername + ')' : ''}
        </Text>
        {item.clue ? <Text>线索：{item.clue}</Text> : ''}
      </View>
    ));
    return (
      <View className={styles.RewardForSeal}>
        <View className={styles.header}>
          <Image
            src='https://mp-yys-1255362963.cos.ap-chengdu.myqcloud.com/search_title.png'
            className={styles.img}
            mode='aspectFit'
          />
        </View>
        <View className={styles.body}>
          <Input
            type='text'
            className={styles['input-box']}
            placeholder='输入妖怪（简写亦可）、线索、关键词'
            onInput={this.search}
          />
        </View>
        <View className={styles.find}>
          {this.showList.length === 0 && this.state.searchFlag ? (
            <Text className={styles.tip}>
              亲亲，没有找到符合条件的妖怪，请重新输入~
            </Text>
          ) : (
            ''
          )}
          <View />
          {findList}
        </View>
      </View>
    );
  }
}
export default RewardForSeal;
