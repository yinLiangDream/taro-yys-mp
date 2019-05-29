import Taro, { Component, pxTransform } from '@tarojs/taro';
import { View, ScrollView, Block } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import {
  ClTabs,
  ClCard,
  ClAvatar,
  ClLayout,
  ClTag,
  ClText,
  ClLoading,
  ClButton,
  ClModal,
  ClProgress
} from 'mp-colorui';
import { gameApi } from '../../api/index';
import { getData, updateData, addData } from '../../api/db';

import StatusBar from '../../components/StatusBar';
import { LOADINGIMG, attrRoleKey } from '../../utils/model';

let time = null;
const COLLECTION = 'mockYuhun';
let doc = '';

const baseRate = [10, 3];
const specialRate = [14, 5];
const baseData = {
  [attrRoleKey.ATTACK]: [81, 27],
  [attrRoleKey.ATTACKRATE]: baseRate,
  [attrRoleKey.CRITPOWER]: specialRate,
  [attrRoleKey.CRITRATE]: baseRate,
  [attrRoleKey.DEBUFFENHANCE]: baseRate,
  [attrRoleKey.DEBUFFRESIST]: baseRate,
  [attrRoleKey.DEFENSE]: [14, 6],
  [attrRoleKey.DEFENSERATE]: baseRate,
  [attrRoleKey.MAXHP]: [342, 114],
  [attrRoleKey.MAXHPRATE]: baseRate,
  [attrRoleKey.SPEED]: [12, 3]
};
const updateRate = num => () => Math.round(Math.random()) + num - 1;
const secondData = {
  [attrRoleKey.ATTACK]: [26, updateRate(26)],
  [attrRoleKey.ATTACKRATE]: [3, updateRate(3)],
  [attrRoleKey.CRITPOWER]: [4, updateRate(4)],
  [attrRoleKey.CRITRATE]: [3, updateRate(3)],
  [attrRoleKey.DEBUFFENHANCE]: [4, updateRate(4)],
  [attrRoleKey.DEBUFFRESIST]: [4, updateRate(4)],
  [attrRoleKey.DEFENSE]: [5, updateRate(5)],
  [attrRoleKey.DEFENSERATE]: [3, updateRate(3)],
  [attrRoleKey.MAXHP]: [108, updateRate(108)],
  [attrRoleKey.MAXHPRATE]: [3, updateRate(3)],
  [attrRoleKey.SPEED]: [3, updateRate(3)]
};
const normalAttr = [
  [attrRoleKey.ATTACK],
  [
    attrRoleKey.SPEED,
    attrRoleKey.ATTACKRATE,
    attrRoleKey.DEFENSERATE,
    attrRoleKey.MAXHPRATE
  ],
  [attrRoleKey.DEFENSE],
  [
    attrRoleKey.DEBUFFENHANCE,
    attrRoleKey.DEBUFFRESIST,
    attrRoleKey.ATTACKRATE,
    attrRoleKey.MAXHPRATE,
    attrRoleKey.DEFENSERATE
  ],
  [attrRoleKey.MAXHP],
  [
    attrRoleKey.CRITPOWER,
    attrRoleKey.CRITRATE,
    attrRoleKey.ATTACKRATE,
    attrRoleKey.MAXHPRATE,
    attrRoleKey.DEFENSERATE
  ]
];

const specialNormalAttr = [
  attrRoleKey.SPEED,
  attrRoleKey.DEBUFFRESIST,
  attrRoleKey.DEBUFFENHANCE,
  attrRoleKey.CRITPOWER,
  attrRoleKey.CRITRATE
];

const secondAttrAttack = [
  attrRoleKey.ATTACK,
  attrRoleKey.ATTACKRATE,
  attrRoleKey.CRITPOWER,
  attrRoleKey.CRITRATE
];
const secondAttrDefense = [
  attrRoleKey.MAXHP,
  attrRoleKey.MAXHPRATE,
  attrRoleKey.DEFENSE,
  attrRoleKey.DEFENSERATE
];
const secondAttrFunction = [
  attrRoleKey.SPEED,
  attrRoleKey.DEBUFFENHANCE,
  attrRoleKey.DEBUFFRESIST
];

