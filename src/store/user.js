import { observable, configure, action, computed, get } from 'mobx';

configure({ enforceActions: 'observed' });

class UserModel {
  @observable userSetting = {};
  @observable userOpenId = '';

  @action('获取用户权限信息') saveUserSetting = params => {
    console.log('获取用户权限信息', params);
    this.userSetting = params;
  };

  @action('获取用户 openId') saveUserOpenId = params => {
    console.log('获取用户 openId', params);
    this.userOpenId = params;
  };

  @computed get getUserSetting() {
    return this.userSetting;
  }

  @computed get getUserOpenId() {
    return this.userOpenId;
  }

  @computed get getEnv() {
    return this.env;
  }
}

const userModel = new UserModel();
export default userModel;
