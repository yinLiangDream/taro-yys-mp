import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types'

let time = null
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
      time = setTimeout(() => {
        this.loadProgress();
      }, 60);
    } else {
      clearTimeout(time)
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

  componentWillReceiveProps() {
    console.log('componentWillReceiveProps')
    const { show } = this.props
    if (!show) {
      this.setState({
        statusControl: {
          loadProgress: 0
        }
      })
      this.loadProgress();
    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
  }
  render() {
    const { show } = this.props
    const showOrHide = show ? 'show':'hide'
    return (
      <View className={`load-progress ${showOrHide}`}>
        <View
          class='load-progress-bar bg-cyan'
          style={`transform: translate3d(-${100 - this.state.statusControl.loadProgress}%, 0px, 0px)`}
        />
        <View class='load-progress-spinner text-cyan' />
      </View>
    )
  }
}

Loading.propTypes = {
  show: PropTypes.bool
}

export default Loading;
