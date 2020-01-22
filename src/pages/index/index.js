import {
  Button,
  Image,
  ScrollView,
  Swiper,
  SwiperItem,
  Text,
  View,
  Navigator
} from "@tarojs/components";
import { inject, observer } from "@tarojs/mobx";
import Taro, { Component } from "@tarojs/taro";
import { ClLoading, ClSearchBar } from "mp-colorui";
import StatusBar from "../../components/StatusBar/index";
import { LOADINGIMG } from "../../utils/model";
import updateData from "../../utils/mpUpdateModel";
import styles from "./index.module.less";
import { feedbackRouter } from "../../utils/router";
import partnerService from "../../service/partner";

@inject("indexModel", "userModel")
@observer
class Index extends Component {
  static options = {
    addGlobalClass: true
  };
  static config = {
    navigationBarTitleText: "首页"
  };

  constructor(props) {
    super(props);
    const { indexModel } = this.props;
    this.state = {
      imgUrl: [
        {
          text: "封印悬赏",
          key: `${indexModel.baseUrl}rewardForSeal.png`,
          click: "rewardForSeal"
        },
        {
          text: "逢魔密信",
          key: `${indexModel.baseUrl}fengmo.png`,
          click: "fengmo"
        },
        // {
        //   text: '御魂',
        //   key: `${indexModel.baseUrl}yuhun.png`,
        //   click: 'yuhun'
        // },
        {
          text: "游戏更新记",
          key: `${indexModel.baseUrl}eventRecord.png`,
          click: "updateGame"
        },
        {
          text: "小程序更新记",
          key: `${indexModel.baseUrl}gameCalendar.png`,
          click: "mpUpdateRecord"
        },
        {
          text: "留言",
          key: "https://mp-yys-1255362963.cos.ap-chengdu.myqcloud.com/chat.png",
          click: ""
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
          text: "全部",
          key: "all",
          active: true
        },
        {
          text: "联动",
          key: "interactive"
        },
        {
          text: "SP",
          key: "sp"
        },
        {
          text: "SSR",
          key: "ssr"
        },
        {
          text: "SR",
          key: "sr"
        },
        {
          text: "R",
          key: "r"
        },
        {
          text: "N",
          key: "n"
        },
        {
          text: "呱太",
          key: "material"
        }
      ],
      showIndex: 0,
      currentVersion: updateData[0],
      staticUrl: {
        baseUrl: indexModel.baseUrl,
        new: indexModel.baseUrl + "new.png"
      },
      statusControl: {
        showLoading: true,
        showVersion: false,
        showFloat: false,
        showBack: false
      }
    };
  }

  async componentDidMount() {
    const { indexModel } = this.props;
    const res = await partnerService.getList();
    const data = res;
    indexModel.saveAllRoles(data);
    this.state.allTag = this.state.allTag.map((item, index) => {
      item.active = index === 0;
      const key = `all${item.key === "all" ? "" : item.key}`;
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
          const value = Taro.getStorageSync("version");
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
      key: "version",
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
    clickName &&
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

  closeFloat() {
    this.setState({
      statusControl: {
        ...this.state.statusControl,
        showFloat: false
      }
    });
  }

  search(key) {
    const { indexModel } = this.props;
    this.clickTap(0);
    this.setState({
      allTag: this.state.allTag.map((item, index) => {
        if (index === 0) {
          item.showList = indexModel.allRoles.filter(itemTag =>
            itemTag.name.includes(key)
          );
        }
        return item;
      })
    });
  }

  enterHome() {
    this.setState({
      statusControl: {
        ...this.state.statusControl,
        showBack: false
      }
    });
  }

  watchDetail() {
    this.clickHeader("updateGame");
  }

  clickChat() {
    Taro.navigateTo({
      url: feedbackRouter
    });
  }

  render() {
    const { indexModel } = this.props;
    const floatFeedback = (
      <Navigator
        target="miniProgram"
        appId="wx8abaf00ee8c3202e"
        extraData={{
          id: "62665"
        }}
      >
        <Image
          src="https://mp-yys-1255362963.cos.ap-chengdu.myqcloud.com/chat.png"
          mode="aspectFit"
          className={styles.img}
        />
      </Navigator>
    );
    const tabHeadersList = this.state.imgUrl.map(item => (
      <View
        className={styles.content}
        onClick={this.clickHeader.bind(this, item.click)}
        key={item.key}
      >
        {item.text === "留言" ? (
          floatFeedback
        ) : (
          <Image src={item.key} className={styles.img} mode="aspectFit" />
        )}
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
                      mode="aspectFit"
                      className={styles.new}
                    />
                  ) : (
                    ""
                  )}
                  <Image
                    src={`${this.state.staticUrl.baseUrl}list_head/${itemI.id}.jpg`}
                    mode="aspectFit"
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
      <ScrollView className={styles.indexPage} style={{ height: "100%" }}>
        {this.state.statusControl.showBack ? (
          ""
        ) : (
          <StatusBar content="首页" fontColor="text-black" />
        )}
        {this.state.statusControl.showBack ? (
          <View className={styles.activeBack}>
            <View className={styles.back_btn}>
              <Button
                className="cu-btn margin-right-sm bg-black light shadow"
                onClick={this.enterHome}
              >
                进入首页
              </Button>
              <Button
                className="cu-btn bg-black light shadow"
                onClick={this.watchDetail}
              >
                查看详情
              </Button>
            </View>
          </View>
        ) : (
          <ScrollView
            style={{
              height: `calc(100vh - ${indexModel.CustomBar +
                indexModel.StatusBar}px)`
            }}
          >
            <ClSearchBar
              placeholder="请输入式神名称"
              onSearch={this.search.bind(this)}
              onInput={this.search.bind(this)}
              shape="round"
            />
            <ClLoading
              show={this.state.statusControl.showLoading}
              type="image"
              imgUrl={LOADINGIMG}
            />
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
                  this.state.statusControl.showVersion ? "show" : ""
                } cu-modal`}
              >
                <View className="cu-dialog">
                  <View className="bg-gradual-blue light">
                    <View className="cu-bar justify-end text-Abc">
                      <View className="content">
                        版本更新：{this.state.currentVersion.version}
                      </View>
                      <View className="action" onClick={this.hideVersion}>
                        <Text className="cuIcon-close" />
                      </View>
                    </View>
                    <View className="padding">
                      <View>
                        {this.state.currentVersion.desc.map((item, index) => (
                          <View key={index} className="text-sm">
                            {item}
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                  <View className="cu-bar bg-white">
                    <View
                      className="action margin-0 flex-sub solid-left"
                      onClick={this.hideVersion}
                    >
                      我知道了
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </ScrollView>
    );
  }
}

export default Index;
