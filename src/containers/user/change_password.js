/**
 * Change Password Screen
 *
 * 
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,Alert,ScrollView,
  TouchableOpacity,AsyncStorage,
  ListView,
} from 'react-native';
import * as UserActions from '@redux/user/actions';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { AppConfig} from '@constants/';

import Strings from '@lib/string.js'
import NavComponent from '@components/NavComponent.js'
// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';
import { CheckBox } from 'react-native-elements'
// Components
import { Spacer, Text, Button,Card,FormInput,LblFormInput} from '@ui/';
const mapStateToProps = state =>{return({ user_data: state.user.user_data})};
const mapDispatchToProps = {
  change_password: UserActions.change_password,
};
/* Styles ====================================================================  */
const styles = StyleSheet.create({
  background: {
    backgroundColor: AppColors.brand.white,
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
});

/* Component ==================================================================== */
class ChangePassword extends Component {
  static componentName = 'ChangePassword';
  static propTypes = {
	change_password: PropTypes.func.isRequired,
  }
  constructor() { super(); 
	this.state={
		userLang:'en',
		current_password:'',
		new_password:'',
		confirm_password:'',
	}
	this.setUserLanguage();
  }
  async setUserLanguage() { 
    var l = await AsyncStorage.getItem('userLang'); 
	this.setState({userLang:l});
  } 
  onSubmit = () =>{
	  if(this.state.current_password.trim() == ''){
		   Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].entercurrentpassword,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if(this.state.new_password.trim() == ''){
		   Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].enternewpassword,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if(this.state.confirm_password.trim() == ''){
		   Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].confirmyourpassword,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if(this.state.confirm_password.trim() != this.state.new_password.trim()){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].passwordmismatch,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if(this.state.new_password.length < 6 || this.state.confirm_password.length<6){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].minlengthpassword,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }else{
		  var payload = {"password":this.state.current_password,"new_password":this.state.new_password,"confirm_password":this.state.confirm_password}
		  this.props.change_password(payload,this.props.user_data.id).then((response) => {
			  if(response.error && response.error.code == 0){
				Alert.alert(
				  AppConfig.appName,
				  Strings.props[this.state.userLang].passwordchangedsuccessfully,
				  [
				  {text: 'OK', onPress: () => console.log('OK Pressed')},
				  ],
				  { cancelable: false }
				);
			  }else{
				Alert.alert(
				  AppConfig.appName,
				  response.error.message,
				  [
				  {text: 'OK', onPress: () => console.log('OK Pressed')},
				  ],
				  { cancelable: false }
				);  
			  }
		  }).catch(() => {
				console.log("respppp dddd error");
		  });
	  }
  }
  render = () => (
    <View style={[AppStyles.container, styles.background],{justifyContent:'center',alignItems:'center'}}>
		<View >
			<LblFormInput placeholderTxt={Strings.props[this.state.userLang].currentpassword} lblTxt={Strings.props[this.state.userLang].currentpassword} secureTextEntry={true} value={this.state.current_password} onChangeText={(text) => {this.setState({current_password:text})}}/> 
			<LblFormInput placeholderTxt={Strings.props[this.state.userLang].newpassword} secureTextEntry={true} lblTxt={Strings.props[this.state.userLang].newpassword}
			value={this.state.new_password} onChangeText={(text) => {this.setState({new_password:text})}}/>
			<LblFormInput placeholderTxt={Strings.props[this.state.userLang].repassword} secureTextEntry={true} lblTxt={Strings.props[this.state.userLang].repassword}
			value={this.state.confirm_password} onChangeText={(text) => {this.setState({confirm_password:text})}}/>
			<View style={{height:20}} /> 
			<Button
				title={Strings.props[this.state.userLang].save}
				backgroundColor={AppColors.brand.btnColor}
				textStyle={{color:'#FFFFFF'}}
				onPress={this.onSubmit}
				borderRadius = {50}
				fontSize={15}
				buttonStyle={{padding:14}}
				outlined
			  /> 
		</View>
    </View>
  )
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps,mapDispatchToProps)(ChangePassword); 
