import Taro, { Component } from "@tarojs/taro";
import { ClLayout } from "mp-colorui";

class ChartsDetail extends Component {
  static option = {
    addGlobalClass: true
  };
  static config = {
    navigationBarTitleText: "角色详情"
  };
  render() {
    return <ClLayout></ClLayout>;
  }
}

export default ChartsDetail;
