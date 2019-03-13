import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types'

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
      }, 60);
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

Loading.propTypes = {
  show: PropTypes.bool
}

export default Loading;
