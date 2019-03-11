import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';

class Loading extends Component {

  static options = {
    addGlobalClass: true
  }
  constructor(props) {
    super(props);
    this.state = {
      statusControl: {
        loadProgress: 0
      }
    };
  }

  loadProgress() {
    this.setState({
      statusControl: {
        loadProgress: this.state.statusControl.loadProgress + 3
      }
    });
    if (this.state.statusControl.loadProgress < 100) {
      setTimeout(() => {
        this.loadProgress();
      }, 80);
    } else {
      this.setState({
        statusControl: {
          loadProgress: 100
        }
      });
    }
  }

  componentDidShow() {
    this.setState({
      statusControl: {
        loadProgress: 0
      }
    })
    this.loadProgress();
  }

  render() {
    const { show } = this.props
    const showOrHide = show ? 'show':'hide'
    return (
      <View className={`load-progress ${showOrHide}`}>
        <View
          class='load-progress-bar bg-mauve'
          style={`transform: translate3d(-${100 - this.state.statusControl.loadProgress}%, 0px, 0px)`}
        />
        <View class='load-progress-spinner text-mauve' />
      </View>
    )
  }
}

export default Loading;
