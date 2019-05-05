import Taro, { Component } from '@tarojs/taro';
import PropTypes from 'prop-types';
import { View, Input, Icon, Image } from '@tarojs/components';

import styles from './index.module.less';

export default class SearchBar extends Component {
  static options = {
    addGlobalClass: true
  };
  static defaultProps = {
    addflag: false,
    addimg: '',
    onSearch: () => {},
    placeholder: '请输入'
  };
  constructor(props) {
    super(props);
    this.state = {
      searchstr: '',
      searchflag: false
    };
  }

  getfocus() {
    this.setState({
      searchflag: true
    });
  }
  searchList(e) {
    this.setState({
      searchstr: e.detail.value
    });
    this.props.onSearch(e.detail.value);
  }
  endsearchList() {
    this.props.onConfirm(this.state.searchstr);
  }
  blursearch() {
    this.cancelsearch();
  }
  activity_clear() {
    this.searchList({
      detail: {
        value: ''
      }
    });
    this.getfocus();
  }
  cancelsearch() {
    this.setState({
      searchflag: false
    });
  }
  addhandle() {}

  render() {
    const { addflag, addimg, placeholder } = this.props;
    return (
      <View className='wrapper'>
        <View className={styles.tit_seabox}>
          <View
            className={`${styles.tit_seabox_bar} ${
              addflag ? styles.tit_seabox_add : ''
            } ${this.state.searchflag ? styles.tit_start_search : ''}`}
          >
            <Icon type='search' size={Taro.pxTransform(32)} />
            <Input
              type='text'
              onInput={this.searchList}
              onConfirm={this.endsearchList}
              onFocus={this.getfocus}
              onBlur={this.blursearch}
              confirm-type='search'
              value={this.state.searchstr}
              focus={this.state.searchflag}
              placeholder={placeholder}
            />
            {this.state.searchflag ? (
              <Icon onClick={this.activity_clear} type='clear' size={Taro.pxTransform(28)} />
            ) : (
              ''
            )}
          </View>
          {this.state.searchflag ? (
            <View
              onClick={this.cancelsearch}
              className={
                styles.activity_seabtn + ' cu-tag round bg-gray light lg'
              }
            >
              取消
            </View>
          ) : (
            ''
          )}
          {addflag ? (
            <View className={this.activity_add}>
              <Image onClick={this.addhandle} src={addimg} />
            </View>
          ) : (
            ''
          )}
        </View>
      </View>
    );
  }
}

SearchBar.protoTypes = {
  addflag: PropTypes.bool,
  addimg: PropTypes.string,
  onSearch: PropTypes.function,
  placeholder: PropTypes.string
};
