import Taro, { Component, pxTransform } from "@tarojs/taro";
import {
  ClLayout,
  ClLoading,
  ClCard,
  ClFlex,
  ClText,
  ClGrid,
  ClTag
} from "mp-colorui";
import { inject, observer } from "@tarojs/mobx";
import { View, Image } from "@tarojs/components";
import dayjs from "dayjs";
import { LOADINGIMG } from "../../utils/model";

import chartsService from "../../service/charts";
import { getStar, scoreLevel } from "../../utils";
import styles from "./index.module.scss";

@inject("indexModel")
@observer
class ChartsDetail extends Component {
  static option = {
    addGlobalClass: true
  };
  static config = {
    navigationBarTitleText: "个人数据"
  };
  constructor() {
    super(...arguments);
    this.state = {
      loading: true,
      detail: {
        extra: {},
        small_extra: {}
      },
      server: {},
      routerServer: "all",
      starNum: 0
    };
  }
  async componentDidMount() {
    const { id, server, originNum } = this.$router.params;
    const { indexModel } = this.props;
    const res = await chartsService.getChartsDetail({
      server,
      id
    });
    const data = res.result;
    let serverNum = originNum;
    if (!originNum) {
      serverNum = data.extra.bl[0].server;
    }
    const allServer = indexModel.getAllServer;
    const currentServer = allServer.find(item => item.originNum == serverNum);
    this.setState({
      loading: false,
      detail: data,
      server: currentServer,
      routerServer: server,
      starNum: getStar(data.score)
    });
  }

  renderContent(item) {
    return (
      <ClGrid col="2">
        <View>{this.renderEachContent(item, true)}</View>
        <View>{this.renderEachContent(item)}</View>
      </ClGrid>
    );
  }

  renderEachContent(item, self) {
    const { indexModel } = this.props;
    let { battle_list, role_name, score } = item;
    if (!self) {
      battle_list = item.d_battle_list;
      role_name = item.d_role_name;
      score = item.d_score;
    }
    const shishenList = battle_list.slice(-5);
    const bgColor = () => {
      if ((item.battle_result && self) || (!item.battle_result && !self))
        return "light-green";
      else return "light-red";
    };
    return (
      <ClCard type="full" bgColor={bgColor()}>
        <ClFlex direction="column" align="center" justify="center">
          <Image
            src={`${indexModel.baseUrl}compare/head_img/${battle_list[0].shishen_id}.jpg`}
            className={`round ${styles.battle_img}`}
          />
          <ClLayout padding="small" paddingDirection="vertical">
            <ClTag
              tags={[
                {
                  text: role_name,
                  color: "cyan"
                },
                {
                  text: score,
                  color: "olive"
                }
              ]}
            />
          </ClLayout>
          <ClGrid col={5}>
            {shishenList.map((list, index) => (
              <View key={"key" + index}>
                <Image
                  src={`${indexModel.baseUrl}list_head/${list.shishen_id}.jpg`}
                  mode="aspectFit"
                  style={{
                    width: pxTransform(64),
                    maxHeight: pxTransform(64)
                  }}
                />
              </View>
            ))}
          </ClGrid>
        </ClFlex>
      </ClCard>
    );
  }

