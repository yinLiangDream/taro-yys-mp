import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Button, Label } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import styles from './index.module.less';
import { roleApi } from '../../api/index';
import { setNavTitle } from '../../utils/index';

import Loading from '../../components/Loading/index';
import Modal from '../../components/Modal/index';
import Attr from '../../components/Attr/index';
import SkillItem from '../../components/SkillItem/index';
import AwakeMaterial from '../../components/AwakeMaterial/index';

let routerParams = {};
let disabledJuexing = false;

@inject('indexModel')
@observer
class RoleDetail extends Component {
  static options = {
    addGlobalClass: true
  };
  constructor(props) {
    super(props);
    const { indexModel } = this.props;
    this.state = {
      id: '',
      ssLevel: '1',
      allLevels: [],
      ssStar: [true, true, false, false, false, false],
      notJuexing: ['N', 'SP'],
      story: [],
      attrs: [],
      skills: [],
      skins: [],
      awakeMaterial: [],
      awakeSkills: [],
      storyUnlock: [],
      disabledJuexing: false,
      staticUrl: {
        awakeUrl: '',
        chushiButton: '',
        juexingButton: '',
        skinButton: '',
        chushi_active: 'chushi-btn_active.png',
        chushi_normal: 'chushi-btn_normal.png',
        juexing_normal: 'juexing-btn_normal.png',
        juexing_active: 'juexing-btn_active.png',
        juexing_disabled: 'juexing-btn_disabled.png',
        skin_normal: 'skin-btn_normal.png',
        skin_active: 'skin-btn_active.png',
        skin_disabled: 'skin-btn_disabled.png',
        shishen_bg: indexModel.baseUrl + 'shishen_bg.jpg',
        ssl: indexModel.baseUrl + 'ssl.png',
        name_role: indexModel.baseUrl + 'name_role.png',
        yys: indexModel.baseUrl + 'yys.png',
        lotus: indexModel.baseUrl + 'lotus.png',
        noAwakeHead: '',
        awakeHead: '',
        skillItemBg: indexModel.baseUrl + 'skill_item_bg.jpg',
        normalStar: indexModel.baseUrl + 'normal_page.png',
        activeStar: indexModel.baseUrl + 'active_page.png',
        skinBaseUrl: indexModel.baseUrl + 'skin/'
      },
      statusControl: {
        showLoading: true,
        showLevelModal: false,
        showSkin: false
      }
    };
  }
  componentWillMount() {
    routerParams = this.$router.params;
  }
  async componentDidMount() {
    setNavTitle(routerParams.name);
    const { indexModel } = this.props;
    disabledJuexing = this.state.notJuexing.includes(routerParams.level)
    this.setState({
      statusControl: {
        ...this.state.statusControl,
        showSkin: false
      }
    });
    const id = routerParams.id;
    this.state.id = id;
    // 头像
    this.setState({
      staticUrl: {
        ...this.state.staticUrl,
        noAwakeHead: `${indexModel.baseUrl}head/${this.state.id}.jpg`,
        awakeHead: disabledJuexing
          ? this.state.staticUrl.noAwakeHead
          : `${indexModel.baseUrl}awake_head/${id}.jpg`
      }
    });
    console.log('===头像加载完毕===');

    // 式神传记解锁
    const res = await roleApi('storyUnlock');
    this.setState({
      storyUnlock: res.result.data
    });
    console.log('===传记解锁===');

    // 皮肤数据
    const skins = await roleApi('skinIds', { id });
    const currentSkins = skins.result.data
      ? skins.result.data.map((item, index) => {
          item.show = index === 0;
          return item;
        })
      : [];
    this.setState({
      skins: currentSkins
    });
    console.log('===皮肤数据加载完毕===');

    // 按钮及式神图片
    this.setState({
      disabledJuexing: disabledJuexing,
      staticUrl: {
        ...this.state.staticUrl,
        awakeUrl: `${indexModel.baseUrl}v2/${id}.png`,
        chushiButton: `${indexModel.baseUrl}${
          this.state.staticUrl.chushi_active
        }`,
        juexingButton: `${indexModel.baseUrl}${
          !disabledJuexing
            ? this.state.staticUrl.juexing_normal
            : this.state.staticUrl.juexing_disabled
        }`,
        skinButton: `${indexModel.baseUrl}${
          currentSkins.length
            ? this.state.staticUrl.skin_normal
            : this.state.staticUrl.skin_disabled
        }`
      }
    });
    console.log('===按钮及式神图片加载完毕===');

    // 传记
    const zhuanjires = await roleApi('story', { id });
    const showUnlock = this.state.storyUnlock.find(
      item => item.id === Number(id)
    );
    const zhuanji = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
    if (Object.keys(zhuanjires.result.data.data).length) {
      this.setState({
        story: zhuanjires.result.data.data.story.map((item, index) => ({
          title: '传记' + zhuanji[index],
          desc: item,
          unlock: showUnlock ? showUnlock.jx[index] : null
        }))
      });
    }
    console.log('===传记加载完毕===');

    // 式神属性
    this.setState({
      ssLevel: 1,
      ssStar: [true, true, false, false, false, false]
    });
    this.setAttr(1, 2, this.state.ssStar);
    console.log('===式神属性加载完毕===');

    // 技能图标及说明
    const skills = await roleApi('skills', { id });
    this.state.skills = [];
    this.state.awakeSkills = [];
    Object.keys(skills.result.data.noAwake).forEach(noAwakeId => {
      if (['add', 'add_type'].includes(noAwakeId)) return;
      this.state.skills.push({
        url: indexModel.baseUrl + 'skill_icons/' + noAwakeId + '.png',
        text: skills.result.data.noAwake[noAwakeId]
      });
    });
    Object.keys(skills.result.data.awake).forEach(awakeId => {
      if (['add', 'add_type'].includes(awakeId)) return;
      this.state.awakeSkills.push({
        url: indexModel.baseUrl + 'skill_icons/' + awakeId + '.png',
        text: skills.result.data.awake[awakeId]
      });
    });
    if (this.state.awakeSkills.length === 0) {
      this.state.awakeSkills.push({ text: skills.result.data.awake });
    }
    this.calLevel(this.state.ssStar);
    this.setState({
      skills: this.state.skills,
      awakeSkills: this.state.awakeSkills
    });
  }

