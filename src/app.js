import "@tarojs/async-await";
import { Provider, inject } from "@tarojs/mobx";
import Taro, { Component } from "@tarojs/taro";
import "mp-colorui/dist/style/index.scss";
import "./app.less";
import Index from "./pages/index";
import gameModel from "./store/game";
import indexModel from "./store/index";
import rewardForSealModel from "./store/rewardForSeal";
import roleModel from "./store/role";
import userModel from "./store/user";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = {
  indexModel,
  gameModel,
  rewardForSealModel,
  roleModel,
  userModel
};

class App extends Component {
  static config = {
    pages: [
      // 首页
      "pages/index/index",
      // 悬赏封印
      "pages/reward-for-seal/index",
      // 悬赏封印详情
      "pages/reward-for-seal/reward-for-seal-detail/index",
      // 逢魔
      "pages/fengmo/index",
      // 小程序更新
      "pages/mp-update-record/index",
      // 游戏更新
      "pages/update-game/index",
      // 式神详情
      "pages/role-detail/index",
      // 御魂
      "pages/yuhun/index",
      // 神秘图案
      "pages/mystery/index",
      // 斗技排行
      "pages/charts/index"
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#e1e1e1",
      navigationBarTitleText: "痒痒鼠式神录",
      navigationBarTextStyle: "black"
    },
    // tabBar: {
    //   color: '#999',
    //   backgroundColor: '#fafafa',
    //   selectedColor: '#333',
    //   borderStyle: 'white',
    //   list: [
    //     {
    //       text: '首页',
    //       pagePath: 'pages/index/index',
    //       iconPath: './assets/tabs/home.png',
    //       selectedIconPath: './assets/tabs/home-active.png'
    //     },
    //     {
    //       text: '我的',
    //       pagePath: 'pages/my/index',
    //       iconPath: './assets/tabs/my.png',
    //       selectedIconPath: './assets/tabs/my-active.png'
    //     }
    //   ],
    //   position: 'bottom'
    // },
    cloud: true
  };

  componentDidMount() {
    // 获取用户授权信息
    Taro.getSetting({
      success: e => {
        const authSetting = e.authSetting;
        userModel.saveUserSetting(authSetting);
      }
    });
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById("app"));