  render() {
    const { loading, detail, server, routerServer, starNum } = this.state;
    const { indexModel } = this.props;
    const detail_bl = detail.extra.bl
      ? detail.extra.bl.reverse().slice(0, 10)
      : [];
    const battle_time = total_battle_time =>
      total_battle_time > 60
        ? `${parseInt(total_battle_time / 60)}分${total_battle_time % 60}秒`
        : `${total_battle_time}秒`;

    const headerComponent = (
      <ClCard bgColor="gradualBlue">
        <ClFlex align="center">
          <View>
            <Image
              src={`${indexModel.baseUrl}compare/head_img/${detail.small_extra
                .yys_id || 11}.jpg`}
              mode="aspectFit"
              className={styles.avatar}
            />
          </View>
          <View>
            <ClLayout padding="normal" paddingDirection="left">
              <ClText
                text={detail.small_extra.role_name}
                size="xlarge"
                fontWeight="bold"
                textColor="black"
              />
              <ClTag tags={[{ text: server.name, color: "green" }]} />
              <ClTag
                tags={[{ text: scoreLevel(detail.score), color: "red" }]}
              />
            </ClLayout>
          </View>
        </ClFlex>
      </ClCard>
    );

    const infoComponent = (
      <ClGrid col="3">
        <View>
          <ClCard bgColor="light-blue">
            <ClText text={detail.rank} size="small" align="center" />
            <ClText
              text={`${routerServer === "all" ? "全服" : "本服"}排名`}
              size="small"
              align="center"
            />
          </ClCard>
        </View>
        <View>
          <ClCard bgColor="light-orange">
            <ClText text={starNum} size="small" align="center" />
            <ClText text="星级" size="small" align="center" />
          </ClCard>
        </View>
        <View>
          <ClCard bgColor="light-green">
            <ClText text={detail.score} size="small" align="center" />
            <ClText text="积分" size="small" align="center" />
          </ClCard>
        </View>
        <View>
          <ClCard bgColor="light-olive">
            <ClText
              text={detail.small_extra.count_all}
              size="small"
              align="center"
            />
            <ClText text="周场次" size="small" align="center" />
          </ClCard>
        </View>
        <View>
          <ClCard bgColor="light-pink">
            <ClText
              text={detail.small_extra.count_win}
              size="small"
              align="center"
            />
            <ClText text="周胜场" size="small" align="center" />
          </ClCard>
        </View>
        <View>
          <ClCard bgColor="light-red">
            <ClText
              text={`${(
                (detail.small_extra.count_win / detail.small_extra.count_all) *
                100
              ).toFixed(2)}%`}
              size="small"
              align="center"
            />
            <ClText text="周胜率" size="small" align="center" />
          </ClCard>
        </View>
      </ClGrid>
    );

    const listComponent = (
      <ClCard
        title={{
          text: `最近10场战绩（${detail.dt}）`
        }}
        bgColor="light-cyan"
      >
        {detail_bl.map(item => (
          <View key={item.battle_time}>
            <ClLayout margin="small" marginDirection="bottom">
              <View className="radius" style={{ overflow: "hidden" }}>
                <ClText
                  bgColor={item.battle_result ? "olive" : "red"}
                  text={`${item.battle_result ? "胜利" : "失败"}`}
                  align="center"
                />
                <ClCard type="full" bgColor="light-orange">
                  <ClFlex wrap>
                    <ClLayout
                      padding="small"
                      paddingDirection="right"
                      margin="small"
                      marginDirection="bottom"
                    >
                      <ClTag
                        shape="radius"
                        tags={[
                          {
                            text: "总伤害",
                            color: "red"
                          },
                          {
                            text: item.total_damage,
                            plain: true,
                            color: "red"
                          }
                        ]}
                      />
                    </ClLayout>
                    <ClLayout
                      padding="small"
                      paddingDirection="right"
                      margin="small"
                      marginDirection="bottom"
                    >
                      <ClTag
                        shape="radius"
                        tags={[
                          {
                            text: "单次最高伤害",
                            color: "purple"
                          },
                          {
                            text: item.high_damage_show,
                            plain: true,
                            color: "purple"
                          }
                        ]}
                      />
                    </ClLayout>
                    <ClLayout
                      padding="small"
                      paddingDirection="right"
                      margin="small"
                      marginDirection="bottom"
                    >
                      <ClTag
                        shape="radius"
                        tags={[
                          {
                            text: "开始时间"
                          },
                          {
                            text: dayjs(item.battle_time * 1000).format(
                              "YYYY-MM-DD HH:mm"
                            ),
                            plain: true,
                            color: "blue"
                          }
                        ]}
                      />
                    </ClLayout>
                    <ClLayout
                      padding="small"
                      paddingDirection="right"
                      margin="small"
                      marginDirection="bottom"
                    >
                      <ClTag
                        shape="radius"
                        tags={[
                          {
                            text: "战斗用时",
                            color: "orange"
                          },
                          {
                            text: battle_time(item.total_battle_time),
                            plain: true,
                            color: "orange"
                          }
                        ]}
                      />
                    </ClLayout>
                  </ClFlex>
                </ClCard>
                {this.renderContent(item)}
              </View>
            </ClLayout>
          </View>
        ))}
      </ClCard>
    );
    return (
      <ClLayout>
        <ClLoading show={loading} type="image" imgUrl={LOADINGIMG} />
        {headerComponent}
        {infoComponent}
        {listComponent}
      </ClLayout>
    );
  }
}

export default ChartsDetail;
