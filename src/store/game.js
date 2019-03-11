import { observable, configure, action, computed, get } from 'mobx';

configure({ enforceActions: 'observed' });

class Game {
  @observable update = [];

  @action('获取所有更新信息') saveAllUpdate = params => {
    this.update = params;
  };
}

const game = new Game();
export default game;
