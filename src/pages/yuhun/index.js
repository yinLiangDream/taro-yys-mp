import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import { AtTabs, AtTabsPane, AtCard, AtAvatar, AtTag } from 'taro-ui';

import { gameApi } from '../../api/index';

import Loading from '../../components/Loading';

@inject('gameModel', 'indexModel')
@observer
class Yuhun extends Component {
  config = {
    navigationBarTitleText: '御魂'
  };
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
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
        showLoading: false
      }
    };
  }

  async componentDidMount() {
    const {gameModel} = this.props
    this.setState(
      {
        statusControl: {
          ...this.state.statusControl,
          showLoading: true
        }
      },
      async () => {
        let data = []
        if (gameModel.yuhunInfo.length === 0) {
          const res = await gameApi('yuhun', {});
          gameModel.saveAllYuhun(res.result.data)
          data = res.result.data
        } else data = gameModel.yuhunInfo
        data.forEach((item, index) => {
          this.state.tabList
            .find(tab => tab.title === item['御魂类型'])
            .data.push(item);
        });
        console.log(this.state.tabList);
        this.setState({
          tabList: this.state.tabList,
          statusControl: {
            ...this.state.statusControl,
            showLoading: false
          }
        });
      }
    );
  }

  clickTitle(index) {
    this.setState({
      current: index
    });
  }

  render() {
    const { indexModel } = this.props;
    return (
      <View>
        <Loading show={this.state.statusControl.showLoading} />
        <AtTabs
          current={this.state.current}
          tabList={this.state.tabList}
          onClick={this.clickTitle.bind(this)}
          swipeable
        >
          {this.state.tabList.map((item, index) => (
            <AtTabsPane key={index} index={index} current={this.state.current}>
              {item.data.map((yuhun, indexYuhun) => (
                <AtCard
                  key={indexYuhun}
                  className='margin'
                  title={yuhun['御魂名称']}
                >
                  <View className='at-row at-row__align--center'>
                    <View className='at-col-3'>
                      <AtAvatar
                        circle
                        image={`${indexModel.baseUrl}yuhun_icon/${
                          yuhun['御魂图标']
                        }`}
                      />
                    </View>
                    <View className='at-col at-col--auto'>
                      <View className='padding-bottom-sm'>
                        <View className='at-row at-row__align--start at-row--wrap'>
                          <View className='at-col-1 at-col--auto'>
                            <AtTag
                              active
                              size='small'
                              type='primary'
                              className='margin-right-sm'
                            >
                              两件套
                            </AtTag>
                          </View>
                          <View className='at-col'>
                            <Text>{yuhun['二件套效果']}</Text>
                          </View>
                        </View>
                      </View>

                      <View>
                        <View className='at-row at-row__align--start at-row--wrap'>
                          <View className='at-col-1 at-col--auto'>
                            <AtTag
                              active
                              size='small'
                              type='primary'
                              className='margin-right-sm'
                            >
                              四件套
                            </AtTag>
                          </View>
                          <View className='at-col at-col--wrap'>
                            <Text>{yuhun['四件套效果']}</Text>
                          </View>
                        </View>
                      </View>

                      <View className='padding-top-sm'>
                        <View className='at-row at-row__align--start at-row--wrap'>
                          <View className='at-col-1 at-col--auto'>
                            <AtTag
                              active
                              size='small'
                              type='primary'
                              className='margin-right-sm'
                            >
                            获得方式
                            </AtTag>
                          </View>
                          <View className='at-col at-col--wrap'>
                            <Text>{yuhun['获得方式']}</Text>
                          </View>
                        </View>
                      </View>

                    </View>
                  </View>
                </AtCard>
              ))}
            </AtTabsPane>
          ))}
        </AtTabs>
      </View>
    );
  }
}

export default Yuhun;
