import Taro, {Component} from '@tarojs/taro';
import {Text, View} from '@tarojs/components';
import {inject} from "@tarojs/mobx";
import PropTypes from 'prop-types';
import {homeRouter} from '../../utils/router';

@inject('indexModel')
class StatusBar extends Component {
  static options = {
    addGlobalClass: true
  };
  state = {};

  backPage() {
    Taro.navigateBack()
  }
  toHome() {
    Taro.redirectTo({
      url: homeRouter
    })
  }
  static defaultProps = {
    backText: ''
  };
  render() {
    const {indexModel, bgImage, isBack, isCustom, bgColor, fontColor, backText, noHeight} = this.props;
    return (
      <View className={`cu-custom ${fontColor || ''}`} style={{height: `${noHeight ? 0 : indexModel.CustomBar}px`}}>
        <View
          className={`cu-bar fixed ${bgImage ? 'none-bg text-white bg-img' : ''} ${bgColor}`}
          style={{
            height: `${indexModel.CustomBar}px`,
            paddingTop: `${indexModel.StatusBar}px`,
            backgroundImage: `${bgImage ? 'url(' + bgImage + ')' : 'none'}`
          }}
        >
          {
            isBack ?
              <View className='action' onClick={this.backPage} style={{lineHeight: '100%'}}>
                <Text className='icon-back' />
                <Text>{backText}</Text>
              </View> : ''
          }
          {
            isCustom ?
              <View className='action border-custom' style={{
                width: `${indexModel.Custom.width}px`,
                height: `${indexModel.Custom.height}px`,
              }}
              >
                <Text className='icon-back' onClick={this.backPage.bind(this)} />
                <Text className='icon-homefill' onClick={this.toHome.bind(this)} />
              </View> : ''
          }
          <View className='content' style={{top: `${indexModel.StatusBar}px`}}>
            {this.props.content || ''}
          </View>
          {this.props.rightContent || ''}
        </View>
      </View>
    )
  }
}

StatusBar.propTypes = {
  onBackPage: PropTypes.func,
  bgColor: PropTypes.string,
  fontColor: PropTypes.string,
  isCustom: PropTypes.bool,
  isBack: PropTypes.bool,
  bgImage: PropTypes.string,
  backText: PropTypes.string,
  content: PropTypes.element,
  rightContent: PropTypes.element,
  noHeight: PropTypes.bool
};

export default StatusBar;
