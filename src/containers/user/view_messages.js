/**
 * View Messages
 *
 * 
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,AsyncStorage,
  WebView,
} from 'react-native';
import * as UserActions from '@redux/user/actions';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { AppConfig} from '@constants/';
import Strings from '@lib/string.js'

// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';
import NavComponent from '@components/NavComponent.js'
// Components
import { Spacer, Text, Button,Card,FormInput,} from '@ui/';
const striptags = require('striptags');
const mapStateToProps = () => ({
});
const mapDispatchToProps = {
 
};
/* Styles ====================================================================  */
const styles = StyleSheet.create({
  background: {
    backgroundColor: AppColors.brand.navbar,
    height: AppSizes.screen.height,
    width: AppSizes.screen.width,
  },
  col:{
	  width:(AppSizes.screen.width/2)-10,
  },
  header:{
	  fontWeight:'bold',
	  fontSize:12,
  },
  
  headerGrey:{
	  fontSize:12,
	  color:'#ada8a8'
  },
  normalText11:{
	  fontWeight:'normal',
	  fontSize:11
  },
  logo: {
    width: AppSizes.screen.width * 0.85,
    resizeMode: 'contain',
  },
  whiteText: {
    color: '#FFF',
  },
  col:{
	  width:(AppSizes.screen.width/2)-20,justifyContent:'center',alignItems:'center'
  },
  tab:{
	  margin:5,padding:3,minWidth:70,paddingLeft:10,paddingRight:10,backgroundColor:AppColors.brand.primary,borderRadius:10,justifyContent:'center',alignItems:'center'
  },
  selected_tab:{
	  margin:5,padding:3,minWidth:70,paddingLeft:10,paddingRight:10,backgroundColor:AppColors.brand.btnColor,borderRadius:10,justifyContent:'center',alignItems:'center'
  }
});

/* Component ==================================================================== */
class ViewMessage extends Component {
  static componentName = 'ViewMessage';

  constructor(props) { 
		super(props); 

  }
  compomentWillUnmount(){
	  if(this.props.reload)
		  this.props.reload();
  }
  render = () => 
    {
		var  data = this.props.view_data;
		data = data.replace(/\\/g, '');
		
    return(
    <View style={[AppStyles.container, styles.background]}>
		<NavComponent backArrow={true} title={this.props.title} />
		<View style={{flex: 1, flexDirection: 'row', width:AppSizes.screen.width-20,marginLeft:10,marginRight:10}}>
			<WebView
				source ={{html:data}}
			  />
		</View>
    </View>
  );
  }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps,mapDispatchToProps)(ViewMessage);
