/**
 * Forgot password Screen
 *
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  Alert,
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
// Components
import { Spacer, Text, Button,Card,FormInput,} from '@ui/';

const mapStateToProps = () => ({
});
const mapDispatchToProps = {
  forgot_password: UserActions.forgot_password,
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
class ResetPassword extends Component {
  static componentName = 'ResetPassword';
  constructor() { super(); 
	this.state={email:'',userLang:'en',}
	this.setUserLanguage();
  }
  async setUserLanguage() { 
    var l = await AsyncStorage.getItem('userLang'); 
	this.setState({userLang:l});
  } 
  static propTypes = {
	Search: PropTypes.func.isRequired,
  }
  changePassword=()=>{
	  var email = this.state.email;
	  email = email.trim();
	  if(email==''){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].enteryouremail,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
			var payload ={"email":email}
			this.props.forgot_password(payload).then((resp) => {
				console.log("forgot_password " + JSON.stringify(resp));
				if(resp.error){
					Alert.alert(
					  AppConfig.appName,
					  resp.message,
					  [
					  {text: 'OK', onPress: () => Actions.pop()},
					  ],
					  { cancelable: false }
					);
				}
				else{
					Alert.alert(
					  AppConfig.appName,
					  Strings.props[this.state.userLang].error,
					  [
					  {text: 'OK', onPress: () => console.log('OK Pressed')},
					  ],
					  { cancelable: false }
					);
				}
			}).catch(() => {
				console.log("error");
			});
	  }else{
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].entervalidemail,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }

  }
  render = () => (
    <View style={[AppStyles.container, styles.background]}>
		<NavComponent backArrow={true} title={"FORGOT PASSWORD"} />
		<Card>
			<View>
				<Text>{Strings.props[this.state.userLang].passphrase}</Text>
				<View style={{height:140,margin:10}}> 
					<View style={{flex:0.9,backgroundColor:'transparent'}}>
						<FormInput placeholderTextColor = "#000" style={{color:'#000'},[AppStyles.regularFontText]} containerStyle={{backgroundColor:'transparent',borderBottomWidth:1}} 
						onChangeText={(email) => this.setState({email})}
						placeholder={Strings.props[this.state.userLang].enteryouremail}/>
					</View>
					<Button
						title={Strings.props[this.state.userLang].submit}
						backgroundColor={AppColors.brand.btnColor}
						onPress={this.changePassword}
						textStyle={{color:'#FFFFFF'}}
						borderRadius = {50}
						fontSize={15}
						buttonStyle={{padding:14}}
						outlined
					  /> 
				</View>
			</View>
		</Card>
    </View>
  )
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps,mapDispatchToProps)(ResetPassword); 
