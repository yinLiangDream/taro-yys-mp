import Taro, { Component } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import PropTypes from "prop-types";
import { ClText } from "mp-colorui";

export default class UpdateDetail extends Component {
  static options = {
    addGlobalClass: true
  };
  static defaultProps = {
    detail: {
      desc: []
    }
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        className="flex flex-direction justify-center margin"
        style={{
          border: "1px solid lightgray",
          borderRadius: "10px"
        }}
      >
        <View className="flex text-lg text-bold justify-center padding">
          <Text>{this.props.detail.title}</Text>
        </View>
        <View className="text-sm justify-end flex padding-right text-gray">
          {this.props.detail.time}
        </View>
        <View className="padding text-gray">
          {this.props.detail.desc.map(item => (
            <View key={item.title}>
              <View className="text-bold text-red text-df">{item.title}</View>
              {item.desc.map((itemDesc, index) => (
                <View key={"key_" + index}>
                  <ClText text={itemDesc} size="small" textColor="grey" />
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  }
}

UpdateDetail.propTypes = {
  detail: PropTypes.object
};
