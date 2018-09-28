/**
 * Authenticate Screen
 *  - Entry screen for all authentication
 *  - User can tap to login, forget password, signup...
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component, PropTypes } from 'react';
import {View,Alert,Image,TextInput,Dimensions,AsyncStorage,NativeModules,StyleSheet,Modal,TouchableOpacity,ScrollView} from 'react-native';
import * as UserActions from '@redux/user/actions';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Loading from '@components/general/Loading';
import NavComponent from '@components/NavComponent.js'
import { SocialIcon,Icon } from 'react-native-elements';
import { AppConfig, ErrorMessages, APIConfig } from '@constants/';
import Strings from '@lib/string.js';
const FBSDK = require('react-native-fbsdk');
import LinkedInModal from 'react-native-linkedin'
import GoogleSignIn from 'react-native-google-sign-in';
const { RNTwitterSignIn } = NativeModules
const Constants = {
  //Dev Parse keysmjn
  TWITTER_COMSUMER_KEY: "diEqpEGxJddoZXaxfG5Rbjng9",
  TWITTER_CONSUMER_SECRET: "kxUDnbUEBmyfErPkVjqkr8B4irBn2wM5Gus5zhS7MTnBYtC61v"
}
const {
  LoginButton,
  LoginManager,
  AccessToken
} = FBSDK;
var {
  width,
    height
} = Dimensions.get('window');
// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';
// Components
import {
    Spacer,
    Button,
    FormInput,
    Text
} from '@ui/';

const mapStateToProps = () => ({
});
const mapDispatchToProps = {
  login: UserActions.userlogin,
  social_login: UserActions.social_login, 
  twitter_register: UserActions.twitter_register, 
  linkedin_get:UserActions.linkedin_get, 
  auth: UserActions.auth,
}

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    background: {
        backgroundColor: AppColors.brand.primary,
        height: AppSizes.screen.height,
        width: AppSizes.screen.width
    },
    logo: {
        width: AppSizes.screen.width * 0.85,
        resizeMode: 'contain'
    },
    whiteText: {
        color: '#FFF'
    },
    edit_text_style: {
        marginLeft: 20,
        marginRight: 20,
        borderColor: '#ccc',
        borderRadius: 10,
    },
    text_style: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text_style_1: {
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        fontSize: 14
    },
    btn_fb_style: {
        backgroundColor: AppColors.social_login_bg.facebook_login,
        marginLeft: 20,
        marginRight: 20,
    }, btn_google_style: {
        backgroundColor: AppColors.social_login_bg.google_login,
        marginLeft: 20, marginTop: 25, marginRight: 20,
    }, btn_submit: {
        marginLeft: 20, marginRight: 20,
    },
	modal:{
	  backgroundColor: '#fff',
	  height:AppSizes.screen.height/3,
	  width:AppSizes.screen.width-40,
	  borderRadius:3,
	  paddingTop:15,
	  paddingBottom:15,
	  paddingRight:20,
	  paddingLeft:20,
	  justifyContent:'flex-start',
	  alignItems:'flex-start',
  },
});

/* Component ==================================================================== */
class Authenticate extends Component {
    static componentName = 'Authenticate';
	static propTypes = {
		login: PropTypes.func.isRequired,
		social_login: PropTypes.func.isRequired,
		twitter_register: PropTypes.func.isRequired,
		linkedin_get:  PropTypes.func.isRequired,
		auth: PropTypes.func.isRequired,
    }
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
			isLoggedIn: false,
			getEmail:false,
			twitteremail: '', 
			twitterObj:'',
			loading:false,
			userLang:'en',
        };
		this.enterpwd = '';
		this.socialLogin.bind(this);
		this.setUserLanguage();
		if(this.props.logout)
			this.logOut();
    }
	async setUserLanguage() { 
		var l = await AsyncStorage.getItem('userLang'); 
		this.setState({userLang:l});
	} 
	logOut(){
		LoginManager.logOut();
    }
    validateEmail = (email) => {
        var re = /^.+@.+\..+$/i;
        return re.test(email);
    };
    validatePassword = (password) => {
        if (password.length < 6)
            return false;
        return true;
    };
    btn_normal_Signin = () => {
        var _email = this.state.email;
        var _password = this.state.password;
		if(_email.length == '' && _password.length == ''){
			 Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].enterlogincredentials,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
		}
		else if(_email.length == ''){
			 Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].enteryouremail,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
		}
        else if(!this.validateEmail(_email)){
			 Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].entervalidemail,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
		}
		else if(_password.length == ''){
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
		else if(!this.validatePassword(_password)){
			 Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].minlenghtpwd,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
		}
		else{
			this.setState({loading:true});
			var payload ={"email":_email,"password":_password}
			this.props.login(payload).then((resp) => {
				//{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjIsImlhdCI6MTUzMzk3MjQ2OSwiZXhwIjoxNTMzOTc5NDY5LCJuYmYiOjE1MzM5NzM0Njl9.6RDIIHHUgy3QPLsox2S3II8CqBxTlJ2v2fgVMysnzsg","id":2,"created_at":"2018-08-11 11:29:34","updated_at":"2018-08-11 11:29:34","role_id":1,"username":"kannan","email":"vj.kannan@agriya.in","first_name":"kannan","last_name":"vj","dob":"2000-08-11","about_me":null,"gender_id":"1","language_id":null,"user_login_count":1,"is_agree_terms_conditions":1,"is_active":1,"is_email_confirmed":1,"activate_hash":null,"address":null,"address1":null,"city_id":1,"state_id":1,"country_id":102,"latitude":13,"longitude":80,"postal_code":"600032","full_address":null,"mobile":"9940909091","mobile_code":null,"is_mobile_number_verified":1,"available_wallet_amount":"0.00","user_view_count":"0","user_favorite_count":"0","attachment":null,"error":{"code":0,"message":"","raw_message":"","fields":""}}

				if(resp.token){
					//auth and get user details
					AsyncStorage.setItem('userToken', resp.token); 
					AsyncStorage.setItem('userId', resp.id.toString());
					console.log("logged =============" + resp.id + " = "+ resp.token);
					this.props.auth({"token":resp.token,"userId":resp.id}).then((resp) => {
						if(resp.data){
							this.setState({loading:false});
							Actions.Search();
						}
					}).catch(() => {
						console.log("error");
					});
					//auth and get user details
				}
				else{
					Alert.alert(
					  AppConfig.appName,
					  Strings.props[this.state.userLang].checklogindetails,
					  [
					  {text: 'OK', onPress: () => console.log('OK Pressed')},
					  ],
					  { cancelable: false }
					);
					this.setState({loading:false});
				}
			}).catch(() => {
				console.log("error");
			});
		}
    }
	socialLogin=(payload)=>{
		if(payload.provider == 'facebook' || (payload.provider == 'twitter' && payload.email)){
		//call to server for login
		console.log("ddddd" + JSON.stringify(payload));
			this.props.social_login(payload).then((resp) => {
				console.log("ddddd ddd" + JSON.stringify(payload));
				if(payload.provider == 'twitter' && resp.thrid_party_profile){
					console.log(JSON.stringify(resp));
					resp['email'] = payload.email;
					this.props.twitter_register(resp).then((response) => {
						console.log(JSON.stringify(response));
						if(response.userToken){
							//auth and get user details 
								AsyncStorage.setItem('userToken', response.userToken); 
								this.props.auth(response.userToken).then((respp) => {
									if(respp.data){
										this.setState({loading: false});
											Actions.Search();
									}
								}).catch(() => {
									console.log("error");
								});
							//auth and get user details
						}
					}).catch(() => {
						console.log("error");
					});
				}
				else if(resp.userToken){
					//auth and get user details
					AsyncStorage.setItem('userToken', resp.userToken); 
					this.props.auth(resp.userToken).then((resp) => {
						if(resp.data){
							this.setState({loading: false});
								Actions.Search();
						}
					}).catch(() => {
						console.log("error");
					});
					//auth and get user details
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
		//call to server for login
		}else{
			this.setState({getEmail:true,twitterObj:payload,loading:false});
		}
	}
    async btn_facebook_Singin(){ 
        var result = await LoginManager.logInWithReadPermissions(['public_profile']).then(
			  function(result) {
				return result;
			  },
			  function(error) {
				  console.log(JSON.stringify(error));
			  }
			); 
		if(result.isCancelled){
			//alert('Login cancelled');
		}else{
			this.setState({loading:true});
			var data = await AccessToken.getCurrentAccessToken();
			console.log(JSON.stringify(data));
			if(data.accessToken){ 
				this.socialLogin({"access_token":data.accessToken.toString(),'provider':'facebook'}); 
			}
		}
    } 
    async _twitterSignIn(){
		RNTwitterSignIn.init(Constants.TWITTER_COMSUMER_KEY, Constants.TWITTER_CONSUMER_SECRET)
		var result = await RNTwitterSignIn.logIn().then(loginData => {
			return loginData;
		}).catch(error => {
			console.log(error)
		  }
		)
		const { authToken, authTokenSecret,name,email } = result;
		if (authToken && authTokenSecret) {
			this.setState({loading: true});
			this.socialLogin({"oauth_token":authToken,"oauth_token_secret":authTokenSecret,"name":name,"email":email,"provider":"twitter"}); 
		}
	}	
	handleLogout = () => {
		console.log("logout")
		RNTwitterSignIn.logOut()
		this.setState({
		  isLoggedIn: false
		});
	}
	closeModal() {
		this.setState({getEmail:false});
	}
    btn_forgot_password() {
        Actions.ForgotPassword();
    }
    btn_signup() {
        Actions.Signup();
    }
    render = () => {
        var height = AppSizes.screen.height;
        var space = 40;
        if (height > 600) {
            space = 80;
        }
		const { isLoggedIn } = this.state;
        return ( 
            <View style={{ flex: 1, backgroundColor: 'white'}}>
				<NavComponent backArrow={true} title={Strings.props[this.state.userLang].login}/>
				<ScrollView>
				<View style={{height:200,margin:10}}> 
					<View style={{flex:0.9,backgroundColor:'transparent'}}>
						<TextInput placeholderTextColor = "#000" style={{color:'#000',justifyContent: 'flex-start',     alignItems: 'flex-start',textAlign:'left'},[AppStyles.regularFontText]} containerStyle={{backgroundColor:'transparent',borderBottomWidth:1}} 
						onChangeText={(email) => this.setState({email})}
						placeholderStyle={{justifyContent: 'flex-start',alignItems: 'flex-start',alignSelf: 'left',textAlign:'left'}}
						placeholder={Strings.props[this.state.userLang].enteryouremail}/>
					</View>
					<View style={{flex:0.9,backgroundColor:'transparent'}}>
						<TextInput ref={input => this.enterpwd = input} placeholderTextColor = "#000" style={{color:'#000'},[AppStyles.regularFontText]}  containerStyle={{backgroundColor:'transparent',borderBottomWidth:1}} 
						secureTextEntry={true}
						onChangeText={(password) => this.setState({password})}
						placeholder={Strings.props[this.state.userLang].enteryourpassword}/>
					</View>
					<Button
						title={Strings.props[this.state.userLang].login}
						backgroundColor={AppColors.brand.btnColor}
						textStyle={{color:'#FFFFFF'}}
						onPress={this.btn_normal_Signin}
						borderRadius = {50}
						fontSize={15}
						buttonStyle={{padding:14}}
						outlined
					  />
				</View>
				<View style={{marginLeft:15,justifyContent:'flex-start',alignItems:'flex-start',flexDirection:'row'}}>
					<TouchableOpacity onPress={Actions.signUp} style={{width:AppSizes.screen.width/2}}>
						<View style={{width:110,borderBottomWidth:0.5,borderColor:'#000'}}>
							<Text style={[styles.text_style_1,AppStyles.regularFontText],{fontSize:11}}>{Strings.props[this.state.userLang].createnewaccount}</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={Actions.passwordReset} style={{width:AppSizes.screen.width/2,right:10}}>
						<View style={{width:100,borderBottomWidth:0.5,borderColor:'#000'}}>
							<Text style={[styles.text_style_1,AppStyles.regularFontText],{fontSize:11}}>{Strings.props[this.state.userLang].forgotpassword}?</Text>
						</View>
					</TouchableOpacity>
				</View>
				<Spacer size={40} /> 
				{/*
				<View style={{marginLeft:15,justifyContent:'flex-start',alignItems:'flex-start'}}>
					<Text style={[styles.text_style_1,AppStyles.boldFontText]}>{Strings.props[this.state.userLang].sociallogin}</Text>
				</View>
				<SocialIcon onPress={this.btn_facebook_Singin.bind(this)} button type={'facebook'} title={Strings.props[this.state.userLang].loginwithfacebook} fontWeight={'normal'} fontFamily={'OpenSans'}/>
                <SocialIcon onPress={this._twitterSignIn.bind(this)} button type={'twitter'}  title={Strings.props[this.state.userLang].loginwithtwitter} fontWeight={'normal'} fontFamily={'OpenSans'}/>
				<SocialIcon button type={'google-plus-official'}  title={Strings.props[this.state.userLang].loginwithgoogle} fontWeight={'normal'} fontFamily={'OpenSans'} onPress={async () => {
					try {
					  await GoogleSignIn.configure({
						clientID: '162514141612-rok9o1vj2cl17iengs3btgiujdr5q7o4.apps.googleusercontent.com',
						scopes: ['openid', 'email', 'profile'],
						shouldFetchBasicProfile: true,
					  });

					  const user = await GoogleSignIn.signInPromise(); 
					  if(user.accessToken){
						  this.socialLogin({"access_token":user.accessToken.toString(),'provider':'google'});
					  }
					}
					catch(err){
						console.log(JSON.stringify(err));
					}
					}}/>

					<LinkedInModal
							  clientID="86lk6f5c9exnh7"
							  clientSecret="kOA6bhu85osg2HHQ"
							  redirectUri="http://biggson.dev3.develag.com/"
							  onSuccess={token => {
									this.props.linkedin_get(token.access_token).then((resp) => {
										console.log(JSON.stringify(resp));
									}).catch(() => {
										console.log("error");
									});
							  }}
							/>
				*/}
				</ScrollView>
				{this.state.loading?<View style={AppStyles.LoaderStyle}><Loading color = {AppColors.brand.primary}/></View>:(null)}
				<Modal
					  visible={this.state.getEmail}
					  animationType={'slide'}
					  onRequestClose={() => this.closeModal()}
				  >
					<View style={{justifyContent:'center',alignItems:'center',flex:1,flexDirection:'column',backgroundColor:'transparent'}}>
					  <View style = {styles.modal,{backgroundColor:AppColors.brand.white,width:AppSizes.screen.width-40}}>
						<FormInput placeholderTextColor = "#000" style={{color:'#000'},[AppStyles.regularFontText]} containerStyle={{backgroundColor:'transparent',borderBottomWidth:1}} 
							onChangeText={(twitteremail) => this.setState({twitteremail})}
							placeholder={Strings.props[this.state.userLang].enteryouremail}/>
						<Spacer size={10}/>
						<Button
							title={Strings.props[this.state.userLang].login}
							small
							backgroundColor={'#33BB76'}
							onPress={() => {
								var _email = this.state.twitteremail;
								if(!this.validateEmail(_email)){
									 Alert.alert(
									  AppConfig.appName,
									  Strings.props[this.state.userLang].entervalidemail,
									  [
									  {text: 'OK', onPress: () => console.log('OK Pressed')},
									  ],
									  { cancelable: false }
									);
								}else{
									var payload = this.state.twitterObj;
									payload['email'] = _email;
									this.setState({loading: true});
									this.socialLogin(payload); 
									this.closeModal();
								}
							}}
							borderRadius = {50}
							fontSize={15}
							buttonStyle={{padding:14}}
							outlined
						  />
						  <Spacer size={10}/>
						  <Button
							title={Strings.props[this.state.userLang].cancel}
							small
							backgroundColor={AppColors.brand.btnColor}
							onPress={() => {
								this.closeModal();
							}}
							borderRadius = {50}
							fontSize={15}
							buttonStyle={{padding:14}}
							outlined
						  />
					  </View>
					</View>
				</Modal>
            </View>
        );
    }
}
/* Export Component ==================================================================== */
// export default connect(mapStateToProps, mapDispatchToProps)(Login);
export default connect(mapStateToProps,mapDispatchToProps)(Authenticate); 