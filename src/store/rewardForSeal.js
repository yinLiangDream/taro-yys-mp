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
}

const rewardForSeal = new RewardForSeal();
export default rewardForSeal;
