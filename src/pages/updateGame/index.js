import { Button, ScrollView, Text, View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro, { Component } from '@tarojs/taro';
import { ClLoading } from 'mp-colorui';
import { gameApi } from '../../api/index';
import StatusBar from '../../components/StatusBar';
import { LOADINGIMG } from '../../utils/model';
import UpdateDetail from './components/updateDetail';
import './index.less';


@inject('gameModel', 'indexModel')
@observer
class UpdateGame extends Component {
  static options = {
    addGlobalClass: true
  };
  config = {
    navigationBarTitleText: '游戏更新记'
  };
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      scrollTop: Math.random(),
      showDetail: {},
      statusControl: {
        showLoading: true,
        showDrawer: false
      }
    };
  }

  showImg(url) {
    Taro.previewImage({
      current: url,
      urls: [url]
    });
  }

  async componentDidMount() {
    this.setState({
      statusControl: {
        ...this.state.statusControl,
        showLoading: true
      }
    });
    const { gameModel } = this.props;
    let list = [];
    const update = gameModel.getUpdate;
    if (update.length === 0) {
      const res = await gameApi('updateList', {});
      console.log(res.result.data);
      list = res.result.data;
      gameModel.saveAllUpdate(list);
    }
    list = gameModel.getUpdate;
    const detail = await this.getDetail(list[0].time);
    this.setState({
      list,
      showDetail: detail,
      statusControl: {
        ...this.state.statusControl,
        showLoading: false
      }
    });
  }

  showHistory() {
    this.setState({
      ...this.state.statusControl,
      statusControl: {
        showDrawer: true
      }
    });
  }
  hideHistory() {
    this.setState({
      ...this.state.statusControl,
      statusControl: {
        showDrawer: false
      }
    });
  }
  async getDetail(time) {
    const res = await gameApi('updateDetail', {
      time
    });
    return res.result.data;
  }
  async showDetail(index) {
    this.setState({
      statusControl: {
        ...this.state.statusControl,
        showLoading: true
      }
    });
    const data = await this.getDetail(this.state.list[index].time);
    this.setState({
      showDetail: data,
      scrollTop: Math.random(),
      statusControl: {
        ...this.state.statusControl,
        showLoading: false
      }
    });
    this.hideHistory();
  }
  render() {
    const { indexModel } = this.props;
    return (
      <ScrollView style={{ height: '100vh' }}>
        <StatusBar
          content='游戏更新记'
          fontColor='text-black'
          isBack
          backText=''
        />
        <ClLoading
          show={this.state.statusControl.showLoading}
          type='image'
          imgUrl={LOADINGIMG}
        />
        {this.state.list.length > 0 ? (
          <ScrollView
            scrollY
            scrollTop={this.state.scrollTop}
            scrollWithAnimation
            style={{
              background: 'none',
              height: `calc(100vh - ${indexModel.CustomBar +
                indexModel.StatusBar}px)`
            }}
            className={
              this.state.statusControl.showDrawer
                ? 'DrawerPage show'
                : 'DrawerPage'
            }
          >
            <View className='radius'>
              <UpdateDetail detail={this.state.showDetail} />

              <View className='flex justify-center padding-bottom'>
                <Button
                  className='cu-btn sm shadow bg-cyan radius'
                  onClick={this.showHistory}
                >
                  查看历史更新
                </Button>
              </View>
            </View>
          </ScrollView>
        ) : (
          ''
        )}
        <View
          className={
            this.state.statusControl.showDrawer
              ? 'DrawerClose show'
              : 'DrawerClose'
          }
          onClick={this.hideHistory}
        >
          <Text className='cuIcon-pullright' />
        </View>
        <ScrollView
          scrollY
          className={
            this.state.statusControl.showDrawer
              ? 'DrawerWindow show'
              : 'DrawerWindow'
          }
        >
          <View className='cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg'>
            {this.state.list.map((item, index) => (
              <View
                className='cu-item arrow bg-gray'
                key={item.title}
                onClick={this.showDetail.bind(this, index)}
              >
                <View class='content'>
                  <Text class='text-grey'>
                    {item.title}（{item.time}）
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    );
  }
}

export default UpdateGame;
