import { Image, ScrollView, Text, View } from "@tarojs/components";
import { inject, observer } from "@tarojs/mobx";
import Taro, { Component, pxTransform } from "@tarojs/taro";
import {
  ClLoading,
  ClSearchBar,
  ClTabs,
  ClTabBar,
  ClLayout,
  ClCard,
  ClFlex,
  ClText,
  ClTitleBar
} from "mp-colorui";
import { LOADINGIMG } from "../../utils/model";
import updateData from "../../utils/mpUpdateModel";
import styles from "./index.module.less";
import partnerService from "../../service/partner";
import ShowDOM from "../../components/ShowDOM";

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
      toolAction: [
        {
          title: "资料查询",
          children: [
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
            {
              text: "御魂查询",
              key: `${indexModel.baseUrl}yuhun.png`,
              click: "yuhun"
              // },
              // {
              //   text: "神秘图案查询",
              //   key: `${indexModel.baseUrl}mystery.png`,
              //   click: "mystery"
            }
          ]
        },
        // {
        //   title: "斗技阵容",
        //   children: [
        //     {
        //       text: "对弈竞猜",
        //       key: `${indexModel.baseUrl}zhenrong.png`,
        //       click: "compare"
        //     },
        //     {
        //       text: "斗技排行",
        //       key: `${indexModel.baseUrl}theProtagonistRecord.png`,
        //       click: "charts"
        //     },
        //     {
        //       text: "斗技阵容",
        //       key: `${indexModel.baseUrl}openServicePlan.png`,
        //       click: "battleArray"
        //     }
        //   ]
        // },
        {
          title: "更新记录",
          children: [
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
          ]
        }
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
      },
      activeTab: 0,
      showIndex: 0
    };
  }

  async componentDidMount() {
    this.checkVersion();
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

  checkVersion() {
    if (
      Taro.getEnv() !== Taro.ENV_TYPE.WEB &&
      Taro.canIUse("getUpdateManager")
    ) {
      let updateManager = Taro.getUpdateManager();
      updateManager.onCheckForUpdate(res => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            Taro.showModal({
              title: "更新提示",
              content: "有新版本，是否重启应用？",
              success: ress => {
                if (ress.confirm) {
                  updateManager.applyUpdate();
                } else if (ress.cancel) {
                  return false;
                }
              }
            });
          });
          updateManager.onUpdateFailed(() => {
            Taro.hideLoading();
            Taro.showModal({
              title: "更新失败",
              content: "新版本更新失败，请检查网络",
              showCancel: false
            });
          });
        }
      });
    }
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
      allTag: this.state.allTag,
      showIndex: 0
    });
  }

  // 点击各种工具，进行页面跳转
  clickHeader(clickName) {
    Taro.navigateTo({
      url: `/pages/${clickName}/index`
    });
  }

  // 搜索式神
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

  watchDetail() {
    this.clickHeader("updateGame");
  }

  render() {
    const {
      allTag,
      staticUrl,
      statusControl,
      activeTab,
      showIndex,
      toolAction
    } = this.state;

    // 式神角色
    const roleTagList = allTag.map((item, index) => (
      <View key={"key-" + index} id={`id${index}`} className={styles.content}>
        <ScrollView
          className={styles.scroll}
          scroll-y
          style={{
            height: `calc(100vh - ${pxTransform(280)})`
          }}
        >
          <View className={styles.singleSS}>
            {item.showList &&
              item.showList.map((itemI, index1) => (
                <View key={"key-" + index1}>
                  <View
                    className={`${styles.head} shadow`}
                    onClick={this.clikshishen.bind(this, itemI)}
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
                </View>
              ))}
          </View>
        </ScrollView>
      </View>
    ));

    // 式神列表
    const tabSS = (
      <View>
        <ClSearchBar
          placeholder="请输入式神名称"
          onSearch={this.search.bind(this)}
          onInput={this.search.bind(this)}
          onClear={this.search.bind(this, "")}
          shape="round"
          searchType="none"
          clear
        />
        <ClLoading
          show={statusControl.showLoading}
          type="image"
          imgUrl={LOADINGIMG}
        />
        <View className={styles.ssr}>
          <View className={styles.body}>
            <ClTabs
              tabs={allTag.map((item, index) => ({
                text: item.text,
                id: `id${index}`
              }))}
              activeColor="blue"
              touchMove
              active={showIndex}
              onClick={index => {
                this.setState({
                  showIndex: index
                });
              }}
            >
              {roleTagList}
            </ClTabs>
          </View>
        </View>
      </View>
    );

    // 工具列表
    const toolActionComponent = toolAction.map((item, index) => (
      <View key={"key-" + index}>
        <ClCard>
          <ClTitleBar
            title={item.title}
            textColor="white"
            borderColor="white"
            bgColor="grey"
          />
          <ClFlex wrap className={styles.scroll}>
            {item.children.map((child, indexChild) => (
              <View className={styles.long} key={"key-" + indexChild}>
                <View
                  className={styles.content}
                  onClick={this.clickHeader.bind(this, child.click)}
                  key={child.key}
                >
                  <Image
                    src={child.key}
                    className={styles.img}
                    mode="aspectFit"
                  />
                  <ClLayout padding="xsmall" paddingDirection="vertical">
                    <ClText size="small" text={child.text} />
                  </ClLayout>
                </View>
              </View>
            ))}
          </ClFlex>
        </ClCard>
      </View>
    ));
    return (
      <View>
        <ScrollView
          scrollY
          style={{
            height: `calc(100vh - ${pxTransform(120)})`
          }}
        >
          <ShowDOM show={activeTab === 0}>{tabSS}</ShowDOM>
          <ShowDOM show={activeTab === 1}>{toolActionComponent}</ShowDOM>
        </ScrollView>
        <ClTabBar
          fix
          tabs={[
            {
              icon: "likefill",
              title: "崽崽们",
              badge: false
            },
            {
              icon: "searchlist",
              title: "工具集",
              badge: false
            }
          ]}
          bgColor="gray"
          onClick={index => {
            this.setState({
              activeTab: index
            });
          }}
        />
      </View>
    );
  }
}

export default Index;
