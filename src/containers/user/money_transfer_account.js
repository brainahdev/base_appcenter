/**
 * Money Transfer Account Screen
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
const mapStateToProps = () => ({
});
const mapDispatchToProps = {
  money_transfer_accounts: UserActions.money_transfer_accounts,
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
class MoneyTransferAccount extends Component {
  static componentName = 'MoneyTransferAccount';
  static propTypes = {
	money_transfer_accounts: PropTypes.func.isRequired,
  }
  constructor(props) { 
	super(props); 
	this.callInvoked=0;
	this.state = { 
		dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		  }),
		page:1,
		dataList:[],
		nodata:0,
		account_detail:'',userLang:'en',
	}; 
	this.setUserLanguage();
  }
  async setUserLanguage() { 
    var l = await AsyncStorage.getItem('userLang'); 
	this.setState({userLang:l});
  }
  componentDidMount(){
	this.get_money_transfer_accounts();
  }
  get_money_transfer_accounts(){
	if(this.callInvoked == 0){
		var page = (page)?page:this.state.page;
		payload = {"page":page};
		this.callInvoked=1;
		this.props.money_transfer_accounts(payload).then((resp) => {
			var datares=this.state.dataList.concat(resp.data);
			var cpage = page + 1;
			this.callInvoked=0;
			if(this.state.page == 1 && resp.data.length ==0)
				this.setState({nodata:1,page:cpage,dataList:datares,dataSource: this.state.dataSource.cloneWithRows(datares)});
			else
				this.setState({page:cpage,dataList:datares,dataSource: this.state.dataSource.cloneWithRows(datares)});
		}).catch(() => {
			console.log("error"); 
		});
	}
  }
  delete_maintainence=(id)=>{
	   Alert.alert(
		  AppConfig.appName,
		  Strings.props[this.state.userLang].areyousurewanttodelete,
		  [
		  {text: 'OK', onPress: () => {
			  var payload={"money_transfer_id":id,"delete":1}
			  this.props.money_transfer_accounts(payload).then((resp) => {
					this.setState({page:1,dataList:[],});
					this.get_money_transfer_accounts(1);
				}).catch(() => {
					console.log("error"); 
				});
		  }},
		  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
		  ],
		  { cancelable: false }
		);
	  
  }
  addAccount=()=>{
	  var acdetail = this.state.account_detail;
	  if(acdetail.trim() == ''){
		  Alert.alert(
					  AppConfig.appName, 
					  Strings.props[this.state.userLang].enteraccountdetails,
					  [
					  {text: 'OK', onPress: () => console.log('OK Pressed')},
					  ],
					  { cancelable: false }
					);
	  }else{
		  var payload={"account":acdetail,"add":1}
		  this.props.money_transfer_accounts(payload).then((resp) => {
				this.setState({account_detail:'',page:1,dataList:[],nodata:0});
				this.get_money_transfer_accounts(1);
			}).catch(() => {
				console.log("error"); 
			});
	  }
  }
  _renderRow=(data)=>{
     return (
		<View style={{width: AppSizes.screen.width-50,marginBottom:5,backgroundColor:AppColors.brand.primary,padding:13,borderRadius:10}}>
			<View style={{flexDirection:'row'}}>
				<View style={{flex:0.4}}><Text style={styles.headerTitle}>{data.account}</Text></View>
				<TouchableOpacity style={{flex:0.05}} onPress={this.delete_maintainence.bind(this,data.id)}>
					<Image style={{width:20,height:20}} source={require('@images/close.png')}/>
				</TouchableOpacity>
			</View>
		</View>  

         );
   }
  render = () => (
    <View style={[AppStyles.container, styles.background],{justifyContent:'center',alignItems:'center'}}>
		<View style={{margin:10}}>
			<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
				<LblFormInput background={1} height={100} textAlignVertical={'top'} placeholderTxt={" " + Strings.props[this.state.userLang].enteraccountdetails} numberOfLines={5} multiline={true} lblTxt={Strings.props[this.state.userLang].accountdetails} value={this.state.account_detail} onChangeText={(account_detail) => this.setState({account_detail})}/>
			</View>
			<View style={{height:20}} />
			<Button
				title={Strings.props[this.state.userLang].submit}
				backgroundColor={'#33BB76'}
				onPress={this.addAccount}
				borderRadius = {50}
				fontSize={15}
				buttonStyle={{padding:14}}
				outlined
			  /> 
			  <Spacer size={5}/>
			  <ScrollView showsVerticalScrollIndicator={false}>
			  {(this.state.nodata == 0) ? 
				<View> 
					{(this.state.dataList && this.state.dataList.length > 0) ?
						<ListView dataSource={this.state.dataSource} renderRow={this._renderRow} onEndReached={this.onEndReached} />
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
		</ScrollView>
		</View>
    </View>
  )
} 

/* Export Component ==================================================================== */
export default connect(mapStateToProps,mapDispatchToProps)(MoneyTransferAccount);