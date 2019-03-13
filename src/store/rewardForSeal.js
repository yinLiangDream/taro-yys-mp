import { observable, configure, action, computed, get } from 'mobx';

configure({ enforceActions: 'observed' });

class RewardForSeal {
  @observable allRewards = [];
  @observable allRewardsDetails = {};
  @observable allFengmo = [];

  @action('保存所有悬赏封印简析') saveAllReward = params => {
    this.allRewards = params;
  };
  @action('保存所有悬赏封印详情') saveAllRewardsDetails = params => {
    this.allRewardsDetails = params;
  };
  @action('保存所有逢魔信息') saveAllFengmo = params => {
    this.allFengmo = params;
  };

  @computed get filterDetail() {
    const filterSealArr = (data, key) => {
      return data.filter(item => {
        const arr = item.monster;
        return arr.find(item => {
          const keys = Object.keys(item.detail);
          return keys.includes(key);
        });
      });
    }
    return (key, funcName) => {
      const data = this.allRewardsDetails[funcName];
      return filterSealArr(data, key)
        .map(item => {
          const monster = item.monster.filter(item => {
            return Object.keys(item.detail).includes(key);
          });
          item.monster = monster;
          return item;
        })
        .map(item => {
          const monster = item.monster.map(item => {
            const num = item.detail[key];
            item.value = `${key}*${num}`;
            return item;
          });
          item.monster = monster;
          return item;
        });
    }
  }
}

const rewardForSeal = new RewardForSeal();
export default rewardForSeal;
