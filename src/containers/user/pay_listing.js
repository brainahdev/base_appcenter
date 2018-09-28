/**
 * Pay Listing Fee
 *
 * 
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,Alert,ScrollView,Linking,WebView,
  TouchableOpacity,AsyncStorage,
  ListView,Keyboard,Platform,
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
import Loading from '@components/general/Loading';
const mapStateToProps = state =>{return({ user_data: state.user.user_data,setting:state.user.settings})};  
const mapDispatchToProps = {
  get_gateways: UserActions.get_gateways,
  vehicles: UserActions.vehicles,
  wallets: UserActions.wallets,
  auth:UserActions.auth,
  bookings:UserActions.bookings,
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
	  marginRight:15,padding:3
  },
  tab_selected:{
	  marginRight:15,
	  backgroundColor:AppColors.brand.btnColor,padding:3
  }
});
/* Component ==================================================================== */
class PayListing extends Component {
  static componentName = 'PayListing';
  static propTypes = {
	get_gateways: PropTypes.func.isRequired,
	vehicles: PropTypes.func.isRequired,
	wallets: PropTypes.func.isRequired,
	auth:PropTypes.func.isRequired,
	bookings:PropTypes.func.isRequired,
  }
  constructor(props){
	  super(props); 
	  this.userdata='';
	  this.state={
		  id:'',
		  scrollSpacer:50,
		  gateways:'',
		  selected_index:0,
		  electronic_type_id:1,
		  pay_url:'',
		  paypal_selected:0,
		  wallet_selected:0,
		  listing_fee:0,
		  loading:false,
		  inc:0,userLang:'en',
		  call_from:(this.props.call_from)?this.props.call_from:'',
		  amount:(this.props.amount)?this.props.amount:'',
		  vehicle_rental_id:(this.props.vehicle_rental_id)?this.props.vehicle_rental_id:'',
		  user_data:(this.props.user_data)?this.props.user_data:'',
		  vehicle_id: (this.props.vehicle_id)?this.props.vehicle_id:'',
	  }
	  this.props.get_gateways({'page':'wallet'}).then((resp) => {
		  console.log(JSON.stringify(resp));
		  if(resp.sudopay){
			this.setState({gateways:resp,paypal_selected:1});
		  }
	  }).catch(() => {
			console.log("error");
	  });
	  this._refreshData();
	  this.setUserLanguage();
  }
  async setUserLanguage() { 
    var l = await AsyncStorage.getItem('userLang'); 
	this.setState({userLang:l});
  }
  async _refreshData () { 
    this.userdata = await AsyncStorage.getItem('userToken'); 
  }
  componentDidMount(){
	if(this.props.setting){
		  for(var i=0;i< this.props.setting.settings.original.length;i++){
			  if(this.props.setting.settings.original[i].name == 'vehicle.listing_fee'){ 
				  console.log("setting == " + JSON.stringify(this.props.setting.settings.original[i])); 
				  this.setState({listing_fee : this.props.setting.settings.original[i].value.toString()});
			  }
		  }
	  }
  }
  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }
  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
	if(this.props.reload){
		this.props.reload();
	}
  }

  _keyboardDidShow () {
	this.setState({scrollSpacer:200});
  }

  _keyboardDidHide () {
	  this.setState({scrollSpacer:50});
  }
  reload=(data)=>{
	  //Actions.pop();
	  console.log("pppppppppppppppppp" + JSON.stringify(data)); 
	  Promise.all([
		  this.props.auth(this.userdata),
		]).then(() => {
			this.setState({inc:this.state.inc++}); 
		}).catch(err => Alert.alert(err.message));
  }
  paynow=()=>{
	  console.log("call_from" + this.state.call_from); 
	  if(this.state.call_from && this.state.call_from=='order' ){
		  //order payment
		  if(this.state.paypal_selected == 0 && this.state.user_data.available_wallet_amount && parseInt(this.state.user_data.available_wallet_amount) > parseInt(this.state.amount)){
			  //{"payment_id":"","gateway_id":1,"vehicle_rental_id":"75","amount":"2130.00"}
			  //http://bookorrent.servicepg.develag.com/public/api/vehicle_rentals/75/paynow walletmessage
			  //{"message":"Your Wallet has insufficient money. Please, try again.",
			var payload = {"pay":1,"gateway_id":1,"vehicle_rental_id":this.state.vehicle_rental_id,'call_from':'orderpaylisting'};  console.log("payload" + JSON.stringify(payload));
			this.setState({loading:true});
			this.props.bookings(payload).then((resp) => {
				if(resp.data == 'wallet'){
					this.setState({loading:false});
					Actions.pop()
				}else if(resp.message){
					Alert.alert(
					  AppConfig.appName,
					  resp.message,
					  [
					  {text: 'OK', onPress: () => console.log('OK Pressed')},
					  ],
					  { cancelable: false }
					);
				}
			}).catch(() => {
				this.setState({loading:false});
				Alert.alert(
					  AppConfig.appName,
					  Strings.props[this.state.userLang].errormessage,
					  [
					  {text: 'OK', onPress: () => console.log('OK Pressed')},
					  ],
					  { cancelable: false }
					);
				console.log("error");
			});
		  }else if(this.state.paypal_selected == 1){
			  //http://bookorrent.servicepg.develag.com/public/api/vehicle_rentals/75/paynow
			  //{"payment_id":"","gateway_id":3,"vehicle_rental_id":"75","amount":"2130.00"},"id":this.state.data.id,"call_from":"order"
			  var payload = {"pay":1,"gateway_id":3,"vehicle_rental_id":this.state.vehicle_rental_id,amount:this.state.amount,'call_from':'orderpaylisting'};
			  this.setState({loading:true});
			  this.props.bookings(payload).then((resp) => {
					if(resp.url){
						this.setState({loading:false});
						Actions.Web({'pay_url':resp.url,'reload':this.reload});
					}else if(resp.message){
						Alert.alert(
						  AppConfig.appName,
						  resp.message,
						  [
						  {text: 'OK', onPress: () => console.log('OK Pressed')},
						  ],
						  { cancelable: false }
						);
					}
				}).catch(() => {
					this.setState({loading:false});
					Alert.alert(
						  AppConfig.appName,
						  Strings.props[this.state.userLang].errormessage,
						  [
						  {text: 'OK', onPress: () => console.log('OK Pressed')},
						  ],
						  { cancelable: false }
						);
					console.log("error");
				});
		  }else{
			  Alert.alert(
						  AppConfig.appName,
						  Strings.props[this.state.userLang].walletmessage,
						  [
						  {text: 'OK', onPress: () => console.log('OK Pressed')},
						  ],
						  { cancelable: false }
						);
		  }
	  }else{
		  //vehicle listing 
		  if(this.state.paypal_selected == 0 && this.state.user_data.available_wallet_amount && parseInt(this.state.user_data.available_wallet_amount) > parseInt(this.state.listing_fee)){
			payload = {"pay":1,"gateway_id":1,"vehicle_id":this.state.vehicle_id};  
			this.setState({loading:true});
			this.props.vehicles(payload).then((resp) => {
				if(resp.data == 'wallet'){
						Promise.all([
						  this.props.auth(this.userdata),
						]).then(() => {
							this.setState({loading:false});
						}).catch(err => console.log('error'));
						
							Alert.alert(
								  AppConfig.appName,
								  Strings.props[this.state.userLang].vehiclepaymentissuccessfull,
								  [
								  {text: 'OK', onPress: () => console.log('OK Pressed')},
								  ],
								  { cancelable: false }
								);
						
					Actions.pop()
				}else if(resp.message){
					Alert.alert(
					  AppConfig.appName,
					  resp.message,
					  [
					  {text: 'OK', onPress: () => console.log('OK Pressed')},
					  ],
					  { cancelable: false }
					);
				}
			}).catch(() => {
				this.setState({loading:false});
				Alert.alert(
					  AppConfig.appName,
					  Strings.props[this.state.userLang].errormessage,
					  [
					  {text: 'OK', onPress: () => console.log('OK Pressed')},
					  ],
					  { cancelable: false }
					);
				console.log("error");
			});
		  }else if(this.state.paypal_selected == 1){
			  var payload = {"pay":1,"gateway_id":3,"vehicle_id":this.state.vehicle_id};
			  this.setState({loading:true});
			  this.props.vehicles(payload).then((resp) => {
					if(resp.url){
						this.setState({loading:false});
						Actions.Web({'pay_url':resp.url,'reload':this.reload});
					}else if(resp.message){
						Alert.alert(
						  AppConfig.appName,
						  resp.message,
						  [
						  {text: 'OK', onPress: () => console.log('OK Pressed')},
						  ],
						  { cancelable: false }
						);
					}
				}).catch(() => {
					this.setState({loading:false});
					Alert.alert(
						  AppConfig.appName,
						  Strings.props[this.state.userLang].errormessage,
						  [
						  {text: 'OK', onPress: () => console.log('OK Pressed')},
						  ],
						  { cancelable: false }
						);
					console.log("error");
				});
		  }else{
			  Alert.alert(
						  AppConfig.appName,
						  Strings.props[this.state.userLang].walletmessage,
						  [
						  {text: 'OK', onPress: () => console.log('OK Pressed')},
						  ],
						  { cancelable: false }
						);
		  }
	  }
	  
  }
  terms=()=>{
	  Linking.openURL(AppConfig.terms_url).catch(err => console.error('An error occurred', err));
  }
  render = () => 
    {
		console.log("call_from" + this.state.call_from); 
		var creditcard = '';
		var electronic = '';
		var electronic_types = [];
		var paypal_selected_style = (this.state.paypal_selected) ? styles.tab_selected : styles.tab;
		var wallet_selected_style = (this.state.paypal_selected) ? styles.tab : styles.tab_selected;
		if(!this.state.pay_url){
			return(
			<View style={[AppStyles.container, styles.background],{justifyContent:'center',alignItems:'center'}}>
				<ScrollView style={{margin:10}} showsVerticalScrollIndicator={false}>
					<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
						<Text style={[AppStyles.boldedFontText],{fontSize:16}}>{Strings.props[this.state.userLang].availablebalance}</Text>
						<Text style={[AppStyles.boldedFontText],{fontSize:20,marginLeft:10}}>{this.props.user_data.available_wallet_amount}</Text> 
					</View>
					<Spacer size={20} />
					<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}> 
						{(this.props.call_from && this.props.call_from=='order') ? 
							<Text style={[AppStyles.boldedFontText],{fontSize:16,lineHeight:13}}>{Strings.props[this.state.userLang].orderamount + this.props.amount}</Text>
						: 
							<Text style={[AppStyles.boldedFontText],{fontSize:16,lineHeight:13}}>{Strings.props[this.state.userLang].listingfee + this.state.listing_fee}</Text>
						}
					</View>
					<Spacer size={20} />
					{/*payment logos or header*/}	
					<View style={{height:50,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
						{(this.state.gateways && this.state.gateways.paypal && this.state.gateways.paypal.paypal_enabled == true) ? 
							<TouchableOpacity onPress={()=>{this.setState({paypal_selected:1})}} style={paypal_selected_style}>
								<Image style={{width:44,height:28}} source={require('@images/paypal.png')} />
							</TouchableOpacity>
							: null
						} 
						<TouchableOpacity onPress={()=>{this.setState({paypal_selected:0})}} style={wallet_selected_style}>
							<Text style={{padding:3}}>{Strings.props[this.state.userLang].wallet}</Text>
						</TouchableOpacity>
					</View>
					{/*payment logos or header*/}
					<Spacer size={20} />
						<View>
							<Button
								title={Strings.props[this.state.userLang].paynow}
								backgroundColor={'#33BB76'}
								onPress={this.paynow}
								borderRadius = {50}
								fontSize={15}
								buttonStyle={{padding:14}}
								outlined
							  />
							<Spacer size={5}/>
							<TouchableOpacity onPress={this.terms}>
								<Text style={{fontSize:9,borderBottomWidth:0.5,borderColor:AppColors.brand.black}}>{Strings.props[this.state.userLang].termsofservice}</Text>
							</TouchableOpacity>
						</View>

					<Spacer size={this.state.scrollSpacer} />
				</ScrollView>
				{this.state.loading?<View style={AppStyles.LoaderStyle}><Loading color = {AppColors.brand.primary}/></View>:(null)}
			</View>
		   );
		}
	}
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps,mapDispatchToProps)(PayListing); 