@inject('gameModel', 'indexModel', 'userModel')
@observer
class Yuhun extends Component {
  config = {
    navigationBarTitleText: '御魂'
  };
  constructor(props) {
    super(props);
    const { indexModel } = this.props;
    const baseAttrMap = Object.assign(
      {
        [attrRoleKey.ATTACKRATE]: '攻击加成',
        [attrRoleKey.DEFENSERATE]: '防御加成',
        [attrRoleKey.MAXHPRATE]: '生命加成'
      },
      indexModel.getAttrRoleMap
    );
    const rateAttr = [
      baseAttrMap[attrRoleKey.ATTACKRATE],
      baseAttrMap[attrRoleKey.CRITPOWER],
      baseAttrMap[attrRoleKey.CRITRATE],
      baseAttrMap[attrRoleKey.DEBUFFENHANCE],
      baseAttrMap[attrRoleKey.DEBUFFRESIST],
      baseAttrMap[attrRoleKey.DEFENSERATE],
      baseAttrMap[attrRoleKey.MAXHPRATE]
    ];
    this.state = {
      current: 0,
      scroll: 0,
      powerModalTitle: '',
      powerModalUrl: '',
      activeTab: 0,
      percent: 0,
      times: 50,
      rateAttr,
      baseAttrMap,
      yuhunDetail: [
        {
          main: {
            key: '攻击',
            value: [81],
            yuhunLevel: 0,
            position: 1,
            id: +new Date()
          },
          other: []
        }
      ],
      powerTabs: ['一', '二', '三', '四', '五', '六'],
      tabList: [
        {
          title: '攻击类',
          data: []
        },
        {
          title: '暴击类',
          data: []
        },
        {
          title: '防御类',
          data: []
        },
        {
          title: '生命类',
          data: []
        },
        {
          title: '效果类',
          data: []
        }
      ],
      statusControl: {
        showLoading: false,
        showPowerModal: false,
        showStore: false
      }
    };
  }

