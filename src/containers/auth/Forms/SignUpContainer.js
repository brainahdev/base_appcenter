/**
 * SignUp Screen
 *
 * 
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,Alert,Linking,
  TouchableOpacity,
  ListView,
  TextInput,
} from 'react-native';
import Loading from '@components/general/Loading';
import { Actions } from 'react-native-router-flux';
import * as UserActions from '@redux/user/actions';
import { connect } from 'react-redux';
import { AppConfig} from '@constants/';

import Strings from '@lib/string.js'
import NavComponent from '@components/NavComponent.js'
// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';
import { CheckBox } from 'react-native-elements'
// Components
import { Spacer, Text, Button,Card,FormInput,} from '@ui/';

const mapStateToProps = () => ({
});
const mapDispatchToProps = {
  signup: UserActions.signup,
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
});

/* Component ==================================================================== */
class SignUp extends Component {
  static componentName = 'SignUp';
  static propTypes = {
	signup: PropTypes.func.isRequired,
  }
  constructor(props) { 
	super(props); 
	this.state={
		username:'',
		firstname:'',
		lastname:'',
		email:'',
		password:'',
		confirmpassword:'',
		loading:false,
		terms:true,
		userLang:'en',
	};
	this.firstname = '';
	this.lastname = '';
	this.confirmpwd = '';
	this.enteremail = '';
	this.enterpwd = '';
	this.enterusername = '';
	this.setUserLanguage();
  }
  async setUserLanguage() { 
		var l = await AsyncStorage.getItem('userLang'); 
		this.setState({userLang:l});
	} 
  terms=()=>{
	  Linking.openURL(AppConfig.terms_url).catch(err => console.error('An error occurred', err));
  }
  signup=()=>{
	  var firstname = this.state.firstname;
	  firstname = firstname.trim();
	  var lastname = this.state.lastname;
	  lastname = lastname.trim();
	  var username = this.state.username;
	  username = username.trim();
	  var email = this.state.email;
	  email = email.trim();
	  var pwd = this.state.password;
	  pwd = pwd.trim();
	  var cpwd = this.state.confirmpassword;
	  var re = /^.+@.+\..+$/i;
	  cpwd = cpwd.trim();
	  
	  if(firstname == ''){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].enteryourfirstname,
			  [
			  {text: 'OK', onPress: () => {console.log('OK Pressed')
			  this.enterfirstname.focus();
			  }
			  },
			  ],
			  { cancelable: false }
			);
	  }
	  else if(lastname == ''){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].enteryourlastname,
			  [
			  {text: 'OK', onPress: () => {console.log('OK Pressed')
			  this.enterlastname.focus();
			  }
			  },
			  ],
			  { cancelable: false }
			);
	  }
	  else if(username == ''){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].enteryourusername,
			  [
			  {text: 'OK', onPress: () => {console.log('OK Pressed')
			  this.enterusername.focus();
			  }
			  },
			  ],
			  { cancelable: false }
			);
	  }
	  else if(username.length <3){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].minlengthusername,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if(email==''){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].enteryouremail,
			  [
			  {text: 'OK', onPress: () => {console.log('OK Pressed')
			  this.enteremail.focus();
			  }
			  },
			  ],
			  { cancelable: false }
			);
	  }else if (!re.test(email)){
			 Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].entervalidemail,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if(pwd == ''){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].enteryourpassword,
			  [
			  {text: 'OK', onPress: () => {console.log('OK Pressed')
			  this.enterpwd.focus();
			  }
			  },
			  ],
			  { cancelable: false }
			);
	  }
	  else if(pwd.length < 6){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].minlenghtpwd,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if(cpwd == ''){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].confirmyourpassword,
			  [
			  {text: 'OK', onPress: () => {console.log('OK Pressed');
			  this.confirmpwd.focus();
			  }
			  },
			  ],
			  { cancelable: false }
			);
	  }
	  else if(pwd.length <6){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].minlengthpassword,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if(cpwd != pwd){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].passwordmismatch,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }else if(this.state.terms == false){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].acceptterms,
			  [ 
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }else{
		  var payload =	{
			  "role_id": 1,
			  "username": username,
			  "email": email,
			  "first_name": firstname,
			  "last_name": lastname,
			  "is_agree_terms_conditions": 1,
			  "password": pwd,
			  "confirm_password": cpwd
			}
		  this.setState({loading:true});
			this.props.signup(payload).then((resp) => {
				this.setState({loading:false});
				//{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjExLCJpYXQiOjE1MzM5NzExNjEsImV4cCI6MTUzMzk3ODE2MSwibmJmIjoxNTMzOTcyMTYxfQ.P_zT17H8_U4zKrBgnVqdVjrlhNMrw9zs2FDbVFk_wR4","role_id":1,"username":"kannan5","email":"vj.kannan5@agriya.in","first_name":"kannan","last_name":"five","is_agree_terms_conditions":1,"is_active":1,"is_email_confirmed":1,"is_mobile_number_verified":1,"updated_at":"2018-08-11 12:52:40","created_at":"2018-08-11 12:52:40","id":11,"error":{"code":0,"message":"You have successfully registered with our site.","raw_message":"","fields":""}}

				if(resp.error){
					Alert.alert(
					  AppConfig.appName,
					  resp.error.message,
					  [
					  {text: 'OK', onPress: () => {Actions.authLanding()}},
					  ],
					  { cancelable: false }
					);
				}
			}).catch(() => {
				console.log("error");
			});
	  }
  }
  render = () => (
    <View style={[AppStyles.container, styles.background]}>
		<NavComponent backArrow={true} title={Strings.props[this.state.userLang].signupheader} />
		<Card>
				<View style={{height:AppSizes.screen.height-170}}>
					<View style={{width:AppSizes.screen.width-50,height:50,backgroundColor:'transparent'}}>
						<TextInput ref={input => this.enterfirstname = input} placeholderTextColor = "#000" style={{color:'#000'},[AppStyles.regularFontText]} containerStyle={{backgroundColor:'transparent',borderBottomWidth:1}} 
						onChangeText={(firstname) => this.setState({firstname})}
						underlineColorAndroid='#c8ccd1'
						placeholder={Strings.props[this.state.userLang].enteryourfirstname}/>
					</View>
					<View style={{width:AppSizes.screen.width-50,height:50,backgroundColor:'transparent'}}>
						<TextInput ref={input => this.enterlastname = input} placeholderTextColor = "#000" style={{color:'#000'},[AppStyles.regularFontText]} containerStyle={{backgroundColor:'transparent',borderBottomWidth:1}} 
						onChangeText={(lastname) => this.setState({lastname})}
						underlineColorAndroid='#c8ccd1'
						placeholder={Strings.props[this.state.userLang].enteryourlastname}/>
					</View>
					<View style={{width:AppSizes.screen.width-50,height:50,backgroundColor:'transparent'}}>
						<TextInput ref={input => this.enterusername = input} placeholderTextColor = "#000" style={{color:'#000'},[AppStyles.regularFontText]} containerStyle={{backgroundColor:'transparent',borderBottomWidth:1}} 
						onChangeText={(username) => this.setState({username})}
						underlineColorAndroid='#c8ccd1'
						placeholder={Strings.props[this.state.userLang].enteryourusername}/>
					</View>
					<View style={{width:AppSizes.screen.width-50,height:50,backgroundColor:'transparent'}}>
						<TextInput ref={input => this.enteremail = input} placeholderTextColor = "#000" style={{color:'#000'},[AppStyles.regularFontText]} containerStyle={{backgroundColor:'transparent',borderBottomWidth:1}} 
						onChangeText={(email) => this.setState({email})}
						underlineColorAndroid='#c8ccd1'
						placeholder={Strings.props[this.state.userLang].enteryouremail}/>
					</View>
					<View style={{width:AppSizes.screen.width-50,height:50,backgroundColor:'transparent'}}>
						<TextInput ref={input => this.enterpwd = input} placeholderTextColor = "#000" style={{color:'#000'},[AppStyles.regularFontText]} containerStyle={{backgroundColor:'transparent',borderBottomWidth:1,}} 
						onChangeText={(password) => this.setState({password})}
						underlineColorAndroid='#c8ccd1'
						secureTextEntry={true}
						placeholder={Strings.props[this.state.userLang].enteryourpassword}
						/>
					</View>
					<View style={{width:AppSizes.screen.width-50,height:50,backgroundColor:'transparent'}}>
						<TextInput ref={input => this.confirmpwd = input} placeholderTextColor = "#000" style={{color:'#000'},[AppStyles.regularFontText]} containerStyle={{backgroundColor:'transparent',borderBottomWidth:1}} 
						onChangeText={(confirmpassword) => this.setState({confirmpassword})}
						underlineColorAndroid='#c8ccd1'
						secureTextEntry={true}
						placeholder={Strings.props[this.state.userLang].confirmyourpassword}/>
					</View>
					<View style={{width:AppSizes.screen.width-50,height:50,backgroundColor:'transparent'}}>
						<CheckBox
						  title={Strings.props[this.state.userLang].acceptterms}
						  checked={this.state.terms}
						  containerStyle={{backgroundColor:'transparent',left:0,paddingLeft:0,marginLeft:0}}
						  fontFamily={'Opensans'}
						  onPress={this.terms}
						  onIconPress={()=>{
							  if(this.state.terms == false)
								  this.setState({terms:true});
							  else
								  this.setState({terms:false});
								  
						  }}
						  textStyle={{fontSize:12,fontWeight:'normal'}}
						/>
					</View>
					<View style={{height:30}} />
					<Button
						title={Strings.props[this.state.userLang].submit}
						backgroundColor={AppColors.brand.btnColor}
						onPress={this.signup}
						textStyle={{color:'#FFFFFF'}}
						borderRadius = {50}
						fontSize={15}
						buttonStyle={{padding:14}}
						outlined
					  /> 
				</View>
				{this.state.loading?<View style={AppStyles.LoaderStyle}><Loading color = {AppColors.brand.primary}/></View>:(null)}
		</Card>
    </View>
  )
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps,mapDispatchToProps)(SignUp); 
