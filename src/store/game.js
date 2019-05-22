import { observable, configure, action, computed, get } from 'mobx';

configure({ enforceActions: 'observed' });

class Game {
  @observable update = [];
  @observable yuhunInfo = [];

  @action('获取所有更新信息') saveAllUpdate = params => {
    this.update.replace(params);
  };
  @action('获取所有御魂信息') saveAllYuhun = params => {
    this.yuhunInfo.replace(params);
  };
  @computed get getUpdate() {
    return this.update;
  }
  @computed get getYuhunInfo() {
    return this.yuhunInfo;
  }
}

const game = new Game();
export default game;
