/**
 * Buttons
 *
     <Button text={'Server is down'} />
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, TextInput, Dimensions } from 'react-native';
// import DatePicker from 'react-native-datepicker';
var moment = require('moment');
// Consts and Libs
import { AppColors, AppFonts, AppSizes } from '@theme/';
/* Component ==================================================================== */
class AppInput extends Component {
  static propTypes = {
    color: PropTypes.string,
    textAlign: PropTypes.string,
    color: PropTypes.string,
    type: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.shape({})]),
    textStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.shape({})]),
  }
  static defaultProps = {
    style: {},
    textStyle: {},
    color: 'white',
    type: 'text',
    textAlign: 'center',
    placeholderTextColor: '#ececec',
  }
  render = () => {
    const {
      style,
      color,
      textAlign,
      textStyle,
      type,
      placeholderTextColor,
      ...textProps
    } = this.props;
    var viewStyle = new Array;
    viewStyle.push({ height: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1 });
    if (style) {
      viewStyle.push(style);
    }
    var textStyleLocal = new Array;
    textStyleLocal.push({ flex: 1, color: color,fontFamily:'OpenSans',textAlign: textAlign, fontSize: 14,left:5, });
    if (textStyle) {
      textStyleLocal.push(textStyle);
    }
    if (type == 'date') {
      return (
        <View style={viewStyle}>
          {/* <DatePicker
            style={{ width: Dimensions.get('window').width - 20 }}
            date={this.props.value}
            mode="date"
            placeholder={this.props.placeholder}
            showIcon={false}
            format="YYYY-MM-DD"
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateInput: {
                borderWidth: 0, justifyContent: 'center', alignItems: 'center',
              },
              placeholderText: { color: placeholderTextColor, fontSize: 14, fontFamily: 'OpenSans' }, dateText: textStyle
              // ... You can check the source to find the other keys.
            }}
            onDateChange={this.props.onDateChange}
          /> */}
        </View>
      )
    } else {
      return (
        <View style={viewStyle}>
          <TextInput
          placeholderTextColor={placeholderTextColor}
          style={textStyleLocal}
          autoCapitalize='none' underlineColorAndroid={'transparent'} autoCorrect={false} {...textProps} />
        </View>
      )
    }
  }
}
/* Export Component ==================================================================== */
export default AppInput;