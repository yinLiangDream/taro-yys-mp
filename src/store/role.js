import { observable, configure, action, computed, get } from 'mobx';

configure({ enforceActions: 'observed' });

class Role {
  @observable allStory = {};
  @observable allSkill = {};
  @observable allRecommend = [];
  @observable allZRRecommend = [];

  @action('获取所有式神传记') saveAllStory = params => {
    console.log('获取所有式神传记', params);
    this.allStory = params;
  };
  @action('获取所有技能描述') saveAllSKill = params => {
    console.log('获取所有技能描述', params);
    this.allSkill = params;
  };
  @action('获取所有推荐信息') saveAllRecommend = params => {
    console.log('获取所有推荐信息', params);
    this.allRecommend.replace(params);
  };
  @action('获取所有阵容推荐') saveAllZRRecommend = params => {
    console.log('获取所有阵容推荐', params);
    this.allZRRecommend.replace(params);
  };

  @computed get getStoryById() {
    return id => {
      return this.allStory[id].data.story;
    };
  }
  @computed get getSkillById() {
    return id => {
      return this.allSkill[id];
    };
  }
}

const role = new Role();
export default role;
