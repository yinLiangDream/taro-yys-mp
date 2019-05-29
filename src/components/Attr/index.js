import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import { inject } from '@tarojs/mobx';

import styles from './index.module.less';

@inject('indexModel')
class AttrSS extends Component {
  static options = {
    addGlobalClass: true
  };
  constructor(props) {
    super(props);
    const { indexModel } = this.props;
    this.state = {
      percent: false,
      keyMap: indexModel.getAttrRoleMap
    };
  }

  componentDidMount() {
    const { name } = this.props;
    this.setState({
      percent: [
        'critRate',
        'critPower',
        'debuffResist',
        'debuffEnhance'
      ].includes(name)
    });
  }

  render() {
    const {
      name,
      noAwakeAttr,
      awakeAttr,
      attr,
      disabled,
      indexModel
    } = this.props;
    const attrMap = indexModel.getAttrMap;
    return (
      <View className={styles.attr}>
        <View className={styles.title}>
          <Image
            src={indexModel.baseUrl + 'attribute/' + name + '.png'}
            className={styles.img}
            mode='widthFix'
          />
          <View className={styles.text}>{this.state.keyMap[name]}</View>
        </View>
        <View className={styles.noAwakeAttr}>
          <Image
            src={attrMap[noAwakeAttr]}
            mode='widthFix'
            className={styles.img}
          />
          <View className={styles.text}>
            {'(' + attr.before_awake + (this.state.percent ? '%' : '') + ')'}
          </View>
        </View>
        {!disabled ? (
          <View className={styles.awakeAttr}>
            <Image
              src={attrMap[awakeAttr]}
              className={styles.img}
              mode='widthFix'
            />
            <View className={styles.text}>
              {'(' + attr.after_awake + (this.state.percent ? '%' : '') + ')'}
              {'+' + attr.diff + (this.state.percent ? '%' : '')}
            </View>
          </View>
        ) : (
          ''
        )}
        <View className={styles.border} />
      </View>
    );
  }
}

AttrSS.propTypes = {
  name: PropTypes.string,
  noAwakeAttr: PropTypes.string,
  awakeAttr: PropTypes.string,
  attr: PropTypes.object,
  disabled: PropTypes.bool
};

export default AttrSS;
