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
import { AtFloatLayout, AtAccordion, AtTag } from 'taro-ui';
import dayjs from 'dayjs';

import styles from './index.module.less';
import updateData from '../../utils/mpUpdateModel';
import { roleApi, gameApi } from '../../api/index';

import Loading from '../../components/Loading/index';
import FloatButton from '../../components/FloatButton/index';
import SearchBar from '../../components/SearchBar/index';

@inject('indexModel')
@observer
class Index extends Component {
  static options = {
    addGlobalClass: true
  };
  config = {
    navigationBarTitleText: '首页'
  };

  constructor(props) {
    super(props);
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
          text: '御魂',
          key: `${indexModel.baseUrl}yuhun.png`,
          click: 'yuhun'
        },
        {
          text: '游戏更新记',
          key: `${indexModel.baseUrl}eventRecord.png`,
          click: 'updateGame'
        },
        {
          text: '小程序更新记',
          key: `${indexModel.baseUrl}gameCalendar.png`,
          click: 'mpUpdateRecord'
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
      activities: [],
      staticUrl: {
        baseUrl: indexModel.baseUrl,
        new: indexModel.baseUrl + 'new.png'
      },
      statusControl: {
        showLoading: true,
        showVersion: false,
        showFloat: false
      }
    };
  }

  componentWillReact() {
    console.log('componentWillReact');
  }

  async componentDidMount() {
    const resActive = await gameApi('active', {});
    this.setState({
      activities: resActive.result.data.map(item => {
        item.open = false;
        return item;
      })
    });
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
    this.setState(
      {
        statusControl: {
          ...this.state.statusControl,
          showLoading: false
        },
        allTag: this.state.allTag
      },
      () => {
        try {
          const value = Taro.getStorageSync('version');
          if (value !== this.state.currentVersion.version) {
            this.setState({
              statusControl: {
                ...this.state.statusControl,
                showVersion: true
              }
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    );
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  hideVersion() {
    this.setState({
      statusControl: {
        ...this.state.statusControl,
        showVersion: false
      }
    });
    Taro.setStorage({
      key: 'version',
      data: this.state.currentVersion.version
    });
  }

  clikshishen(item) {
    Taro.navigateTo({
      url: `/pages/roleDetail/index?id=${item.id}&level=${item.level}&name=${
        item.name
      }&skins=${JSON.stringify(item.skins)}`
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
    Taro.navigateTo({
      url: `/pages/${clickName}/index`
    });
  }

  clickFloatButton() {
    this.setState({
      statusControl: {
        ...this.state.statusControl,
        showFloat: true
      }
    });
  }

  changeActiveOpen(index) {
    this.setState({
      activities: this.state.activities.map((item, i) => {
        item.open = index === i ? !item.open : false;
        return item;
      })
    });
  }
  closeFloat() {
    this.setState({
      statusControl: {
        ...this.state.statusControl,
        showFloat: false
      }
    });
  }
  search(key) {
    const {indexModel} = this.props;
    this.clickTap(0);
    this.setState({
      allTag: this.state.allTag.map((item, index) => {
        if (index === 0) {
          item.showList = indexModel.allRoles.filter(itemTag =>
            itemTag.name.includes(key)
          );
        }
        return item
      })
    });
  }

  confirmSearch() {}
  render() {
    console.log('render index');
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
        <SearchBar onSearch={this.search} onConfirm={this.confirmSearch} placeholder='请输入式神名称' />
        <AtFloatLayout
          title='最新活动'
          isOpened={this.state.statusControl.showFloat}
          onClose={this.closeFloat}
        >
          {this.state.activities.map((item, index) => (
            <AtAccordion
              key={item.title}
              title={`${item.title}${
                dayjs().isBefore(dayjs(item.time[0]))
                  ? '（※未开始※）'
                  : dayjs().isAfter(dayjs(item.time[1]))
                  ? '（※已结束※）'
                  : '（※进行中※）'
              }`}
              open={item.open}
              onClick={this.changeActiveOpen.bind(this, index)}
            >
              <View className='padding-sm'>
                <AtTag size='small' active type='primary'>
                  活动时间：{item.time[0]}~{item.time[1]}
                </AtTag>
              </View>
              {item.desc.map((desc, descIndex) => (
                <View
                  className='text-sm text-gray text-content'
                  key={descIndex}
                >
                  {desc}
                </View>
              ))}
            </AtAccordion>
          ))}
        </AtFloatLayout>
        {this.state.activities.length > 0 ? (
          <FloatButton
            type='text'
            detail='最新活动'
            onClickButton={this.clickFloatButton}
          />
        ) : (
          ''
        )}
        <Loading show={this.state.statusControl.showLoading} />
        <View className={styles.tabs}>
          <ScrollView scroll-x className={styles.scroll}>
            <View className={styles.long}>{tabHeadersList}</View>
          </ScrollView>
        </View>
        <View className={styles.ssr}>
          <View className={styles.header}>{tagList}</View>
          <View className={styles.body}>
            <Swiper
              className={styles.swiper}
              onChange={this.changeSwiper}
              current={this.state.showIndex}
            >
              {roleTagList}
            </Swiper>
          </View>
        </View>
        <View className={styles.other}>
          <View
            className={`${
              this.state.statusControl.showVersion ? 'show' : ''
            } cu-modal`}
          >
            <View className='cu-dialog'>
              <View className='bg-gradual-blue light'>
                <View className='cu-bar justify-end text-Abc'>
                  <View className='content'>
                    版本更新：{this.state.currentVersion.version}
                  </View>
                  <View className='action' onClick={this.hideVersion}>
                    <Text className='icon-close' />
                  </View>
                </View>
                <View className='padding'>
                  <View>
                    {this.state.currentVersion.desc.map((item, index) => (
                      <View key={index} className='text-sm'>
                        {item}
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              <View className='cu-bar bg-white'>
                <View
                  className='action margin-0 flex-sub solid-left'
                  onClick={this.hideVersion}
                >
                  我知道了
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
