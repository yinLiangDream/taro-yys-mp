import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import dayjs from 'dayjs';

import { gameApi } from '../../api/index';

import Loading from '../../components/Loading';

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
      statusControl: {
        showLoading: true
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
        showLoading: true
      }
    })
    const { gameModel, indexModel } = this.props;
    let list = [];
    if (gameModel.update.length === 0) {
      const res = await gameApi('update', {});
      list = res.result.data
        .filter(item => item.type === 2)
        .map(item => {
          const title = JSON.parse(item.content).body.text.split(' ')[1];
          const url = `${indexModel.baseUrl}updateImg/${dayjs(
            item.createTime
          ).format('YYYY-M-D')}-0.jpg`;
          return {
            title,
            url
          };
        });
      gameModel.saveAllUpdate(list);
    }
    list = gameModel.update;
    this.setState({
      list,
      statusControl: {
        showLoading: false
      }
    });
  }
  render() {
    const updateList = this.state.list.map((item, index) => (
      <View key={index}>
        <View className='cu-card case'>
          <View className='cu-item shadow'>
            <View classNamea='cu-item shadow'>
              <View className='text-Abc text-lg padding bg-gradual-blue'>
                {item.title}
              </View>
              <View
                className='image'
                onClick={this.showImg.bind(this, item.url)}
              >
                <Image src={item.url} mode='aspectFill' lazy-load />
              </View>
            </View>
          </View>
        </View>
      </View>
    ));
    return (
      <View>
        <Loading show={this.state.statusControl.showLoading} />
        {updateList}
      </View>
    );
  }
}

export default UpdateGame;
