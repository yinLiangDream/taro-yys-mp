import Taro, { Component, pxTransform } from '@tarojs/taro';
import {
  View,
  Text,
  Image,
  Input,
  ScrollView,
  Block
} from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import {
  ClButton,
  ClIcon,
  ClDrawer,
  ClLayout,
  ClAvatar,
  ClSearchBar,
  ClLoading
} from 'mp-colorui';

import styles from './index.module.less';
import { rewardForSealApi } from '../../api/index';
import { firstName, debounce } from '../../utils/index';
import StatusBar from '../../components/StatusBar';
import { getData, addData, updateData } from '../../api/db/index';
import { LOADINGIMG } from '../../utils/model';

const COLLECTION = 'rewardForSeal';

let _id = '';
@inject('rewardForSealModel', 'indexModel', 'userModel')
@observer
class RewardForSeal extends Component {
  static options = {
    addGlobalClass: true
  };
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      showList: [],
      searchFlag: false,
      showDrawer: false,
      allRoles: [],
      tempSelect: [],
      hasSelect: [],
      filterAllRoles: [],
      statusControl: {
        showLoading: true
      }
    };
  }
  async componentDidMount() {
    const { rewardForSealModel, indexModel, userModel } = this.props;
    try {
      const res = await rewardForSealApi('list', {});
      rewardForSealModel.saveAllReward(res.result.data);
    } catch (err) {
      console.error(err);
    }
    if (!Object.keys(rewardForSealModel.allRewardsDetails).length) {
      try {
        const res = await rewardForSealApi('detail', {});
        rewardForSealModel.saveAllRewardsDetails(res.result.data);
        this.state.data = res.result.data;
      } catch (err) {
        console.error(err);
      }
    }
    const rewardRoles = [].concat(
      indexModel.all
        .filter(item => item.level !== 'SP')
        .filter(item => !item.material)
    );
    this.setState({
      allRoles: rewardRoles,
      filterAllRoles: rewardRoles,
      statusControl: {
        showLoading: false
      }
    });

    // 获取数据库已选数据
    getData
      .collectionWhere(COLLECTION, {
        _openid: userModel.getUserOpenId
      })
      .then(e => {
        // 若获取不到则进行创建
        if (e.data.length === 0) {
          addData
            .collection(COLLECTION, {
              selectedId: []
            })
            .then(set => {
              _id = set._id;
            });
          this.setState({
            hasSelect: []
          });
        } else {
          _id = e._id;
          this.setState({
            hasSelect: e.data[0].selectedId
          });
        }
      });
  }
  search(e) {
    const { rewardForSealModel } = this.props;
    debounce(() => {
      this.setState(
        {
          searchFlag: true,
          showList: !e.detail.value ? [] : this.state.showList
        },
        () => {
          if (!e.detail.value) return;
          const data = rewardForSealModel.allRewards;
          this.setState({
            showList:
              data.filter(
                item =>
                  firstName(item.name).includes(e.detail.value) ||
                  item.name.includes(e.detail.value) ||
                  (item.othername && item.othername.includes(e.detail.value)) ||
                  (item.clue && item.clue.includes(e.detail.value))
              ) || []
          });
        }
      );
    });
  }
  async deatil(item) {
    Taro.navigateTo({
      url: `/pages/rewardForSeal/rewardForSealDetail/index?id=${
        item.id
      }&advice=${JSON.stringify(item.advice)}&name=${item.name}`
    });
  }

  clickAdd() {
    this.setState({
      showDrawer: true,
      tempSelect: [].concat(this.state.hasSelect)
    });
  }
  clickshadow() {
    this.setState({
      showDrawer: false,
      tempSelect: []
    });
  }
  clickAvatar(id) {
    const findIndex = this.state.tempSelect.findIndex(item => item === id);
    if (findIndex >= 0) this.state.tempSelect.splice(findIndex, 1);
    else this.state.tempSelect.push(id);
    this.setState({
      tempSelect: this.state.tempSelect
    });
  }
  ssSearch(value) {
    debounce(() => {
      this.setState({
        filterAllRoles: this.state.allRoles.filter(item =>
          item.name.includes(value)
        )
      });
    });
  }
  clickConfirm() {
    const selectedId = this.state.tempSelect;
    updateData
      .doc(COLLECTION, _id, {
        selectedId: selectedId
      })
      .then(
        e => {
          Taro.showToast({
            icon: 'success',
            title: '同步云端成功'
          });
          this.setState({
            showDrawer: false,
            hasSelect: selectedId
          });
        },
        () => {
          Taro.showToast({
            icon: 'none',
            title: '同步云端失败'
          });
        }
      );
  }
  searchByName(name) {
    this.setState({
      searchValue: name
    });
    this.search({
      detail: {
        value: name
      }
    });
  }
  render() {
    console.log('render rewardForSeal');
    const { indexModel } = this.props;
    const findList = this.state.showList.map((item, index) => (
      <View
        className={styles.list}
        key={index}
        onClick={this.deatil.bind(this, item)}
      >
        <Text>
          {item.name}
          {item.othername ? '(' + item.othername + ')' : ''}
        </Text>
        {item.clue ? <Text>线索：{item.clue}</Text> : ''}
      </View>
    ));
    const addList = (
      <ClButton
        size='large'
        onClick={this.clickAdd.bind(this)}
        bgColor='light-blue'
        shape='round'
      >
        <ClIcon iconName='add' size='xxlarge' />
      </ClButton>
    );
    const avatars = this.state.filterAllRoles.map((item, index) => (
      <Block key={index}>
        <ClLayout baseSelection={{ padding: 'small' }}>
          <ClLayout
            type='flex'
            flexSelection={{ justify: 'center', align: 'center' }}
          >
            <ClAvatar
              size='large'
              onClick={this.clickAvatar.bind(this, item.id)}
              headerArray={[
                {
                  url: `${indexModel.baseUrl}list_head/${item.id}.jpg`,
                  tag: this.state.tempSelect.includes(item.id) ? 'check' : '',
                  tagColor: 'light-green'
                }
              ]}
            />
          </ClLayout>
        </ClLayout>
      </Block>
    ));
    const selectedAvatars = this.state.allRoles
      .filter(item => this.state.hasSelect.includes(item.id))
      .map((item, index) => (
        <Block key={index}>
          <ClLayout baseSelection={{ padding: 'small' }}>
            <ClLayout
              type='flex'
              flexSelection={{ justify: 'center', align: 'center' }}
            >
              <ClAvatar
                size='large'
                onClick={this.searchByName.bind(this, item.name)}
                headerArray={[
                  {
                    url: `${indexModel.baseUrl}list_head/${item.id}.jpg`
                  }
                ]}
              />
            </ClLayout>
          </ClLayout>
        </Block>
      ));
    const showSSList = (
      <ClDrawer
        show={this.state.showDrawer}
        onClickShadow={this.clickshadow.bind(this)}
      >
        <ClLayout baseSelection={{ padding: 'small' }}>
          <ClLayout
            type='flex'
            flexSelection={{ justify: 'between', align: 'center' }}
          >
            <ClButton
              shape='round'
              bgColor='red'
              onClick={this.clickshadow.bind(this)}
            >
              取消
            </ClButton>
            <ClSearchBar
              onInput={this.ssSearch.bind(this)}
              shape='round'
              searchType='none'
              placeholder='请输入式神名称'
            />
            <ClButton
              shape='round'
              bgColor='cyan'
              onClick={this.clickConfirm.bind(this)}
            >
              确定
            </ClButton>
          </ClLayout>
        </ClLayout>
        <ScrollView
          style={{ height: `calc(60vh - ${pxTransform(80)})` }}
          scrollY
        >
          <ClLayout baseSelection={{ padding: 'normal' }}>
            <ClLayout
              type='flex'
              flexSelection={{ justify: 'between', warp: true }}
            >
              {avatars}
            </ClLayout>
          </ClLayout>
        </ScrollView>
      </ClDrawer>
    );
    return (
      <ScrollView className={styles.RewardForSeal}>
        <StatusBar
          content='悬赏封印'
          fontColor='text-black'
          isBack
          backText=''
        />
        <ClLoading
          show={this.state.statusControl.showLoading}
          type='image'
          imgUrl={LOADINGIMG}
        />
        <View className={styles.header}>
          <Image
            src='https://mp-yys-1255362963.cos.ap-chengdu.myqcloud.com/search_title.png'
            className={styles.img}
            mode='aspectFit'
          />
        </View>
        <View className={styles.body}>
          <Input
            type='text'
            className={styles['input-box']}
            placeholder='输入妖怪（简写亦可）、线索、关键词'
            onInput={this.search}
            value={this.state.searchValue}
          />
        </View>
        <ScrollView className={styles.find} scrollY>
          {this.state.showList.length === 0 && this.state.searchFlag ? (
            <Text className={styles.tip}>
              亲亲，没有找到符合条件的妖怪，请重新输入~
            </Text>
          ) : (
            ''
          )}
          <View />
          {this.state.showList.length === 0 ? (
            <ClLayout>
              <ScrollView style={{ height: `60vh` }} scrollY>
                <ClLayout
                  type='flex'
                  flexSelection={{
                    justify: 'center',
                    warp: true,
                    align: 'center'
                  }}
                >
                  {selectedAvatars}
                  {addList}
                </ClLayout>
              </ScrollView>
            </ClLayout>
          ) : (
            ''
          )}
          {findList}
        </ScrollView>
        {showSSList}
      </ScrollView>
    );
  }
}
export default RewardForSeal;