  /**
   * 计算等级
   */
  calLevel(ssStar) {
    const allLevels = [];
    let num = 1;
    const starLen = ssStar.filter(item => item).length;
    while (num <= starLen * 5 + 10) {
      allLevels.push(`${num}级`);
      num++;
    }
    this.setState({
      allLevels
    });
  }

  /**
   * 展示选择等级
   */
  showLevel() {
    this.setState({
      statusControl: {
        ...this.state.statusControl,
        showLevelModal: true
      }
    });
  }

  /**
   * 关闭展示选择等级
   * @param {*} level
   */
  closeLevel(level, star, ssStar = this.state.ssStar) {
    if (level) {
      const starLen = ssStar.filter(item => item).length;
      this.setState({
        statusControl: {
          ...this.state.statusControl,
          showLevelModal: false
        }
      }, () => {
        this.setAttr(level, starLen, ssStar);
      })
    } else {
      this.setState({
        statusControl: {
          ...this.state.statusControl,
          showLevelModal: false
        }
      })
    }
  }

  /**
   * 改变 star
   * @param {*} index
   */
  changeStar(index) {
    if (index < 1) return;
    const ssStar = this.state.ssStar.map((item, ssIndex) => ssIndex <= index);
    this.calLevel(ssStar);
    const starLen = ssStar.filter(item => item).length;
    const maxLevel = 10 + starLen * 5;
    let ssLevel = this.state.ssLevel;
    if (this.state.ssLevel > maxLevel) ssLevel = maxLevel;
    this.closeLevel(ssLevel, starLen, ssStar);
  }

  async setAttr(level, star, ssStar) {
    const { indexModel } = this.props;
    this.setState(
      {
        ssStar,
        ssLevel: level,
        statusControl: {
          ...this.state.statusControl,
          showLoading: true
        }
      },
      async () => {
        console.log('showLoading', this.state.statusControl.showLoading);
        const attr = await roleApi('attr', {
          id: this.state.id,
          level,
          star
        });
        const names = [
          'attack',
          'maxHp',
          'defense',
          'speed',
          'critRate',
          'critPower',
          'debuffResist',
          'debuffEnhance'
        ];
        const attrData = attr.result.data;
        const awakeMaterial = attrData.noAwake.awakeitem.map(list => ({
          name: list[0],
          num: list[2],
          url: indexModel.awakeMaterial[list[0]]
        }));
        const attrs = names.map(key => {
          let beforeData = attrData.noAwake[key];
          let afterData = disabledJuexing
            ? beforeData
            : attrData.awake[key];
          const rate = [
            'critRate',
            'critPower',
            'debuffResist',
            'debuffEnhance'
          ];
          if (rate.includes(key)) {
            beforeData *= 100;
            afterData *= 100;
          }
          if (key === 'critPower') {
            beforeData += 100;
            afterData += 100;
          }
          const beforeAwake = beforeData.toFixed();
          const afterAwake = afterData.toFixed();
          const diff = Number(afterAwake) - Number(beforeAwake);
          const ssAttr = disabledJuexing
            ? attrData.noAwake.score[key]
            : attrData.awake.score[key];
          return {
            attr: {
              before_awake: beforeAwake,
              after_awake: afterAwake,
              diff
            },
            name: key,
            noAwakeAttr: indexModel.attrLevel[attrData.noAwake.score[key]],
            awakeAttr: indexModel.attrLevel[ssAttr]
          };
        });
        this.setState({
          awakeMaterial,
          attrs,
          statusControl: {
            ...this.state.statusControl,
            showLoading: false
          }
        });
      }
    );
  }

