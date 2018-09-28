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
  StyleSheet,Alert,ScrollView,Linking,AsyncStorage,
  TouchableOpacity,
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
const mapStateToProps = state =>{return({ user_data: state.user.user_data})};
const mapDispatchToProps = {
  money_transfer_accounts: UserActions.money_transfer_accounts,
  user_cash_withdrawals: UserActions.user_cash_withdrawals,
  auth:UserActions.auth,
};
import moment from 'moment';

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
	money_transfer_accounts: PropTypes.func.isRequired,
	user_cash_withdrawals: PropTypes.func.isRequired,
	auth:PropTypes.func.isRequired,
  }
  constructor(props){
	  super(props);
	  this.userdata = '';
	  this.callInvoked=0;
	  this.state={
		  amount:'',
		  scrollSpacer:50,userLang:'en',
		  dataSourceL: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		  }),
		  payoption:0,
		  page:1,
		  dataList:[],
		  dataLists:[],
		  pages:1,
		  nodatal:0,
	  }
	  this._refreshData();
	  this.get_lists(0);
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
		payload = {"page":1};
		this.props.money_transfer_accounts(payload).then((resp) => {
			var datares=this.state.dataList.concat(resp.data); 
			this.setState({dataList:datares});
		}).catch(() => {
			console.log("error"); 
		});
		
  }
  get_lists(p){
	if(this.callInvoked == 0){
		var page = (p)?p:this.state.pages;
		payload = {"page":page}; 
		this.callInvoked=1;
		this.props.user_cash_withdrawals(payload).then((resp) => {
			var datares=this.state.dataLists.concat(resp.data);
			var cpage = page + 1;
			this.callInvoked=0;
			if(this.state.pages == 1 && resp.data.length == 0){
				console.log("================== ");
				this.setState({nodatal:1,pages:cpage,dataLists:datares,dataSourceL: this.state.dataSourceL.cloneWithRows(datares)});
			}
			else{
				this.setState({pages:cpage,dataLists:datares,dataSourceL: this.state.dataSourceL.cloneWithRows(datares)});
			}
		}).catch(() => {
			console.log("error");
		});
	}
  }
  onEndReached=()=>{

  }
  onEndReachedL=()=>{
	this.get_lists(0);
  }
  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }
  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  payOption=(data)=>{
	  console.log(data.id);
	  this.setState({payoption:data.id});
  }

   _renderRowL=(data)=>{
	  console.log("data===" + JSON.stringify(data));
     return (
		<View style={{width: AppSizes.screen.width-20,flexDirection:'row',margin:5,borderBottomWidth:0.5,borderColor:AppColors.brand.secondary,paddingBottom:5}}>
			<View style={{flex:0.2}}>
				<Text style={{fontSize:8,paddingTop:5},[AppStyles.lightFontText]}>{moment(data.created_at).format("YYYY-MM-DD h:mm:ss")}</Text>
			</View>
			<View style={{flex:0.2,alignItems:'center'}}> 
				<Text style={{fontSize:8,paddingTop:5},[AppStyles.lightFontText]}>{data.money_transfer_account.account}</Text>
			</View>
			<View style={{flex:0.2,alignItems:'center'}}>
				<Text style={{fontSize:8,paddingTop:5},[AppStyles.lightFontText]}>{data.amount}</Text> 
			</View>
			<View style={{flex:0.2,alignItems:'center'}}>
				<Text style={{fontSize:8,paddingTop:5},[AppStyles.lightFontText]}>{data.withdrawal_status.name}</Text>  
			</View>
		</View>  

         );
   }
  _keyboardDidShow () {
	this.setState({scrollSpacer:200});
  }

  _keyboardDidHide () {
	  this.setState({scrollSpacer:50});
  }
  
  static propTypes = {

  }
  validateAmount = (amount) => {
        var re = /^-?\d*(\.\d+)?$/;
        return re.test(amount);
    };

  withDraw=()=>{
		
	  if((this.state.amount <2 || this.state.amount >1000) || !this.validateAmount(this.state.amount)){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].entervalidamount,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			); 
	  }
	  else if(this.state.amount > this.props.user_data.available_wallet_amount){
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].checkavailablebalanceandentervalidamount,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			); 
	  }
	  else{
		  var payload = {"money_transfer_account_id":this.state.payoption,"amount":this.state.amount,'type':'post'}
		  this.props.user_cash_withdrawals(payload).then((resp) => {
				Promise.all([
				  this.props.auth(this.userdata),
				]).then(() => {
					this.setState({amount:'',pages:1,dataLists:[]},this.get_lists(1));
				}).catch(err => Alert.alert(err.message));
			
			}).catch(() => {
				console.log("error");
			});
		  /*
			{"country":"US","email":"ahdeveloper1980@gmail.com","address":"san jose","city":"milwakee","state":"jones","zip_code":"600032","phone":"9898989898","credit_card_number":"4111111111111111","credit_card_expire_month":"05","credit_card_expire_year":2019,"credit_card_name_on_card":"kannan","credit_card_code":"123","payment_id":"3140","gateway_id":2,"credit_card_expire":"05/2019","amount":15}
			
			http://bookorrent.servicepg.develag.com/public/api/wallets
			
			
			
		  */
	  }
  }

  render = () => 
    {
		console.log("nodatal "+ this.state.nodatal)
		for(var k=0;k < this.state.dataList.length; k++){
			
		}
		var opt= [];
		if(this.state.dataList){
			for (var k = 0; k < this.state.dataList.length; k++)
			{
				var data = this.state.dataList[k];
				var checked = 0;
				if(this.state.payoption == data.id) {
					 checked = 1;
				 }
				opt.push(<CheckBox
							  left
							  checked={checked}
							  title={data.account}
							  checkedIcon='dot-circle-o'
							  uncheckedIcon='circle-o'
							  onPress={this.payOption.bind(this,data)}
							  containerStyle={{marginLeft:0,borderRadius:0,backgroundColor:'transparent',marginBottom:5,padding:0,width:100}}
							/> )
			 }
		}
	return(
    <View style={[AppStyles.container, styles.background],{justifyContent:'center',alignItems:'center'}}>
		<ScrollView style={{margin:10}} showsVerticalScrollIndicator={false}>
			<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
				<Text style={[AppStyles.boldedFontText],{fontSize:16}}>{Strings.props[this.state.userLang].availablebalance}</Text>
				<Text style={[AppStyles.boldedFontText],{fontSize:20,marginLeft:10}}>{this.props.user_data.available_wallet_amount}</Text> 
			</View>
			<Spacer size={20} />
			<View style={{width:AppSizes.screen.width-30,margin:10}}> 
			{(this.state.dataList && this.state.dataList.length > 0) ?
				<View >  
					<View><Text style={[styles.headerGrey,AppStyles.boldedFontText],{color:AppColors.brand.black}}>{Strings.props[this.state.userLang].choosemoneytransferoption}</Text></View>
					<Spacer size={10} />
					<View style={{paddingLeft:0,paddingRight:0,backgroundColor:'transparent'}}>
						{opt}
					</View>
					<Spacer size={15} />
					<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
						<LblFormInput placeholderTxt={Strings.props[this.state.userLang].amount} lblTxt={Strings.props[this.state.userLang].amount}
						value={this.state.amount} onChangeText={(text) => this.setState({amount:text})}/>
					</View>
					<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
						<Text style={styles.normalText11}>{Strings.props[this.state.userLang].minwwithdrawamount}</Text>
					</View> 
					<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
						<Text style={styles.normalText11}>{Strings.props[this.state.userLang].maxwithdrawamount}</Text>
					</View> 
					<Spacer size={15} />
					<Button
						title={Strings.props[this.state.userLang].submit}
						backgroundColor={'#33BB76'}
						onPress={this.withDraw}
						borderRadius = {50}
						fontSize={15}
						buttonStyle={{padding:14}}
						outlined
					  />
				</View>
			:null}
			</View>
			<Spacer size={15}/>
			<View><Text style={[styles.headerGrey,AppStyles.boldedFontText],{color:AppColors.brand.black}}>{Strings.props[this.state.userLang].cashwithdrawrequests}</Text></View>
			<Spacer size={10}/>
			 <View style={{width: AppSizes.screen.width-20,flexDirection:'row',margin:5,borderBottomWidth:0.5,borderColor:AppColors.brand.secondary,padding:5,backgroundColor:AppColors.brand.black}}>
				<View style={{flex:0.2}}>
					<Text style={styles.whiteText}>{Strings.props[this.state.userLang].date}</Text>
				</View>
				<View style={{flex:0.2,alignItems:'center'}}> 
					<Text style={styles.whiteText}>{Strings.props[this.state.userLang].account}</Text>
				</View>
				<View style={{flex:0.2,alignItems:'center'}}>
					<Text style={styles.whiteText}>{Strings.props[this.state.userLang].amount}</Text> 
				</View>
				<View style={{flex:0.2,alignItems:'center'}}>
					<Text style={styles.whiteText}>{Strings.props[this.state.userLang].status}</Text> 
				</View>
			</View> 
			{(this.state.nodatal == 0) ? 
				<View style={{width: AppSizes.screen.width-20,padding:0,margin:0,height:AppSizes.screen.height-200}}>
					{(this.state.dataLists && this.state.dataLists.length > 0) ?
						<ListView dataSource={this.state.dataSourceL} renderRow={this._renderRowL} onEndReached={this.onEndReachedL}/>
					:
						<View style={{justifyContent:'center',alignItems:'center'}}>
							<Text style={[AppStyles.regularFontText]}>{Strings.props[this.state.userLang].loading}</Text>
						</View> 
					}
				</View>
			:
				<View style={{justifyContent:'center',alignItems:'center'}}>
					<Text style={[AppStyles.regularFontText]}>{Strings.props[this.state.userLang].nodata}</Text>
				</View>
			}
			<Spacer size={this.state.scrollSpacer} />
		</ScrollView>
    </View>
   );}
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps,mapDispatchToProps)(Wallet); 