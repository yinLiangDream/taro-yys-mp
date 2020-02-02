import Taro, { Component, pxTransform } from "@tarojs/taro";
import { View, Image, ScrollView } from "@tarojs/components";
import {
  ClLayout,
  ClTabs,
  ClCard,
  ClFlex,
  ClText,
  ClLoading
} from "mp-colorui";
import { inject, observer } from "@tarojs/mobx";

import yuhunService from "../../service/yuhun";
import { LOADINGIMG } from "../../utils/model";

import styles from "./index.module.scss";

@inject("indexModel")
@observer
class YunHun extends Component {
  static options = {
    addGlobalClass: true
  };

  static config = {
    navigationBarTitleText: "御魂查询"
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      tabs: [
        {
          text: "全部",
          id: "all"
        },
        {
          text: "首领御魂",
          id: "leader"
        },
        {
          text: "攻击加成",
          id: "attack"
        },
        {
          text: "防御加成",
          id: "defense"
        },
        {
          text: "暴击加成",
          id: "critRate"
        },
        {
          text: "生命加成",
          id: "maxHp"
        },
        {
          text: "效果命中",
          id: "debuffEnhance"
        },
        {
          text: "效果抵抗",
          id: "debuffResist"
        }
      ]
    };
  }

  async componentDidMount() {
    const allData = await yuhunService.getYuhun();
    const { tabs } = this.state;
    tabs.forEach(item => {
      item.data =
        item.id === "all"
          ? allData
          : allData.filter(yuhun => yuhun.category === item.id);
    });
    this.setState({
      tabs: [...tabs],
      loading: false
    });
  }

  render() {
    const { tabs, loading } = this.state;
    const { indexModel } = this.props;

    const tabsComponent = tabs.map(item => (
      <View key={item.id} id={item.id} className={styles.content}>
        <ScrollView
          scroll-y
          style={{
            height: `calc(100vh - ${pxTransform(100)})`,
            paddingTop: pxTransform(20)
          }}
        >
          {item.data &&
            item.data.map(detail => (
              <View key={detail.english}>
                <ClCard>
                  <ClFlex>
                    <View>
                      <Image
                        src={`${indexModel.baseUrl}/yuhun/yuhun_icon/${detail.name}.png`}
                        mode="widthFix"
                        style={{
                          width: pxTransform(150)
                        }}
                      />
                      <ClText align="center" text={detail.name} size="large" />
                    </View>
                    <View style={{ margin: "auto 0" }}>
                      {detail.category === "leader" ? (
                        <ClFlex direction="column" justify="center">
                          <ClLayout padding="normal">
                            <ClText text={`效果：${detail.fullDesc}`} />
                          </ClLayout>
                        </ClFlex>
                      ) : (
                        <ClFlex direction="column">
                          <ClLayout padding="normal">
                            <ClText
                              text={`二件套：${
                                tabs.find(tab => tab.id === item.id).text
                              } ${detail.baseDesc}`}
                            />
                          </ClLayout>
                          <ClLayout padding="normal">
                            <ClText text={`四件套：${detail.fullDesc}`} />
                          </ClLayout>
                        </ClFlex>
                      )}
                    </View>
                  </ClFlex>
                </ClCard>
              </View>
            ))}
        </ScrollView>
      </View>
    ));
    return (
      <ClLayout>
        <ClLoading show={loading} type="image" imgUrl={LOADINGIMG} />
        <ClTabs tabs={tabs} activeColor="blue" touchMove>
          {tabsComponent}
        </ClTabs>
      </ClLayout>
    );
  }
}

export default YunHun;
