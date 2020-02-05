import Taro, { Component, pxTransform } from "@tarojs/taro";
import { ScrollView, View, Image } from "@tarojs/components";
import {
  ClLayout,
  ClLoading,
  ClCard,
  ClFlex,
  ClText,
  ClSelect
} from "mp-colorui";
import { inject, observer } from "@tarojs/mobx";
import { LOADINGIMG } from "../../utils/model";
import chartsServer from "../../service/charts";
import { chartsDetailRouter } from "../../router";
import { getStar } from "../../utils";

import styles from "./index.module.scss";

@inject("indexModel")
@observer
class Charts extends Component {
  static option = {
    addGlobalClass: true
  };

  static config = {
    navigationBarTitleText: "本周斗技排行"
  };

  constructor() {
    super(...arguments);
    this.state = {
      loading: true,
      server: "all",
      page: 1,
      currentServer: 0,
      allServer: [
        {
          name: "全服",
          num: "all"
        }
      ],
      allCharts: [],
      listLoading: false,
      updateTime: ""
    };
  }

  async componentDidMount() {
    const { server, page } = this.state;
    const { indexModel } = this.props;
    const allServer = await chartsServer.getServerList();
    await this.getCharts(server, page);
    const allServerKeys = Object.keys(allServer);
    this.setState(
      {
        loading: false,
        allServer: [
          {
            name: "全服",
            num: "all"
          }
        ].concat(
          allServerKeys.map(key => ({
            ...allServer[key],
            originNum: key
          }))
        )
      },
      () => {
        indexModel.saveAllServer(this.state.allServer);
      }
    );
  }

  async getCharts(server, page) {
    const { allCharts } = this.state;
    const res = await chartsServer.getChartsList({ server, page });
    const chartsList = res.result;

    this.setState({
      allCharts: [].concat(allCharts, chartsList),
      updateTime: chartsList[0].dt,
      server
    });
  }

  onScrollToLower() {
    const MAX_PAGE = 10;
    let { server, page, listLoading } = this.state;
    page <= 10 &&
      !listLoading &&
      this.setState(
        {
          listLoading: true
        },
        () => {
          if (page < MAX_PAGE) {
            page++;
            this.getCharts(server, page).then(() => {
              this.setState({
                page,
                listLoading: false
              });
            });
          }
        }
      );
  }
  toDetail(id) {
    const { allServer } = this.state;
    const server =
      this.state.server === "all"
        ? allServer[0]
        : allServer.find(item => item.originNum == this.state.server);
    Taro.navigateTo({
      url: chartsDetailRouter(id, server.num, server.originNum)
    });
  }

  renderList(item, indexModel) {
    const color = rank => {
      let currentColor;
      switch (rank) {
        case 1: {
          currentColor = "yellow";
          break;
        }
        case 2: {
          currentColor = "grey";
          break;
        }
        case 3: {
          currentColor = "brown";
          break;
        }
      }
      return currentColor;
    };
    return (
      <View onClick={this.toDetail.bind(this, item.role_id)}>
        <ClCard type="full" active className="solid-bottom">
          <ClFlex align="center">
            <ClLayout padding="small" paddingDirection="right">
              <ClText
                text={item.rank}
                size={item.rank > 3 ? "xxlarge" : "xslarge"}
                textColor={color(item.rank)}
              />
            </ClLayout>
            <ClLayout padding="small" paddingDirection="right">
              <Image
                mode="aspectFit"
                className={`round ${styles.avatar}`}
                src={`${indexModel.baseUrl}compare/head_img/${item.small_extra.yys_id}.jpg`}
              />
            </ClLayout>
            <View style={{ flex: 1 }}>
              <ClText
                text={`${item.small_extra.role_name}`}
                size="large"
                textColor="blue"
                fontWeight="bold"
              />
              <ClFlex>
                <ClLayout padding="small" paddingDirection="right">
                  <ClText
                    text={`总场数：${item.small_extra.count_all}`}
                    size="small"
                    lineSpacing="small"
                  />
                </ClLayout>
                <ClLayout padding="small" paddingDirection="right">
                  <ClText
                    text={`胜场数：${item.small_extra.count_win}`}
                    size="small"
                    lineSpacing="small"
                  />
                </ClLayout>
              </ClFlex>
              <ClFlex>
                <ClLayout padding="small" paddingDirection="right">
                  <ClText
                    text={`胜率：${(
                      (item.small_extra.count_win /
                        item.small_extra.count_all) *
                      100
                    ).toFixed(2)}%`}
                    size="small"
                    lineSpacing="small"
                  />
                </ClLayout>
                <ClText
                  size="small"
                  lineSpacing="small"
                  text={`总积分:${item.score}${
                    item.score > 3000 ? " / 星级：" + getStar(item.score) : ""
                  }`}
                  textColor="red"
                />
              </ClFlex>
            </View>
          </ClFlex>
        </ClCard>
      </View>
    );
  }

  render() {
    const {
      loading,
      allCharts,
      listLoading,
      page,
      updateTime,
      allServer,
      currentServer
    } = this.state;
    const { indexModel } = this.props;
    const listComponent = () => {
      return allCharts.map(item => this.renderList(item, indexModel));
    };
    return (
      <ClLayout>
        <ClLoading show={loading} type="image" imgUrl={LOADINGIMG} />
        <ClSelect
          title="当前服务器"
          mode="selector"
          selector={{
            range: allServer,
            rangeKey: "name",
            value: currentServer
          }}
          onChange={index => {
            this.setState(
              {
                allCharts: [],
                loading: true,
                currentServer: index,
                server: allServer[index].num,
                page: 1
              },
              async () => {
                await this.getCharts(allServer[index].num, 1);
                this.setState({
                  loading: false
                });
              }
            );
          }}
        />

        <ClText
          bgColor="gradualBlue"
          text={`更新日期：${updateTime}`}
          align="center"
        />
        <ScrollView
          style={{ height: `calc(100vh - ${pxTransform(140)})` }}
          scrollY
          onScrollToLower={this.onScrollToLower.bind(this)}
        >
          {listComponent}
          <ClLoading type="line" show={listLoading} noMore={page === 10} />
        </ScrollView>
      </ClLayout>
    );
  }
}

export default Charts;
