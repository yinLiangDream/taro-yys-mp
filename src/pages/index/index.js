import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Text,
  ScrollView,
  Image,
  Swiper,
  SwiperItem
} from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import styles from './index.module.less';
import updateData from '../../utils/mpUpdateModel';
import { roleApi } from '../../api/index';

import Loading from '../../components/Loading';

@inject('indexModel')
@observer
class Index extends Component {
  static options = {
    addGlobalClass: true
  };
  static config = {
    navigationBarTitleText: '首页'
  };

  constructor() {
    const { indexModel } = this.props;
    this.state = {
      imgUrl: [
        {
          text: '封印悬赏',
          key: `${indexModel.baseUrl}rewardForSeal.png`,
          click: 'rewardForSeal'
        },
        {
          text: '逢魔密信',
          key: `${indexModel.baseUrl}fengmo.png`,
          click: 'fengmo'
        },
        {
          text: '游戏更新记',
          key: `${indexModel.baseUrl}eventRecord.png`,
          click: 'updateGame'
        },
        {
          text: '小程序更新记',
          key: `${indexModel.baseUrl}gameCalendar.png`,
          click: 'mpUpdate'
        }
        // {
        //   text: '主角录',
        //   key: '/static/headerTabs/theProtagonistRecord.png'
        // },
        // {
        //   text: '开服计划',
        //   key: '/static/headerTabs/openServicePlan.png'
        // },
        // {
        //   text: '同人赏',
        //   key: '/static/headerTabs/peopleEnjoy.png'
        // }
      ],
      allTag: [
        {
          text: '全部',
          key: 'all',
          active: true
        },
        {
          text: '联动',
          key: 'interactive'
        },
        {
          text: 'SP',
          key: 'sp'
        },
        {
          text: 'SSR',
          key: 'ssr'
        },
        {
          text: 'SR',
          key: 'sr'
        },
        {
          text: 'R',
          key: 'r'
        },
        {
          text: 'N',
          key: 'n'
        },
        {
          text: '呱太',
          key: 'material'
        }
      ],
      showIndex: 0,
      currentVersion: updateData[0],
      staticUrl: {
        baseUrl: indexModel.baseUrl,
        new: indexModel.baseUrl + 'new.png'
      },
      statusControl: {
        showLoading: true,
        showVersion: false
      }
    };
  }

  componentWillMount() {}

  componentWillReact() {
    console.log('componentWillReact');
  }

  async componentDidMount() {
    const { indexModel } = this.props;
    const res = await roleApi('list', {});
    const data = res.result.data;
    indexModel.saveAllRoles(data);
    this.state.allTag = this.state.allTag.map((item, index) => {
      item.active = index === 0;
      const key = `all${item.key === 'all' ? '' : item.key}`;
      item.showList = indexModel[key];
      return item;
    });
    this.clickTap(0);
    this.setState({
      statusControl: {
        showLoading: false
      },
      allTag: this.state.allTag
    });
    try {
      const value = wx.getStorageSync('version');
      if (value !== this.state.currentVersion.version) {
        this.setState({
          statusControl: {
            showVersion: true
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  hideVersion() {
    this.setState({
      statusControl: {
        showVersion: false
      }
    });
    wx.setStorage({
      key: 'version',
      data: this.state.currentVersion.version
    });
  }

  mpUpdate() {
    wx.navigateTo({
      url: '/pages/mpUpdateRecord/main'
    });
  }

  rewardForSeal() {
    wx.navigateTo({
      url: '/pages/rewardForSeal/main'
    });
  }

  clikshishen(item) {
    wx.navigateTo({
      url: `/pages/roleDetail/main?id=${item.id}&level=${item.level}&name=${
        item.name
      }`
    });
  }

  fengmo() {
    wx.navigateTo({
      url: '/pages/fengmo/main'
    });
  }

  updateGame() {
    wx.navigateTo({
      url: '/pages/updateGame/main'
    });
  }

  clickTap(thisIndex) {
    this.state.allTag.forEach((item, index) => {
      item.active = index === thisIndex;
    });
    this.setState({
      showIndex: thisIndex,
      allTag: this.state.allTag
    });
  }

  changeSwiper(e) {
    const index = e.detail.current;
    this.clickTap(index);
  }

  clickHeader(clickName) {
    this[clickName]();
  }

  render() {
    const tabHeadersList = this.state.imgUrl.map(item => (
      <View
        className={styles.content}
        onClick={this.clickHeader.bind(this, item.click)}
        key={item.key}
      >
        <Image src={item.key} className={styles.img} mode='aspectFit' />
        <Text className={styles.text}>{item.text}</Text>
      </View>
    ));
    const tagList = this.state.allTag.map((item, index) => (
      <View
        key={item.key}
        className={item.active === true ? styles.active : styles.noActive}
        onClick={this.clickTap.bind(this, index)}
      >
        {item.text}
      </View>
    ));
    const roleTagList = this.state.allTag.map((item, index) => (
      <SwiperItem className={styles.swiperItem} key={index}>
        <ScrollView className={styles.scroll} scroll-y>
          <view>
            <View className={styles.div}>
              {item.showList.map((itemI, index1) => (
                <View
                  className={`${styles.head} shadow`}
                  onClick={this.clikshishen.bind(this, itemI)}
                  key={index1}
                >
                  {itemI.isNew ? (
                    <Image
                      src={this.state.staticUrl.new}
                      mode='aspectFit'
                      className={styles.new}
                    />
                  ) : (
                    ''
                  )}
                  <Image
                    src={`${this.state.staticUrl.baseUrl}list_head/${
                      itemI.id
                    }.jpg`}
                    mode='aspectFit'
                    className={styles.img}
                    lazyLoad
                  />
                  <Text className={styles.text}>{itemI.name}</Text>
                </View>
              ))}
            </View>
          </view>
        </ScrollView>
      </SwiperItem>
    ));
    return (
      <View className={styles.indexPage}>
        <Loading show={this.state.statusControl.showLoading} />
        <View className={styles.tabs}>
          <ScrollView scroll-x className={styles.scroll}>
            <View className={styles.long}>{tabHeadersList}</View>
          </ScrollView>
        </View>
        <View className={styles.ssr}>
          <View className={styles.header}>{tagList}</View>
          <View className={styles.body}>
            <Swiper className={styles.swiper} onChange={this.changeSwiper} current={this.state.showIndex}>{roleTagList}</Swiper>
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
