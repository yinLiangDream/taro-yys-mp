import Taro, { Component, pxTransform } from '@tarojs/taro';
import { View, ScrollView, Block } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import { ClTabs, ClCard, ClAvatar, ClLayout, ClTag, ClText } from 'mp-colorui';
import { gameApi } from '../../api/index';

import Loading from '../../components/Loading';
import StatusBar from '../../components/StatusBar';

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
      scroll: 0,
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
  }

  clickTitle(index) {
    this.setState({
      current: index,
      scroll: Math.random()
    });
  }
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
    return (
      <View>
        <StatusBar
          content='御魂查询'
          fontColor='text-black'
          isBack
          backText=''
        />
        <Loading show={this.state.statusControl.showLoading} />
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
      </View>
    );
  }
}

export default Yuhun;
