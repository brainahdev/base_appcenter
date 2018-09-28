/**
 * Buttons
 *
     <Button text={'Server is down'} />
 *
 */
import React, { Component,PropTypes } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
// Consts and Libs
import { AppColors, AppFonts, AppSizes } from '@theme/';
/* Component ==================================================================== */
class AppButton extends Component {
  static propTypes = {
    title: PropTypes.string,
    titleStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.shape({})]),
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.shape({})]),
    onPress: PropTypes.func
  }
  static defaultProps = {
    title: 'Title',
    style: {},
  }
  render = () => {
    const {
      title,
      style,
      titleStyle,
      onPress,
    } = this.props;
    var buttonStyle = new Array;
    buttonStyle.push({height:55,borderRadius:50,backgroundColor:"#ffffff",justifyContent:'center',alignItems:'center'});
    if (style) {
      buttonStyle.push(style);
    }
    var textStyle = new Array;
    textStyle.push({ fontSize: 14, color: 'black',fontFamily:'OpenSans'});
    if (style) {
      textStyle.push(titleStyle);
    }
    return (
      <TouchableOpacity style={buttonStyle} onPress={onPress}>
        <Text style={textStyle}>{title}</Text>
      </TouchableOpacity>
    )
  }
}
/* Export Component ==================================================================== */
export default AppButton;