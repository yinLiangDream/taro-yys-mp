import Taro, { Component, pxTransform } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { ClLayout, ClFlex, ClButton } from "mp-colorui";
import { inject, observer } from "@tarojs/mobx";

@inject("indexModel")
@observer
class Mystery extends Component {
  static option = {
    addGlobalClass: true
  };

  static config = {
    navigationBarTitleText: "每月神秘图案"
  };

  constructor(props) {
    super(props);
    this.state = {
      months: Array.from(Array(12)),
      currentMonth: new Date().getMonth()
    };
  }

  changeMonth(index) {
    this.setState({
      currentMonth: index
    });
  }

  render() {
    const { months, currentMonth } = this.state;
    const { indexModel } = this.props;
    return (
      <ClLayout>
        <ClFlex wrap justify="between">
          {months.map((item, index) => (
            <View key={`key${index}`}>
              <ClLayout padding="small">
                <ClButton
                  style={{ width: pxTransform(120) }}
                  long
                  text={`${index + 1}月`}
                  plain={currentMonth !== index}
                  shape="round"
                  onClick={this.changeMonth.bind(this, index)}
                />
              </ClLayout>
            </View>
          ))}
        </ClFlex>
        <ClLayout margin="large" marginDirection="top">
          <ClFlex align="center" justify="center">
            <Image
              src={`${indexModel.baseUrl}/mysterious_pattern/${currentMonth +
                1}.png`}
              mode="widthFix"
              style={{ width: "90vw" }}
            />
          </ClFlex>
        </ClLayout>
      </ClLayout>
    );
  }
}

export default Mystery;
