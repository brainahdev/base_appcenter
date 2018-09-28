/**
 * Wallet
 *
 * 
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,Alert,ScrollView,Linking,WebView,AsyncStorage,
  TouchableOpacity,
  ListView,Keyboard,Platform,
} from 'react-native';
import Loading from '@components/general/Loading';
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
  get_gateways: UserActions.get_gateways,
  countries: UserActions.countries,
  wallets: UserActions.wallets,
  auth:UserActions.auth,
};
import ModalPicker from 'react-native-modal-picker';
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
class Wallet extends Component {
  static componentName = 'Wallet';
  static propTypes = {
	get_gateways: PropTypes.func.isRequired,
	countries: PropTypes.func.isRequired,
	wallets: PropTypes.func.isRequired,
	auth:PropTypes.func.isRequired,
  }
  constructor(props){
	  super(props); 
	  this.userdata = '';
	  this.state={
		  id:'',
		  name:'',
		  address:'',
		  city:'',
		  state:'',
		  country:'',
		  country_id:0,userLang:'en',
		  country_lbl:Strings.choosecountry,
		  zipcode:'',
		  fax:'',
		  phone:'',
		  mobile:'',
		  email:'',
		  scrollSpacer:50,
		  lat:'',
		  lon:'',
		  gateways:'',
		  countries:'',
		  selected_index:0,
		  electronic_type_id:1,
		  cardcode:'',
		  cardnumber:'',
		  nameoncard:'',
		  mm:'',
		  yyyy:'',
		  pay_url:'',
		  loading:false,
		  inc:0,
	  }
	  this._refreshData();
	  this.setUserLanguage();
  }
  async setUserLanguage() { 
    var l = await AsyncStorage.getItem('userLang'); 
	this.setState({userLang:l,country_lbl:Strings.props[this.state.userLang].choosecountry,});
  }
  async _refreshData () { 
    this.userdata = await AsyncStorage.getItem('userToken'); 
  } 
  componentDidMount(){
	  this.getWallet();
	 /* this.props.countries().then((resp) => {
		  console.log(JSON.stringify(resp)); 
		  if(resp.data){
			 var cc = [{ key: 0, section: true, label: Strings.props[this.state.userLang].choosecountry}];;
			 for(var j=0;j<resp.data.length;j++){
				var ojt = { key: resp.data[j].iso2, label: resp.data[j].name }
				cc.push(ojt);
			 }
			 this.setState({countries:cc});
		  }
	  }).catch(() => {
			console.log("error");
	  });*/
  }
  getWallet(){
	  this.props.get_gateways({'page':'wallet'}).then((resp) => {
		  console.log(JSON.stringify(resp));
		  if(resp.sudopay){
			this.setState({gateways:resp});
		  }
	  }).catch(() => {
			console.log("error");
	  });
  }
  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }
  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow () {
	this.setState({scrollSpacer:200});
  }

  _keyboardDidHide () {
	  this.setState({scrollSpacer:50});
  }
  validateEmail = (email) => {
        var re = /^.+@.+\..+$/i;
        return re.test(email);
    };
  validateMobile=(mobile) => {
	  var re = /^\d{10}$/;
      return re.test(mobile);
  }
  validateCardCode=(code)=>{
	  var re = /^[0-9]{3,4}$/
	  return re.test(code);
  }
  validateCreditCardNumber=(ccNum)=>{
	  var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
	  var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
	  var amexpRegEx = /^(?:3[47][0-9]{13})$/;
	  var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
	  var isValid = false;
	  if (visaRegEx.test(ccNum)) {
		isValid = true;
	  } else if(mastercardRegEx.test(ccNum)) {
		isValid = true;
	  } else if(amexpRegEx.test(ccNum)) {
		isValid = true;
	  } else if(discovRegEx.test(ccNum)) {
		isValid = true;
	  }

	  return isValid;
  }
 
 // static propTypes = {
	//vehicle_companies: PropTypes.func.isRequired,
  //} 
  validateAmount = (amount) => {
        var re = /^-?\d*(\.\d+)?$/;
        return re.test(amount);
    };

  addToWallet=()=>{
	  var d = new Date();
	  var n = d.getFullYear();
	  if((this.state.amount <10 || this.state.amount >1000) || !this.validateAmount(this.state.amount)){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].entervalidamount,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if((this.state.selected_index == 1 || this.state.selected_index == 2) && !this.validateEmail(this.state.email)){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].entervalidemail,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if((this.state.selected_index == 1 || this.state.selected_index == 2) && this.state.address == ''){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].enteraddress,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if((this.state.selected_index == 1 || this.state.selected_index == 2) && this.state.city == ''){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].entercity,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if((this.state.selected_index == 1 || this.state.selected_index == 2) && this.state.state == ''){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].enterstate,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if((this.state.selected_index == 1 || this.state.selected_index == 2) && this.state.country_id == 0){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].choosecountry,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if((this.state.selected_index == 1 || this.state.selected_index == 2) && this.state.zipcode == ''){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].enterzipcode,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if((this.state.selected_index == 1 || this.state.selected_index == 2) && !this.validateMobile(this.state.phone)){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].entervalidphonenumber,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if(this.state.selected_index == 1 && !this.validateCreditCardNumber(this.state.cardnumber)){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].entervalidcardnumber,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if(this.state.selected_index == 1 && parseInt(this.state.mm) < 1 && parseInt(this.state.mm) > 12){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].entervalidmonth,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if(this.state.selected_index == 1 && parseInt(this.state.mm) < n ){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].entervalidyear,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if(this.state.selected_index == 1 && this.state.nameoncard.trim() == ''){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].enternameoncard,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if(this.state.selected_index == 1 && !this.validateCardCode(this.state.cardcode)){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].entervalidcardcode,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }else{
		  /*
			{"country":"US","email":"ahdeveloper1980@gmail.com","address":"san jose","city":"milwakee","state":"jones","zip_code":"600032","phone":"9898989898","credit_card_number":"4111111111111111","credit_card_expire_month":"05","credit_card_expire_year":2019,"credit_card_name_on_card":"kannan","credit_card_code":"123","payment_id":"3140","gateway_id":2,"credit_card_expire":"05/2019","amount":15}
			
			http://bookorrent.servicepg.develag.com/public/api/wallets
			
			{"email":"ahdeveloper1980@gmail.com","address":"redliane","city":"chennai","state":"TN","country":"IN","zip_code":"600032","phone":"9898989898","payment_id":"1","gateway_id":2,"amount":15}
			http://bookorrent.servicepg.develag.com/public/api/wallets
			
			http://bookorrent.servicepg.develag.com/public/api/wallets
			{"payment_id":"3140","gateway_id":3,"amount":10}
		  */
		  this.setState({loading:true});
		  this.props.wallets({'page':'wallet','type':'post','gateway_id':3,'amount':this.state.amount}).then((resp) => {
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
				console.log("error");
		  });
	  }
  }
  reload=(data)=>{
	  console.log("reload = " + data); 
	  if(data == 'wallets/success'){
		  Promise.all([
			  this.props.auth(this.userdata),
			]).then(() => {
				this.getWallet();
				this.setState({inc:this.state.inc++}); 
			}).catch(err => Alert.alert(err.message));
		  
	  }
  }
  terms=()=>{
	  Linking.openURL(AppConfig.terms_url).catch(err => console.error('An error occurred', err));
  }
  render = () => 
    {
		var creditcard = '';
		var electronic = '';
		var electronic_types = [];
		if(this.state.gateways && this.state.gateways.sudopay && this.state.gateways.sudopay.gateway_groups){
			var groups = this.state.gateways.sudopay.gateway_groups;			
			for(var i=0;i< groups.length;i++){
				if(groups[i].name == "Credit &amp; Debit Cards"){
					creditcard = groups[i];
				}
				if(groups[i].name == "Electronic Gateways"){
					electronic = groups[i];
					for (var k = 0; k < electronic.gateways.length; k++)
					{
						var dta = electronic.gateways[k];
						var checked = false;
						if(this.state.electronic_type_id && this.state.electronic_type_id == dta.id) {
							 checked = true;
						 }
						electronic_types.push(<CheckBox
														key={k}
														  checked={checked}
														  title={dta.name}
														  onPress={()=>{this.setState({electronic_type_id:dta.id})}}
														  containerStyle={{backgroundColor:'transparent'}}
														  checkedIcon='dot-circle-o'
														  uncheckedIcon='circle-o'
														  containerStyle={{paddingLeft:0,paddingRight:0,backgroundColor:'transparent',marginLeft:0,marginRight:0}}
														  textStyle={[styles.normalText11,AppStyles.regularFontText]} 
														/> 
													)
					 }
				}
			}
		}
		if(!this.state.pay_url){
			return(
			<View style={[AppStyles.container, styles.background],{justifyContent:'center',alignItems:'center'}}>
				<View style={{margin:10}} >
					<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
						<Text style={[AppStyles.boldedFontText],{fontSize:16}}>{Strings.props[this.state.userLang].availablebalance}</Text>
						<Text style={[AppStyles.boldedFontText],{fontSize:20,marginLeft:10}}>{this.props.user_data.available_wallet_amount}</Text> 
					</View>
					<Spacer size={20} />
					<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
						<LblFormInput placeholderTxt={Strings.props[this.state.userLang].addtowallet} lblTxt={Strings.props[this.state.userLang].addtowallet}
						value={this.state.amount} onChangeText={(text) => this.setState({amount:text})}/>
					</View> 
					<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
						<Text style={styles.normalText11}>{Strings.props[this.state.userLang].minwalletamount}</Text>
					</View> 
					<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
						<Text style={styles.normalText11}>{Strings.props[this.state.userLang].maxwalletamount}</Text>
					</View> 
					<Spacer size={20} />
					{/*payment logos or header*/}	
					<View style={{height:50,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
						{(this.state.gateways && this.state.gateways.paypal && this.state.gateways.paypal.paypal_enabled == true) ? 
							<TouchableOpacity onPress={()=>{this.setState({selected_index:0})}} style={{marginRight:15}}>
								<Image style={{width:44,height:28}} source={require('@images/paypal.png')} />
							</TouchableOpacity>
							: null
						} 
						{/*{(creditcard) ? 
							<TouchableOpacity onPress={()=>{this.setState({selected_index:1})}} style={{marginRight:15}}> 
								<Image style={{width:75,height:20}} source={require('@images/creditcard.png')} />
							</TouchableOpacity>
							: null
						}
						{(electronic) ? 
							<TouchableOpacity onPress={()=>{this.setState({selected_index:2})}} style={{marginRight:15}}>
								<Image style={{width:75,height:28}} source={require('@images/electronic.png')} />
							</TouchableOpacity>
							: null
						} */} 
					</View>
					{/*payment logos or header*/}
					<Spacer size={10} />
					{/*payment forms*/}
					{(this.state.selected_index == 1) ?
						<View>
							<View><Text style={[styles.headerGrey,AppStyles.boldedFontText],{color:AppColors.brand.black}}>{Strings.props[this.state.userLang].payerdetails}</Text></View>
							<Spacer size={10} />
							<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
								<LblFormInput placeholderTxt={Strings.props[this.state.userLang].email} lblTxt={Strings.props[this.state.userLang].email}
								value={this.state.email} onChangeText={(text) => this.setState({email:text})}/>
							</View>
							<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
								<LblFormInput placeholderTxt={Strings.props[this.state.userLang].address} lblTxt={Strings.props[this.state.userLang].address}
								value={this.state.address} onChangeText={(text) => this.setState({address:text})}/>
							</View>
							<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
								<LblFormInput placeholderTxt={Strings.props[this.state.userLang].city} lblTxt={Strings.props[this.state.userLang].city}
								value={this.state.city} onChangeText={(text) => this.setState({city:text})}/>
							</View>
							<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
								<LblFormInput placeholderTxt={Strings.props[this.state.userLang].state} lblTxt={Strings.props[this.state.userLang].state}
								value={this.state.state} onChangeText={(text) => this.setState({state:text})}/>
							</View>
							<ModalPicker
								  data={this.state.countries}
								  initValue={Strings.props[this.state.userLang].choosecountry}
								  option_selected_key={this.state.country_id}
								  selectStyle={{color:AppColors.brand.btnColor}}
								  sectionTextStyle ={[AppStyles.boldedFontText]}
								  optionTextStyle ={[AppStyles.regularFontText]} 
								  cancelStyle = {{justifyContent: 'center',alignItems:'center', borderRadius:50/2,}}
								  cancelTextStyle={[AppStyles.regularFontText]}
								  overlayStyle = {{backgroundColor: 'rgba(0,0,0,0.9)'}} 
								  onChange={(option)=>{
												var vid = `${option.key}`;
												this.setState({country_id:`${option.key}`,country_lbl:`${option.label}`});
											}}> 
									<LblFormInput select_opt={1} value={this.state.country_lbl} placeholderTxt={Strings.props[this.state.userLang].choosecountry} lblTxt={Strings.props[this.state.userLang].choosecountry} editable={false}/>
							</ModalPicker>
							<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
								<LblFormInput placeholderTxt={Strings.props[this.state.userLang].zipcode} lblTxt={Strings.props[this.state.userLang].zipcode}
								value={this.state.zipcode} onChangeText={(text) => this.setState({zipcode:text})}/>
							</View>
							<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
								<LblFormInput placeholderTxt={Strings.props[this.state.userLang].phone} lblTxt={Strings.props[this.state.userLang].phone}
								value={this.state.phone} onChangeText={(text) => this.setState({phone:text})}/>
							</View>
							<Spacer size={10} />
							<View><Text style={[styles.headerGrey,AppStyles.boldedFontText],{color:AppColors.brand.black}}>{Strings.props[this.state.userLang].creditcarddetails}</Text></View>
							<Spacer size={10} />
							<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
								<LblFormInput placeholderTxt={Strings.props[this.state.userLang].cardnumber} lblTxt={Strings.props[this.state.userLang].cardnumber}
								value={this.state.cardnumber} onChangeText={(text) => this.setState({cardnumber:text})}/>
							</View>
							<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
								<LblFormInput placeholderTxt={Strings.props[this.state.userLang].month} lblTxt={Strings.props[this.state.userLang].month}
								value={this.state.mm} onChangeText={(text) => this.setState({mm:text})}/>
							</View>
							<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
								<LblFormInput placeholderTxt={Strings.props[this.state.userLang].year} lblTxt={Strings.props[this.state.userLang].year}
								value={this.state.yyyy} onChangeText={(text) => this.setState({yyyy:text})}/>
							</View>
							<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
								<LblFormInput placeholderTxt={Strings.props[this.state.userLang].nameoncard} lblTxt={Strings.props[this.state.userLang].nameoncard}
								value={this.state.nameoncard} onChangeText={(text) => this.setState({nameoncard:text})}/>
							</View>
							<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
								<LblFormInput placeholderTxt={Strings.props[this.state.userLang].country} lblTxt={Strings.props[this.state.userLang].country}
								value={this.state.country} onChangeText={(text) => this.setState({country:text})}/>
							</View>
							<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
								<LblFormInput placeholderTxt={Strings.props[this.state.userLang].cardcode} lblTxt={Strings.props[this.state.userLang].cardcode}
								value={this.state.cardcode} onChangeText={(text) => this.setState({cardcode:text})}/>
							</View>
						</View>
					: null}
					{(this.state.selected_index == 2) ?
						<View>
							<View><Text style={[styles.headerGrey,AppStyles.boldedFontText],{color:AppColors.brand.black}}>{Strings.props[this.state.userLang].payerdetails}</Text></View>
							<Spacer size={10} />
							<View style={{paddingLeft:0,paddingRight:0,backgroundColor:'transparent'}}>
								{electronic_types}
							</View>
							<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
								<LblFormInput placeholderTxt={Strings.props[this.state.userLang].email} lblTxt={Strings.props[this.state.userLang].email}
								value={this.state.email} onChangeText={(text) => this.setState({email:text})}/>
							</View>
							<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
								<LblFormInput placeholderTxt={Strings.props[this.state.userLang].address} lblTxt={Strings.props[this.state.userLang].address}
								value={this.state.address} onChangeText={(text) => this.setState({address:text})}/>
							</View>
							<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
								<LblFormInput placeholderTxt={Strings.props[this.state.userLang].city} lblTxt={Strings.props[this.state.userLang].city}
								value={this.state.city} onChangeText={(text) => this.setState({city:text})}/>
							</View>
							<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
								<LblFormInput placeholderTxt={Strings.props[this.state.userLang].state} lblTxt={Strings.props[this.state.userLang].state}
								value={this.state.state} onChangeText={(text) => this.setState({state:text})}/>
							</View>
							<ModalPicker
								  data={this.state.countries}
								  initValue={Strings.props[this.state.userLang].choosecountry}
								  option_selected_key={this.state.country_id}
								  selectStyle={{color:AppColors.brand.btnColor}}
								  sectionTextStyle ={[AppStyles.boldedFontText]}
								  optionTextStyle ={[AppStyles.regularFontText]} 
								  cancelStyle = {{justifyContent: 'center',alignItems:'center', borderRadius:50/2,}}
								  cancelTextStyle={[AppStyles.regularFontText]}
								  overlayStyle = {{backgroundColor: 'rgba(0,0,0,0.9)'}} 
								  onChange={(option)=>{
												var vid = `${option.key}`;
												this.setState({country_id:`${option.key}`,country_lbl:`${option.label}`});
											}}> 
									<LblFormInput select_opt={1} value={this.state.country_lbl} placeholderTxt={Strings.props[this.state.userLang].choosecountry} lblTxt={Strings.props[this.state.userLang].choosecountry} editable={false}/>
							</ModalPicker>
							<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
								<LblFormInput placeholderTxt={Strings.props[this.state.userLang].zipcode} lblTxt={Strings.props[this.state.userLang].zipcode}
								value={this.state.zipcode} onChangeText={(text) => this.setState({zipcode:text})}/>
							</View>
							<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
								<LblFormInput placeholderTxt={Strings.props[this.state.userLang].phone} lblTxt={Strings.props[this.state.userLang].phone}
								value={this.state.phone} onChangeText={(text) => this.setState({phone:text})}/>
							</View>
							<Spacer size={10} />
						</View>
					: null}
					<Spacer size={20} />
					{(this.state.gateways && ((this.state.gateways.paypal && this.state.gateways.paypal.paypal_enabled == true) || creditcard || electronic)) ?
						<View>
							<Button
								title={Strings.props[this.state.userLang].paynow}
								backgroundColor={'#33BB76'}
								onPress={this.addToWallet}
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
						: null
					}
					{this.state.loading?<View style={AppStyles.LoaderStyle}><Loading color = {AppColors.brand.primary}/></View>:(null)}
					<Spacer size={this.state.scrollSpacer} />
				</View>
			</View>
		   );
		}
		else{
			return(
				<WebView style={{height:AppSizes.screen.height}}
					source={{uri: this.state.pay_url}}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					startInLoadingState={true}
					>
				  </WebView>
			);
		}
	}
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps,mapDispatchToProps)(Wallet); 