  /**
   * 点击初始
   */
  chushiClick() {
    const { indexModel } = this.props;
    this.setState(
      {
        statusControl: {
          ...this.state.statusControl,
          showSkin: false
        },
        staticUrl: {
          ...this.state.staticUrl,
          awakeUrl: `${indexModel.baseUrl}v2/${this.state.id}.png`
        }
      },
      () => {
        this.headerButtonReset(0);
      }
    );
  }

  /**
   * 点击觉醒
   */
  juexingClick() {
    const { indexModel } = this.props;
    if (disabledJuexing) return;
    this.setState(
      {
        statusControl: {
          ...this.state.statusControl,
          showSkin: false
        },
        staticUrl: {
          ...this.state.staticUrl,
          awakeUrl: `${indexModel.baseUrl}v3/${this.state.id}.png`
        }
      },
      () => {
        this.headerButtonReset(1);
      }
    );
  }

  /**
   * 点击皮肤
   */
  skinClick() {
    const { indexModel } = this.props;
    if (!this.state.skins.length) return;
    this.setState(
      {
        staticUrl: {
          ...this.state.staticUrl,
          awakeUrl: `${indexModel.baseUrl}skin/${
            this.state.id
          }-${this.state.skins.findIndex(item => item.show) + 1}.png`
        },
        statusControl: {
          ...this.state.statusControl,
          showSkin: true
        }
      },
      () => {
        this.headerButtonReset(2);
      }
    );
  }

  /**
   * 头部按钮点击事件综合处理
   * @param {*} type 类型 0初始 1觉醒 2皮肤
   */
  headerButtonReset(type) {
    const { indexModel } = this.props;
    const resetJuexing = `${indexModel.baseUrl}${
      !disabledJuexing
        ? this.state.staticUrl.juexing_normal
        : this.state.staticUrl.juexing_disabled
    }`;
    const resetSkin = `${indexModel.baseUrl}${
      this.state.skins.length
        ? this.state.staticUrl.skin_normal
        : this.state.staticUrl.skin_disabled
    }`;
    const chushiButton =
      type === 0
        ? `${indexModel.baseUrl}${this.state.staticUrl.chushi_active}`
        : `${indexModel.baseUrl}${this.state.staticUrl.chushi_normal}`;

    const juexingButton =
      type === 1
        ? `${indexModel.baseUrl}${this.state.staticUrl.juexing_active}`
        : resetJuexing;

    const skinButton =
      type === 2
        ? `${indexModel.baseUrl}${this.state.staticUrl.skin_active}`
        : resetSkin;
    this.setState({
      staticUrl: {
        ...this.state.staticUrl,
        chushiButton,
        juexingButton,
        skinButton
      }
    });
  }

  /**
   * 是否展示皮肤
   * @param {*} index
   */
  showSkin(index) {
    const { indexModel } = this.props;
    this.state.skins.forEach((item, listIndex) => {
      item.show = index === listIndex;
      if (item.show)
        this.setState({
          staticUrl: {
            ...this.state.staticUrl,
            awakeUrl: `${indexModel.baseUrl}skin/${this.state.id}-${index +
              1}.png`
          }
        });
    });
  }

