import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import PropTypes from "prop-types";

export default class ShowDOM extends Component {
  static options = {
    addGlobalClass: true
  };
  constructor(props) {
    super(props);
  }

  render() {
    const { show } = this.props;
    return (
      <View
        style={{
          display: show ? "" : "none"
        }}
      >
        {this.props.children}
      </View>
    );
  }
}

ShowDOM.propTypes = {
  show: PropTypes.bool
};
