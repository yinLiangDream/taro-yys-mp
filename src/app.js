import Taro, { Component } from '@tarojs/taro';
import { Provider } from '@tarojs/mobx';
import '@tarojs/async-await'
import 'taro-ui/dist/style/index.scss'

import Index from './pages/index';

import indexModel from './store/index';
import gameModel from './store/game';
import rewardForSealModel from './store/rewardForSeal'

import './app.less';

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = {
  indexModel,
  gameModel,
  rewardForSealModel
};

class App extends Component {
  config = {
    pages: [
      'pages/index/index',
      'pages/my/index',
      'pages/rewardForSeal/index',
      'pages/rewardForSeal/rewardForSealDetail/index',
      'pages/fengmo/index',
      'pages/mpUpdateRecord/index',
      'pages/updateGame/index',
      'pages/roleDetail/index',
      'pages/yuhun/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '痒痒鼠式神录',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: '#999',
      backgroundColor: '#fafafa',
      selectedColor: '#333',
      borderStyle: 'white',
      list: [
        {
          text: '首页',
          pagePath: 'pages/index/index',
          iconPath: './assets/tabs/home.png',
          selectedIconPath: './assets/tabs/home-active.png'
        },
        {
          text: '我的',
          pagePath: 'pages/my/index',
          iconPath: './assets/tabs/my.png',
          selectedIconPath: './assets/tabs/my-active.png'
        }
      ],
      position: 'bottom'
    },
    cloud: true
  };

  componentDidMount() {}

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

Taro.render(<App />, document.getElementById('app'));