  render() {
    console.log('render roleDetail');

    const storyList = this.state.story.map((item, index) => (
      <View key={index} className={styles.contentDetailItem}>
        <View className={styles.zhuanjiTitle}>
          {item.title}
          {item.unlock ? <Text>({item.unlock})</Text> : ''}
        </View>
        <Label className={styles.zhuanjiContext}>{item.desc}</Label>
      </View>
    ));
    return (
      <View className={styles.roleDetail}>
        <Loading show={this.state.statusControl.showLoading} />

        <View className={styles.header}>
          <Image
            src={this.state.staticUrl.shishen_bg}
            className={styles.header_bg}
            mode='aspectFill'
          />

          <View className={styles.left}>
            <View className={styles.top}>
              <Image
                src={this.state.staticUrl.ssl}
                mode='widthFix'
                className={styles.ssl}
              />
            </View>
            <View className={styles.name}>
              <Image
                src={this.state.staticUrl.name_role}
                className={styles.img}
                mode='widthFix'
              />
              <View className={styles.text}>
                <View className={styles.level}>{routerParams.level}</View>
                {routerParams.name.map((item, index) => (
                  <View key={index} className={styles.names}>
                    {item}
                  </View>
                ))}
              </View>
            </View>
          </View>

          <Image
            src={this.state.staticUrl.yys}
            mode='widthFix'
            className={styles.yys}
          />
          <Image
            src={this.state.staticUrl.awakeUrl}
            className={styles.role}
            mode='widthFix'
          />

          <View className={styles.awake}>
            <View className={styles.chushi} onClick={this.chushiClick}>
              <Image
                src={this.state.staticUrl.chushiButton}
                mode='widthFix'
                className={styles.img}
              />
            </View>
            <View className={styles.juexing} onClick={this.juexingClick}>
              <Image
                src={this.state.staticUrl.juexingButton}
                mode='widthFix'
                className={styles.img}
              />
            </View>
            <View className={styles.skin} onClick={this.skinClick}>
              <Image
                src={this.state.staticUrl.skinButton}
                mode='widthFix'
                className={styles.img}
              />
            </View>
          </View>

          {this.state.statusControl.showSkin ? (
            <View className={styles.skinGroup}>
              {this.state.skins.map((item, index) => (
                <View key={index}>
                  <Button
                    className={`${
                      item.show ? 'bg-cyan' : 'bg-grey'
                    } cu-btn bg-cyan round sm shadow buttons`}
                    onClick={this.showSkin.bind(this, index)}
                  >
                    {item.name}
                  </Button>
                </View>
              ))}
            </View>
          ) : (
            ''
          )}
        </View>

        <View className={styles.detail}>
          <View className={`${styles.biography} shadow`}>
            <View className={styles.title}>01/ 传记</View>
            <View className={styles.border}>
              <View className={styles.content}>
                <View className={styles.contentName}>
                  <Image
                    src={this.state.staticUrl.lotus}
                    mode='widthFix'
                    className={styles.img}
                  />
                  <Text className={styles.text}>{routerParams.name}</Text>
                </View>
                <View className={styles.contentDetail}>{storyList}</View>
              </View>
            </View>
          </View>

          <View className={styles.intelligence}>
            <View className={styles.title}>02/ 情报</View>
            <View className={styles.detailHead}>
              <View className={styles.head}>
                <View className={styles.noAwake}>
                  <Image
                    src={this.state.staticUrl.noAwakeHead}
                    mode='widthFix'
                    className={styles.noAwakeHead}
                  />
                </View>
                {!disabledJuexing ? (
                  <View className={styles.awake}>
                    <Image
                      src={this.state.staticUrl.awakeHead}
                      mode='widthFix'
                      className={styles.awakeHead}
                    />
                  </View>
                ) : (
                  ''
                )}
              </View>

              <View className={styles.level}>
                <View className={styles.sslevel}>
                  <Modal
                    show={this.state.statusControl.showLevelModal}
                    title='请选择等级'
                    onClose={this.closeLevel.bind(this)}
                  >
                    <View className={styles.levelModal}>
                      {this.state.allLevels.map((item, index) => (
                        <View key={index} className={styles.levelModalBtn}>
                          <Button
                            className='cu-btn bg-cyan round sm shadow'
                            onClick={this.closeLevel.bind(this, index + 1)}
                          >
                            {item}
                          </Button>
                        </View>
                      ))}
                    </View>
                  </Modal>
                  <View className={styles.action}>
                    <Button
                      className='cu-btn bg-mauve round sm shadow'
                      onClick={this.showLevel}
                    >
                      {this.state.ssLevel}级
                    </Button>
                  </View>
                </View>

                <View className={styles.ssStar}>
                  {this.state.ssStar.map((item, index) => (
                    <View key={index}>
                      <View
                        className={styles.ssStarBlock}
                        onClick={this.changeStar.bind(this, index)}
                      >
                        <Image
                          src={
                            item
                              ? this.state.staticUrl.activeStar
                              : this.state.staticUrl.normalStar
                          }
                          mode='widthFix'
                          className={styles.ssStarImg}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View className={styles.attr}>
                {this.state.attrs.map((item, index) => (
                  <View key={index}>
                    <Attr
                      name={item.name}
                      noAwakeAttr={item.noAwakeAttr}
                      awakeAttr={item.awakeAttr}
                      attr={item.attr}
                      disabled={this.state.disabledJuexing}
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View className={styles.skill}>
            <View className={styles.title}>03/ 技能</View>
            <SkillItem skills={this.state.skills} />
            {!disabledJuexing ? (
              <SkillItem skills={this.state.awakeSkills} awake />
            ) : (
              ''
            )}
            {!disabledJuexing ? (
              <View className={`${styles.metarial} shadow-blur bg-gray`}>
                {this.state.awakeMaterial.map((item, index) => (
                  <View key={index}>
                    {item ? <AwakeMaterial data={item} /> : ''}
                  </View>
                ))}
              </View>
            ) : (
              ''
            )}
          </View>
        </View>
      </View>
    );
  }
}

export default RoleDetail;
