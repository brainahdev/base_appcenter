/**
 * Input Screen
 *
 * 
 */
import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
} from 'react-native';
import Strings from '@lib/string.js';
import PropTypes from 'prop-types';
// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';
// Components
import {FormInput} from '@ui/';

/* Component ==================================================================== */
class LblFormInput extends Component {
  static componentName = 'LblFormInput';
  constructor(props) { super(props); }
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
		var textStyleLocal = new Array;
		
		textStyleLocal.push({ color: AppColors.brand.txtinputcolor,textAlign:'left',fontFamily:'OpenSans',paddingLeft:0,paddingRight:0,paddingTop:5,paddingBottom:5,margin:0, fontSize: 12,borderBottomWidth:0.5,borderColor:AppColors.brand.black });
		
		if(this.props.textAlignVertical)
			textStyleLocal.push({textAlignVertical:this.props.textAlignVertical});
		if(this.props.background)
			textStyleLocal.push({backgroundColor:AppColors.brand.secondary});
		if(this.props.width)
			textStyleLocal.push({width:this.props.width});
		var multiline = false;
		if(this.props.multiline)
			multiline = this.props.multiline;
		var numberOfLines=1;
		if(this.props.numberOfLines)
			numberOfLines = this.props.numberOfLines
		
		
		var height=60;
		if(this.props.height)
			height=this.props.height;
		var editable = true;
		if(this.props.editable == false)
			editable = false;
		
		var value='';
		if(this.props.value)
			value= this.props.value
		var select_opt=0;
		if(this.props.select_opt)
			select_opt= 1;
	  return(
		<View style={{height:height,marginBottom:10,width:AppSizes.screen.width-50}}> 
			<Text style={{color: AppColors.brand.black, fontSize: 14,},[AppStyles.regularFontText]}>{this.props.lblTxt}:</Text>
			<View style={{flexDirection:'row'}}> 
					<View style={{flex:0.9}}>
						<TextInput
							ref={this.props.ref}
							placeholderTextColor={AppColors.brand.txtplaceholder} 
							style={textStyleLocal}
							editable = {editable}
							value={value}
							placeholder={this.props.placeholderTxt}
							autoCapitalize='sentences' 
							underlineColorAndroid={'transparent'} 
							numberOfLines={numberOfLines} 
							multiline={multiline} 
							autoCorrect={false} {...textProps} />
					</View>
					{select_opt ? 
						<View style={{flex:0.1,justifyContent:'center',alignItems:'center',borderBottomWidth:0.5,borderColor:AppColors.brand.black}}>
							<Image source={require('@images/down_arrow.png')}/>
						</View> 
					: null}					
			</View>
		</View>
	);
  }
}

/* Export Component ==================================================================== */
export default LblFormInput;
