import Taro, { Component } from "@tarojs/taro";
import {
  View,
  Text,
  Image,
  Button,
  Label,
  ScrollView,
  Picker
} from "@tarojs/components";
import { observer, inject } from "@tarojs/mobx";
import { ClLoading, ClButton } from "mp-colorui";

import styles from "./index.module.less";
import parterService from "../../service/partner";
import { setNavTitle } from "../../utils/index";

import Modal from "../../components/Modal/index";
import AttrSS from "../../components/Attr/index";
import SkillItem from "../../components/SkillItem/index";
import AwakeMaterial from "../../components/AwakeMaterial/index";
import { LOADINGIMG } from "../../utils/model";

let routerParams = {};
let disabledJuexing = false;

@inject("indexModel", "roleModel")
@observer
class RoleDetail extends Component {
  static options = {
    addGlobalClass: true
  };

  constructor(props) {
    super(props);
    const { indexModel } = this.props;
    this.state = {
      id: "",
      ssLevel: "1",
      allLevels: [],
      ssStar: [true, true, false, false, false, false],
      notJuexing: ["N", "SP"],
      story: [],
      attrs: [],
      skills: [],
      skins: [],
      awakeMaterial: [],
      awakeSkills: [],
      disabledJuexing: false,
      staticUrl: {
        awakeUrl: "",
        chushiButton: "",
        juexingButton: "",
        skinButton: "",
        chushi_active: "chushi-btn_active.png",
        chushi_normal: "chushi-btn_normal.png",
        juexing_normal: "juexing-btn_normal.png",
        juexing_active: "juexing-btn_active.png",
        juexing_disabled: "juexing-btn_disabled.png",
        skin_normal: "skin-btn_normal.png",
        skin_active: "skin-btn_active.png",
        skin_disabled: "skin-btn_disabled.png",
        shishen_bg: indexModel.baseUrl + "shishen_bg.jpg",
        ssl: indexModel.baseUrl + "ssl.png",
        name_role: indexModel.baseUrl + "name_role.png",
        yys: indexModel.baseUrl + "yys.png",
        lotus: indexModel.baseUrl + "lotus.png",
        noAwakeHead: "",
        awakeHead: "",
        skillItemBg: indexModel.baseUrl + "skill_item_bg.jpg",
        normalStar: indexModel.baseUrl + "normal_page.png",
        activeStar: indexModel.baseUrl + "active_page.png",
        skinBaseUrl: indexModel.baseUrl + "skin/"
      },
      statusControl: {
        showLoading: true,
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
    const id = routerParams.id;
    this.state.id = id;
    const routerSkins = JSON.parse(routerParams.skins).map((item, index) => ({
      url: `${indexModel.baseUrl}skin/${item.key}.png`,
      name: item.name,
      show: index === 0
    }));
    disabledJuexing = this.state.notJuexing.includes(routerParams.level);
    console.log("===皮肤数据加载完毕===");

    // 按钮及式神图片
    this.setState({
      disabledJuexing: disabledJuexing,
      skins: routerSkins,
      statusControl: {
        ...this.state.statusControl,
        showSkin: false
      },
      staticUrl: {
        ...this.state.staticUrl,
        noAwakeHead: `${indexModel.baseUrl}head/${this.state.id}.jpg`,
        awakeHead: disabledJuexing
          ? this.state.staticUrl.noAwakeHead
          : `${indexModel.baseUrl}awake_head/${id}.jpg`,
        awakeUrl: `${indexModel.baseUrl}v2/${id}.png`,
        chushiButton: `${indexModel.baseUrl}${this.state.staticUrl.chushi_active}`,
        juexingButton: `${indexModel.baseUrl}${
          !disabledJuexing
            ? this.state.staticUrl.juexing_normal
            : this.state.staticUrl.juexing_disabled
        }`,
        skinButton: `${indexModel.baseUrl}${
          routerSkins.length
            ? this.state.staticUrl.skin_normal
            : this.state.staticUrl.skin_disabled
        }`
      }
    });
    console.log("===头像加载完毕===");
    console.log("===按钮及式神图片加载完毕===");

    this.getStory();

    this.getSkill();

    this.setAttr(1, 2, this.state.ssStar);
  }

  async getStory() {
    const { roleModel } = this.props;
    // 传记
    if (!roleModel.allStory.length) {
      const zhuanjires = await parterService.getStory();
      roleModel.saveAllStory(zhuanjires);
    }
    const story = roleModel.getStoryById(this.state.id);
    // const showUnlock = this.state.storyUnlock.find(
    //   item => item.id === Number(id)
    // );
    const zhuanji = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
    if (Object.keys(story).length) {
      this.setState({
        story: story.map((item, index) => ({
          title: "传记" + zhuanji[index],
          desc: item
          // unlock: showUnlock ? showUnlock.jx[index] : null
        }))
      });
    }
    console.log("===传记加载完毕===");
  }

  async getSkill() {
    const { indexModel, roleModel } = this.props;
    // 技能图标及说明
    if (!roleModel.allSkill.length) {
      const skills = await parterService.getSkills();
      roleModel.saveAllSKill(skills);
    }
    const skillDesc = roleModel.getSkillById(this.state.id);
    console.log("skills", skillDesc);
    this.state.skills = [];
    this.state.awakeSkills = [];
    Object.keys(skillDesc.beforeAwakeSkillDesc).forEach(noAwakeId => {
      if (["add", "add_type"].includes(noAwakeId)) return;
      this.state.skills.push({
        url: indexModel.baseUrl + "skill_icons/" + noAwakeId + ".png",
        text: skillDesc.beforeAwakeSkillDesc[noAwakeId]
      });
    });
    Object.keys(skillDesc.afterAwakeSkillDesc).forEach(awakeId => {
      if (["add", "add_type"].includes(awakeId)) return;
      this.state.awakeSkills.push({
        url: indexModel.baseUrl + "skill_icons/" + awakeId + ".png",
        text: skillDesc.afterAwakeSkillDesc[awakeId]
      });
    });
    if (this.state.awakeSkills.length === 0) {
      this.state.awakeSkills.push({ text: skillDesc.afterAwakeSkillDesc });
    }
    this.calLevel(this.state.ssStar);
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
   * 关闭展示选择等级
   * @param {*} level
   */
  closeLevel(level, star, ssStar = this.state.ssStar) {
    if (level) {
      const starLen = ssStar.filter(item => item).length;
      this.setAttr(level, starLen, ssStar);
    }
  }

  /**
   * 改变 star
   * @param {*} index
   */
  changeStar(index) {
    if (index < 1) return;
    const ssStar = this.state.ssStar.map((item, ssIndex) => ssIndex <= index);
    const starLen = ssStar.filter(item => item).length;
    const maxLevel = 10 + starLen * 5;
    let ssLevel = this.state.ssLevel;
    if (this.state.ssLevel > maxLevel) ssLevel = maxLevel;
    this.calLevel(ssStar);
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
        const attr = await parterService.getAttr({
          id: this.state.id,
          level,
          star
        });
        const names = [
          "attack",
          "maxHp",
          "defense",
          "speed",
          "critRate",
          "critPower",
          "debuffResist",
          "debuffEnhance"
        ];
        const attrData = attr;
        const awakeMaterialModel = indexModel.getAwakeMaterial;
        const awakeMaterial = attrData.noAwake.awakeitem.map(list => ({
          name: list[0],
          num: list[2],
          url: awakeMaterialModel[list[0]]
        }));
        const attrs = names.map(key => {
          let beforeData = attrData.noAwake[key];
          let afterData = disabledJuexing ? beforeData : attrData.awake[key];
          const rate = [
            "critRate",
            "critPower",
            "debuffResist",
            "debuffEnhance"
          ];
          if (rate.includes(key)) {
            beforeData *= 100;
            afterData *= 100;
          }
          if (key === "critPower") {
            beforeData += 100;
            afterData += 100;
          }
          const beforeAwake = beforeData.toFixed();
          const afterAwake = afterData.toFixed();
          const diff = Number(afterAwake) - Number(beforeAwake);
          const ssAttr = disabledJuexing
            ? attrData.noAwake.score[key]
            : attrData.awake.score[key];
          const attrLevel = indexModel.getAttrLevel;
          return {
            attr: {
              before_awake: beforeAwake,
              after_awake: afterAwake,
              diff
            },
            name: key,
            noAwakeAttr: attrLevel[attrData.noAwake.score[key]],
            awakeAttr: attrLevel[ssAttr]
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
        console.log("===式神属性加载完毕===");
      }
    );
  }

  /**
   * 点击初始
   */
  chushiClick() {
    const { indexModel } = this.props;
    this.setState({
      statusControl: {
        ...this.state.statusControl,
        showSkin: false
      },
      staticUrl: {
        ...this.state.staticUrl,
        ...this.headerButtonReset(0),
        awakeUrl: `${indexModel.baseUrl}v2/${this.state.id}.png`
      }
    });
  }

  /**
   * 点击觉醒
   */
  juexingClick() {
    const { indexModel } = this.props;
    if (disabledJuexing) return;
    this.setState({
      statusControl: {
        ...this.state.statusControl,
        showSkin: false
      },
      staticUrl: {
        ...this.state.staticUrl,
        ...this.headerButtonReset(1),
        awakeUrl: `${indexModel.baseUrl}v3/${this.state.id}.png`
      }
    });
  }

  /**
   * 点击皮肤
   */
  skinClick() {
    if (!this.state.skins.length) return;
    this.setState({
      staticUrl: {
        ...this.state.staticUrl,
        ...this.headerButtonReset(2),
        awakeUrl: this.state.skins[0].url
      },
      statusControl: {
        ...this.state.statusControl,
        showSkin: true
      }
    });
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
    return {
      chushiButton,
      juexingButton,
      skinButton
    };
  }

  /**
   * 是否展示皮肤
   * @param {*} index
   */
  showSkin(index) {
    this.state.skins.forEach((item, listIndex) => {
      item.show = index === listIndex;
      if (item.show) {
        this.setState({
          staticUrl: {
            ...this.state.staticUrl,
            awakeUrl: this.state.skins[index].url
          }
        });
      }
    });
  }

  render() {
    const {
      story,
      skills,
      awakeSkills,
      awakeMaterial,
      attrs,
      statusControl,
      staticUrl,
      skins,
      allLevels,
      ssLevel,
      ssStar
    } = this.state;
    const storyList = story.map((item, index) => (
      <View key={"key-" + index} className={styles.contentDetailItem}>
        <View className={styles.zhuanjiTitle}>
          {item.title}
          {item.unlock ? <Text>({item.unlock})</Text> : ""}
        </View>
        <Label className={styles.zhuanjiContext}>{item.desc}</Label>
      </View>
    ));
    const skillList = <SkillItem skills={skills} style="width: 100%" />;
    const awakeSkillList = (
      <SkillItem skills={awakeSkills} awake style="width: 100%" />
    );
    const materialList = awakeMaterial.map((item, index) => (
      <View key={"key-" + index}>
        {item ? <AwakeMaterial data={item} /> : ""}
      </View>
    ));
    const attrsList = attrs.map((item, index) => (
      <View key={"key-" + index}>
        <AttrSS
          name={item.name}
          noAwakeAttr={item.noAwakeAttr}
          awakeAttr={item.awakeAttr}
          attr={item.attr}
          disabled={this.state.disabledJuexing}
        />
      </View>
    ));
    return (
      <View className={styles.roleDetail}>
        <ClLoading
          type="image"
          imgUrl={LOADINGIMG}
          show={statusControl.showLoading}
        />
        <View className={styles.header}>
          <Image
            src={staticUrl.shishen_bg}
            className={styles.header_bg}
            mode="aspectFill"
          />

          <View className={styles.left}>
            <View className={styles.top}>
              <Image
                src={staticUrl.ssl}
                mode="widthFix"
                className={styles.ssl}
              />
            </View>
            <View className={styles.name}>
              <Image
                src={staticUrl.name_role}
                className={styles.img}
                mode="widthFix"
              />
              <View className={styles.text}>
                <View className={styles.level}>{routerParams.level}</View>
                {routerParams.name &&
                  Array.from(routerParams.name).map((item, index) => (
                    <View key={"key-" + index} className={styles.names}>
                      {item}
                    </View>
                  ))}
              </View>
            </View>
          </View>

          <Image src={staticUrl.yys} mode="widthFix" className={styles.yys} />
          <Image
            src={staticUrl.awakeUrl}
            className={styles.role}
            mode="widthFix"
          />

          <View className={styles.awake}>
            <View className={styles.chushi} onClick={this.chushiClick}>
              <Image
                src={staticUrl.chushiButton}
                mode="widthFix"
                className={styles.img}
              />
            </View>
            <View className={styles.juexing} onClick={this.juexingClick}>
              <Image
                src={staticUrl.juexingButton}
                mode="widthFix"
                className={styles.img}
              />
            </View>
            <View className={styles.skin} onClick={this.skinClick}>
              <Image
                src={staticUrl.skinButton}
                mode="widthFix"
                className={styles.img}
              />
            </View>
          </View>

          {statusControl.showSkin ? (
            <View className={styles.skinGroup}>
              {skins.map((item, index) => (
                <View key={item.name}>
                  <Button
                    className={`${
                      item.show ? "bg-cyan" : "bg-grey"
                    } cu-btn bg-cyan round sm shadow buttons`}
                    onClick={this.showSkin.bind(this, index)}
                  >
                    {item.name}
                  </Button>
                </View>
              ))}
            </View>
          ) : (
            ""
          )}
        </View>

        <View className={styles.detail}>
          <View className={`${styles.biography} shadow`}>
            <View className={styles.title}>01/ 传记</View>
            <View className={styles.border}>
              <View className={styles.content}>
                <View className={styles.contentName}>
                  <Image
                    src={staticUrl.lotus}
                    mode="widthFix"
                    className={styles.img}
                  />
                  <Text className={styles.text}>{routerParams.name}</Text>
                </View>
                <View className={styles.contentDetail}>
                  <ScrollView scroll-y style="height: 300px;">
                    {storyList}
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>

          <View className={styles.intelligence}>
            <View className={styles.title}>02/ 情报</View>
            <View className={styles.detailHead}>
              <View className={styles.head}>
                <View className={styles.noAwake}>
                  <Image
                    src={staticUrl.noAwakeHead}
                    mode="widthFix"
                    className={styles.noAwakeHead}
                  />
                </View>
                {!disabledJuexing ? (
                  <View className={styles.awake}>
                    <Image
                      src={staticUrl.awakeHead}
                      mode="widthFix"
                      className={styles.awakeHead}
                    />
                  </View>
                ) : (
                  ""
                )}
              </View>

              <View className={styles.level}>
                <View className={styles.sslevel}>
                  <View className={styles.action}>
                    <Picker
                      range={allLevels}
                      mode="selector"
                      value={ssLevel - 1}
                      onChange={e => {
                        this.closeLevel(Number(e.detail.value) + 1);
                      }}
                    >
                      <ClButton size="small" shape="round">
                        {ssLevel}级
                      </ClButton>
                    </Picker>
                  </View>
                  <Text className={styles.levelTip}>
                    Tips: 可以选择星级和等级~
                  </Text>
                </View>

                <View className={styles.ssStar}>
                  {ssStar.map((item, index) => (
                    <View key={"key-" + index}>
                      <View
                        className={styles.ssStarBlock}
                        onClick={this.changeStar.bind(this, index)}
                      >
                        <Image
                          src={
                            item ? staticUrl.activeStar : staticUrl.normalStar
                          }
                          mode="widthFix"
                          className={styles.ssStarImg}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View className={styles.attr}>{attrsList}</View>
            </View>
          </View>

          <View className={styles.skill}>
            <View className={styles.title}>03/ 技能</View>
            {skillList}
            {!disabledJuexing ? awakeSkillList : ""}
            {!disabledJuexing ? (
              <View className={`${styles.metarial} shadow-blur bg-gray`}>
                {materialList}
              </View>
            ) : (
              ""
            )}
          </View>
        </View>
      </View>
    );
  }
}

export default RoleDetail;
