import { Image, ScrollView, Text, View } from "@tarojs/components";
import { inject, observer } from "@tarojs/mobx";
import Taro, { Component, pxTransform } from "@tarojs/taro";
import { ClLoading, ClSearchBar, ClTabs } from "mp-colorui";
import { LOADINGIMG } from "../../utils/model";
import updateData from "../../utils/mpUpdateModel";
import styles from "./index.module.less";
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
        }
        // {
        //   text: "留言",
        //   key: "https://mp-yys-1255362963.cos.ap-chengdu.myqcloud.com/chat.png",
        //   click: ""
        // }
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
      allTag: this.state.allTag
    });
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

  render() {
    const { imgUrl, allTag, staticUrl, statusControl } = this.state;
    const tabHeadersList = imgUrl.map(item => (
      <View
        className={styles.content}
        onClick={this.clickHeader.bind(this, item.click)}
        key={item.key}
      >
        <Image src={item.key} className={styles.img} mode="aspectFit" />
        <Text className={styles.text}>{item.text}</Text>
      </View>
    ));
    const roleTagList = allTag.map((item, index) => (
      <View key={"key-" + index} id={`id${index}`}>
        <ScrollView
          className={styles.scroll}
          scroll-y
          style={{
            height: `calc(100vh - ${pxTransform(400)})`
          }}
        >
          <view>
            <View className={styles.div}>
              {item.showList &&
                item.showList.map((itemI, index1) => (
                  <View
                    className={`${styles.head} shadow`}
                    onClick={this.clikshishen.bind(this, itemI)}
                    key={"key-" + index1}
                  >
                    {itemI.isNew ? (
                      <Image
                        src={staticUrl.new}
                        mode="aspectFit"
                        className={styles.new}
                      />
                    ) : (
                      ""
                    )}
                    <Image
                      src={`${staticUrl.baseUrl}list_head/${itemI.id}.jpg`}
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
      </View>
    ));
    return (
      <ScrollView
        style={{
          height: `100vh`
        }}
      >
        <ClSearchBar
          placeholder="请输入式神名称"
          onSearch={this.search.bind(this)}
          onInput={this.search.bind(this)}
          shape="round"
          searchType="none"
          clear
        />
        <ClLoading
          show={statusControl.showLoading}
          type="image"
          imgUrl={LOADINGIMG}
        />
        <View className={styles.tabs}>
          <ScrollView scroll-x className={styles.scroll}>
            <View className={styles.long}>{tabHeadersList}</View>
          </ScrollView>
        </View>
        <View className={styles.ssr}>
          <View className={styles.body}>
            <ClTabs
              tabs={allTag.map((item, index) => ({
                text: item.text,
                id: `id${index}`
              }))}
              activeColor="blue"
              touchMove
            >
              {roleTagList}
            </ClTabs>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default Index;
