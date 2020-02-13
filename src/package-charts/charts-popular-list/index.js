import Taro, { Component, pxTransform } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { ClTabBar } from "mp-colorui";

class ChartsPopularList extends Component {
  static option = {
    addGlobalClass: true
  };

  constructor() {
    super(...arguments);
  }

  render() {
    return (
      <View style={{ paddingBottom: pxTransform(120) }}>
        <ClTabBar
          fix
          bgColor="black"
          tabs={[
            { title: "胜率", badge: false, icon: "activity" },
            { title: "出场率", badge: false, icon: "hotfill" }
          ]}
        />
      </View>
    );
  }
}

export default ChartsPopularList;
