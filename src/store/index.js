import { observable, configure, action, computed, get } from 'mobx';
import Taro from '@tarojs/taro';

configure({ enforceActions: 'observed' });

const baseUrl = 'https://mp-yys-1255362963.cos.ap-chengdu.myqcloud.com/';
const systemInfo = Taro.getSystemInfoSync();
class Global {
  @observable mpUpdate = [];
  @observable Custom = '';
  @observable allRoles = [];
  @observable attrMap = {
    SS: baseUrl + 'attribute/SS.png',
    S: baseUrl + 'attribute/S.png',
    A: baseUrl + 'attribute/A.png',
    B: baseUrl + 'attribute/B.png',
    C: baseUrl + 'attribute/C.png',
    D: baseUrl + 'attribute/D.png'
  };
  @observable attrLevel = ['D', 'C', 'B', 'A', 'S', 'SS'];
  @observable awakeMaterial = {
    '水灵鲤·中级': baseUrl + 'awakeMaterial/sll_mid.png',
    '水灵鲤·低级': baseUrl + 'awakeMaterial/sll_low.png',
    '水灵鲤·高级': baseUrl + 'awakeMaterial/sll_high.png',
    '天雷鼓·中级': baseUrl + 'awakeMaterial/tlg_mid.png',
    '天雷鼓·低级': baseUrl + 'awakeMaterial/tlg_low.png',
    '天雷鼓·高级': baseUrl + 'awakeMaterial/tlg_high.png',
    '业火轮·中级': baseUrl + 'awakeMaterial/yhl_mid.png',
    '业火轮·低级': baseUrl + 'awakeMaterial/yhl_low.png',
    '业火轮·高级': baseUrl + 'awakeMaterial/yhl_high.png',
    '风转符·中级': baseUrl + 'awakeMaterial/fzf_mid.png',
    '风转符·低级': baseUrl + 'awakeMaterial/fzf_low.png',
    '风转符·高级': baseUrl + 'awakeMaterial/fzf_high.png'
  };
  @observable attrRoleMap = {
    attack: '攻击',
    maxHp: '生命',
    defense: '防御',
    speed: '速度',
    critRate: '暴击',
    critPower: '暴击伤害',
    debuffResist: '效果抵抗',
    debuffEnhance: '效果命中'
  };
  @observable baseUrl = baseUrl;
  @observable allRoleDetail = [];
  @observable StatusBar = systemInfo.statusBarHeight;
  @observable Custom = wx.getMenuButtonBoundingClientRect();
  @observable CustomBar = this.Custom.bottom + this.Custom.top - this.StatusBar;

  @action('获取所有式神') saveAllRoles = params => {
    this.allRoles.replace(params);
  };

  @action('获取所有更新') saveMpUpdate = params => {
    this.mpUpdate.replace(params);
  };

  @action('获取所有式神详情') saveAllRoleDetail = params => {
    this.allRoleDetail.replace(params);
  };

  @computed get all() {
    return this.allRoles;
  }

  @computed get allinteractive() {
    return this.allRoles.filter(item => item.interactive);
  }

  @computed get allmaterial() {
    return this.allRoles.filter(item => item.material);
  }

  @computed get allsp() {
    return this.allRoles.filter(item => item.level === 'SP');
  }

  @computed get allssr() {
    return this.allRoles.filter(item => item.level === 'SSR');
  }

  @computed get allsr() {
    return this.allRoles.filter(item => item.level === 'SR');
  }

  @computed get allr() {
    return this.allRoles.filter(item => item.level === 'R');
  }

  @computed get alln() {
    return this.allRoles.filter(item => item.level === 'N');
  }
  @computed get getAttrLevel() {
    return this.attrLevel;
  }
  @computed get getAwakeMaterial() {
    return this.awakeMaterial;
  }
  @computed get getAttrMap() {
    return this.attrMap;
  }
  @computed get getAttrRoleMap() {
    return this.attrRoleMap;
  }
}

const global = new Global();
export default global;