  async componentDidMount() {
    const { gameModel } = this.props;
    this.setState(
      {
        statusControl: {
          ...this.state.statusControl,
          showLoading: true
        }
      },
      async () => {
        let data = [];
        if (gameModel.yuhunInfo.length === 0) {
          const res = await gameApi('yuhun', {});
          gameModel.saveAllYuhun(res.result.data);
          data = res.result.data;
        } else data = gameModel.yuhunInfo;
        data.forEach(item => {
          this.state.tabList
            .find(tab => tab.title === item['御魂类型'])
            .data.push(item);
        });
        this.setState({
          tabList: this.state.tabList,
          statusControl: {
            ...this.state.statusControl,
            showLoading: false
          }
        });
      }
    );
    /**
     * 初始化次数
     */
    this.getYuhun().then(async () => {
      const date = new Date().toLocaleDateString();
      const data = await getData.doc(COLLECTION, doc);
      let times = this.state.times;
      if (data.data.date === date) {
        times = data.data.times;
      } else {
        await updateData.doc(COLLECTION, doc, {
          date
        });
      }
      console.log(times);
      this.setState({
        times
      });
      console.log(data.data);
    });
    this.initYuhunData();
  }
  clickTitle(index) {
    this.setState({
      current: index,
      scroll: Math.random()
    });
  }
  /**
   * 点击强化弹出强化界面
   * @param {*} name
   * @param {*} url
   */
  powerYuhun(name, url) {
    this.setState({
      powerModalTitle: name,
      powerModalUrl: url,
      statusControl: {
        ...this.state.statusControl,
        showPowerModal: true
      }
    });
  }
  /**
   * 弃置御魂
   * @param {*} index
   */
  resetYuhun(index) {
    const yuhunDetail = {};
    const normalRandom = () => {
      const normalIndex = index + 1;
      const attr =
        [1, 3, 5].indexOf(normalIndex) >= 0
          ? normalAttr[index][0]
          : this.randomRate(index);
      return {
        key: this.state.baseAttrMap[attr],
        value: baseData[attr],
        origin: attr,
        yuhunLevel: 0,
        position: normalIndex,
        id: +new Date()
      };
    };
    yuhunDetail.main = normalRandom();
    yuhunDetail.other = [];
    // 确定副属性数量
    const lines = this.lines();
    // 确定该副属性
    let i = 0;
    while (i < lines) {
      // 确定该属性
      const secondAttr = this.randomAttr(this.secondYuhunType());
      if (
        yuhunDetail.other.find(
          item => item.key === this.state.baseAttrMap[secondAttr]
        )
      )
        continue;
      yuhunDetail.other.push({
        key: this.state.baseAttrMap[secondAttr],
        value: secondData[secondAttr],
        origin: secondAttr,
        power: 0
      });
      i++;
    }
    return yuhunDetail;
  }
  /**
   * 确定副属性类型
   */
  secondYuhunType() {
    const rate = Math.random();
    if (rate < 0.36) return secondAttrAttack;
    if (rate > 0.72) return secondAttrDefense;
    return secondAttrFunction;
  }
  /**
   * 确定副属性条数
   */
  lines() {
    const linesRate = Math.random();
    if (linesRate < 0.33) return 2;
    if (linesRate > 0.66) return 3;
    return 4;
  }
  /**
   * 随机主属性
   * @param {Number} index
   */
  randomRate(index) {
    const normalIndex = index + 1;
    const normalSpecialRate = 0.1;
    const normal = [
      attrRoleKey.ATTACKRATE,
      attrRoleKey.MAXHPRATE,
      attrRoleKey.DEFENSERATE
    ];
    const twoAttrSpecial = [attrRoleKey.SPEED];
    const fourAttrSpecial = [
      attrRoleKey.DEBUFFENHANCE,
      attrRoleKey.DEBUFFRESIST
    ];
    const sixAttrSpecial = [attrRoleKey.CRITPOWER, attrRoleKey.CRITRATE];
    const RATE = Math.random();
    const getSpecialAttr = () => {
      if (normalIndex === 2) return this.randomAttr(twoAttrSpecial);
      if (normalIndex === 4) return this.randomAttr(fourAttrSpecial);
      if (normalIndex === 6) return this.randomAttr(sixAttrSpecial);
    };
    const getNormalAttr = () => {
      return this.randomAttr(normal);
    };
    if (RATE <= normalSpecialRate) return getSpecialAttr();
    else return getNormalAttr();
  }
  /**
   * 随机剩余属性
   */
  randomAttr(attr) {
    const len = attr.length;
    if (len <= 1) return attr[0];
    return attr[Math.floor(Math.random() * len)];
  }
  /**
   * 初始化御魂
   */
  initYuhunData() {
    let i = 0;
    const newDetail = [];
    while (i < 6) {
      const data = this.resetYuhun(i);
      newDetail.push(data);
      i++;
    }
    this.setState({
      yuhunDetail: newDetail
    });
  }
  /**
   * 点击强化或弃置
   * @param {*} index
   */
  clickPower(index) {
    if (time) return;
    function setPercent() {
      this.setState({
        percent: this.state.percent + 50
      });
    }
    const level = this.state.yuhunDetail[this.state.activeTab].main.yuhunLevel;
    if (index === 1) {
      time = setInterval(() => {
        if (level === 15) {
          this.setState({
            percent: 100
          });
          clearInterval(time);
          return;
        }
        if (this.state.percent > 100) {
          this.setState(
            {
              percent: level + 1 === 15 ? 100 : 0
            },
            () => {
              this.powerYuhunLevel();
              clearInterval(time);
              time = null;
            }
          );
        } else {
          setPercent.call(this);
        }
      }, 200);
    } else {
      if (this.state.times === 0) {
        Taro.showToast({
          title: '已无弃置次数',
          icon: 'none'
        });
        return;
      }
      const yuhunDetail = this.state.yuhunDetail;
      yuhunDetail[this.state.activeTab] = this.resetYuhun(this.state.activeTab);
      let times = this.state.times - 1;
      updateData.doc(COLLECTION, doc, {
        times
      });
      this.setState({
        percent: 0,
        yuhunDetail,
        times
      });
    }
  }
  /**
   * 强化御魂属性
   */
  powerYuhunLevel() {
    const yuhunDetail = this.state.yuhunDetail;
    const curData = yuhunDetail[this.state.activeTab];
    // 升级主属性
    const mainValue = curData.main.value.reduce((prev, cur) => prev + cur, 0);
    curData.main.value[0] = mainValue;
    curData.main.yuhunLevel++;
    // 升级副属性
    const level = curData.main.yuhunLevel;
    if (level % 3 === 0) {
      curData.other = this.powerSecondAttr();
    }
    yuhunDetail[this.state.activeTab] = curData;
    this.setState({
      yuhunDetail
    });
  }
  /**
   * 强化副属性
   */
  powerSecondAttr() {
    const curData = this.state.yuhunDetail[this.state.activeTab];
    const attrLength = curData.other.length;
    const rate = Math.random();
    const powers = curData.other.map(item => item.power);
    const all = powers.reduce((prev, cur) => prev + cur) + 4;
    let i = 0;
    while (i < 4) {
      const base =
        powers.slice(0, i + 1).reduce((prev, cur) => prev + cur) + i + 1;
      if (rate < base / all) {
        if (i + 1 > attrLength) {
          let filterAttr = this.secondYuhunType();
          for (let item of curData.other) {
            filterAttr = filterAttr.filter(second => second !== item.origin);
          }
          const attr = this.randomAttr(filterAttr);
          curData.other.push({
            key: this.state.baseAttrMap[attr],
            value: secondData[attr],
            origin: attr,
            power: 0
          });
        } else {
          const other = curData.other.map((item, index) => ({
            key: item.key,
            value:
              index === i
                ? [item.value[0] + item.value[1](), item.value[1]]
                : item.value,
            origin: item.origin,
            power: item.power + 1
          }));
          curData.other = other;
        }
        break;
      }
      i++;
    }
    return curData.other;
  }
  clickTab(index) {
    this.setState({
      activeTab: index
    });
  }
  /**
   * 获取御魂存储信息并初始化
   */
  async getYuhun() {
    const { userModel } = this.props;
    const res = await getData.collectionWhere(COLLECTION, {
      _openid: userModel.getUserOpenId
    });
    let hasYuhun = [];
    if (res.data.length === 0) {
      const data = await addData.collection(COLLECTION, {
        yuhun: []
      });
      doc = data._id;
    } else {
      doc = res.data[0]._id;
      hasYuhun = res.data[0].yuhun;
    }
    return hasYuhun;
  }
  /**
   * 保存御魂
   */
  async saveYuhun() {
    const yuhunDetail = this.state.yuhunDetail[this.state.activeTab];
    if (yuhunDetail.main.yuhunLevel !== 15) {
      Taro.showToast({
        title: '只有满级御魂才能进行收藏',
        icon: 'none'
      });
      return;
    }
    const hasYuhun = await this.getYuhun();
    const yuhunSavedIndex = hasYuhun.findIndex(
      item => item.main.id === yuhunDetail.main.id
    );
    if (yuhunSavedIndex >= 0) {
      hasYuhun[yuhunSavedIndex] = yuhunDetail;
    } else {
      hasYuhun.push(yuhunDetail);
    }
    updateData.doc(COLLECTION, doc, {
      yuhun: hasYuhun
    });
    Taro.showToast({
      title: '收藏到云端成功（御魂仓库功能正在开发中）',
      icon: 'success'
    });
  }
  // TODO 御魂仓库
  showStore() {}
  render() {
    const { indexModel } = this.props;
    const tabs = this.state.tabList.map(item => {
      item.text = item.title;
      return item;
    });
    const current = this.state.current;
    const cards = tabs[current].data.map((yuhun, index) => (
      <Block key={index}>
        <ClCard bgColor='light-gray'>
          <View>
            <ClLayout
              type='flex'
              flexSelection={{
                align: 'center'
              }}
            >
              <View style={{ marginRight: pxTransform(20) }}>
                <ClLayout type='flex' flexSelection={{ justify: 'center' }}>
                  <ClAvatar
                    headerArray={[
                      {
                        url: `${indexModel.baseUrl}yuhun_icon/${
                          yuhun['御魂图标']
                        }`
                      }
                    ]}
                    shadow
                    shape='round'
                    size='large'
                  />
                </ClLayout>
                <ClLayout type='flex' flexSelection={{ justify: 'center' }}>{`${
                  yuhun['御魂名称']
                }`}</ClLayout>
                <ClLayout type='flex' flexSelection={{ justify: 'center' }}>
                  <ClButton
                    bgColor='light-blue'
                    size='small'
                    shape='round'
                    onClick={this.powerYuhun.bind(
                      this,
                      yuhun['御魂名称'],
                      `${indexModel.baseUrl}yuhun_icon/${yuhun['御魂图标']}`
                    )}
                  >
                    强化
                  </ClButton>
                </ClLayout>
              </View>
              <View>
                <ClLayout
                  type='flex'
                  flexSelection={{
                    align: 'center',
                    warp: true
                  }}
                >
                  <View style={{ width: '100%', margin: pxTransform(10) }}>
                    <ClLayout
                      type='flex'
                      flexSelection={{
                        align: 'center',
                        justify: 'start'
                      }}
                    >
                      <ClTag
                        shape='round'
                        tags={[
                          {
                            text: '两件套',
                            color: 'cyan'
                          }
                        ]}
                      />
                      <View style={{ marginLeft: pxTransform(10) }}>
                        <ClText>{yuhun['二件套效果']}</ClText>
                      </View>
                    </ClLayout>
                  </View>
                  <View style={{ width: '100%', margin: pxTransform(10) }}>
                    <ClLayout
                      type='flex'
                      flexSelection={{
                        align: 'center',
                        justify: 'start'
                      }}
                    >
                      <ClTag
                        tags={[
                          {
                            text: '四件套'
                          }
                        ]}
                        shape='round'
                      />
                      <View style={{ marginLeft: pxTransform(10) }}>
                        <ClText>{yuhun['四件套效果']}</ClText>
                      </View>
                    </ClLayout>
                  </View>
                  <View style={{ width: '100%', margin: pxTransform(10) }}>
                    <ClLayout
                      type='flex'
                      flexSelection={{
                        justify: 'start',
                        align: 'center'
                      }}
                    >
                      <ClTag
                        tags={[
                          {
                            text: '获得方式',
                            color: 'mauve'
                          }
                        ]}
                        shape='round'
                      />
                      <View style={{ marginLeft: pxTransform(10) }}>
                        <ClText>{yuhun['获得方式']}</ClText>
                      </View>
                    </ClLayout>
                  </View>
                </ClLayout>
              </View>
            </ClLayout>
          </View>
        </ClCard>
      </Block>
    ));
    const yuhunDetail = this.state.yuhunDetail;
    const activeTab = this.state.activeTab;
    const attrs = yuhunDetail[activeTab].other.map(item => (
      <Block key={item.key}>
        <ClText
          textColor='gray'
          text={`${item.key}：${Math.round(item.value[0])}${
            this.state.rateAttr.includes(item.key) ? '%' : ''
          }`}
        />
      </Block>
    ));
    // const floatButton = (
    //   <FloatButton detail='仓库' onClickButton={this.showStore.bind(this)} />
    // );
    // const yuhunStore = <ClDrawer show={this.state.statusControl.showStore}></ClDrawer>
    return (
      <View>
        <StatusBar
          content='御魂查询'
          fontColor='text-black'
          isBack
          backText=''
        />
        <ClLoading
          show={this.state.statusControl.showLoading}
          type='image'
          imgUrl={LOADINGIMG}
        />
        <ClTabs
          tabs={tabs}
          onClick={this.clickTitle.bind(this)}
          activeColor='cyan'
          type='verb'
        />
        <ScrollView
          scrollY
          style={{
            height: `calc(100vh - ${indexModel.CustomBar +
              indexModel.StatusBar +
              40}px)`
          }}
          scrollWithAnimation
          scrollTop={this.state.scroll}
        >
          <View className='padding-top'>
            <ClLayout
              type='flex'
              flexSelection={{
                justify: 'around'
              }}
            >
              <View style={{ width: '100%' }}>{cards}</View>
            </ClLayout>
          </View>
        </ScrollView>
        <ClModal
          show={this.state.statusControl.showPowerModal}
          close
          title={this.state.powerModalTitle}
          titleBgColor='light-grey'
          actionColor='light-grey'
          onClick={this.clickPower.bind(this)}
          actions={[
            {
              text: '弃置',
              color: 'red'
            },
            {
              text: '强化',
              color: 'blue'
            }
          ]}
        >
          <ClText size='xsmall' bgColor='grey' align='center'>
            模拟强化以及随机概率完全遵循网易公司公布概率
          </ClText>
          <ClText
            size='xsmall'
            bgColor='light-red'
            align='center'
            text={`弃置、强化功能不可逆，弃置将重置属性(每日上限50次，剩余${
              this.state.times
            }次)`}
          />
          <ClTabs
            activeColor='brown'
            type='verb'
            onClick={this.clickTab.bind(this)}
            tabs={this.state.powerTabs.map(key => ({
              text: key
            }))}
          />
          <ClLayout
            baseSelection={{
              padding: 'small',
              paddingDirection: 'vertical'
            }}
          >
            <ClLayout
              type='flex'
              flexSelection={{
                justify: 'around',
                align: 'center'
              }}
            >
              <ClLayout>
                <ClLayout
                  baseSelection={{
                    padding: 'small',
                    paddingDirection: 'bottom'
                  }}
                >
                  <ClAvatar
                    shape='round'
                    size='xlarge'
                    headerArray={[
                      {
                        url: `${this.state.powerModalUrl}`
                      }
                    ]}
                  />
                </ClLayout>
                <ClLayout>
                  <ClProgress
                    animation
                    bgColor='orange'
                    shape='round'
                    stripe
                    percent={this.state.percent}
                  />
                  <ClTag
                    shape='radius'
                    tags={[
                      {
                        disabled: true,
                        text: `+${
                          this.state.yuhunDetail[this.state.activeTab].main
                            .yuhunLevel
                        }`,
                        color: 'orange'
                      }
                    ]}
                  />
                </ClLayout>
              </ClLayout>
              <ClLayout>
                <ClText
                  bgColor='light-cyan'
                  text={`${
                    this.state.yuhunDetail[this.state.activeTab].main.key
                  }：${
                    this.state.yuhunDetail[this.state.activeTab].main.value[0]
                  }${
                    this.state.rateAttr.includes(
                      this.state.yuhunDetail[this.state.activeTab].main.key
                    )
                      ? '%'
                      : ''
                  }`}
                />
                {attrs}
                {}
                <ClLayout
                  baseSelection={{
                    padding: 'normal',
                    paddingDirection: 'top'
                  }}
                >
                  <ClButton
                    shape='round'
                    bgColor='gradualGreen'
                    onClick={this.saveYuhun.bind(this)}
                  >
                    收藏
                  </ClButton>
                </ClLayout>
              </ClLayout>
            </ClLayout>
          </ClLayout>
        </ClModal>
      </View>
    );
  }
}

export default Yuhun;
