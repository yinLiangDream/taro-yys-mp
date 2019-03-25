import { observable, configure, action, computed, get } from 'mobx';

configure({ enforceActions: 'observed' });

class Game {
  @observable update = [];
  @observable yuhunInfo = [];

  @action('获取所有更新信息') saveAllUpdate = params => {
    this.update = params;
  };
  @action('获取所有御魂信息') saveAllYuhun = params => {
    this.yuhunInfo = params;
  }
}

const game = new Game();
export default game;
