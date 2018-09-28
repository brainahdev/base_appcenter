/**
 * Transction Screen
 *
 * Lists the Transctions
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
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

// Components
import { Spacer, Text, Button,Card,FormInput,} from '@ui/';
const striptags = require('striptags');
const mapStateToProps = () => ({
});
const mapDispatchToProps = {
  transactions: UserActions.transactions,
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
class Transaction extends Component {
  static componentName = 'Transaction';
  static propTypes = {
	transactions: PropTypes.func.isRequired,
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
			cfilter:'all',userLang:'en',
		}; 
		 this.setUserLanguage();
  }
  async setUserLanguage() { 
    var l = await AsyncStorage.getItem('userLang'); 
	this.setState({userLang:l});
  }
  componentDidMount(){
	this.get_transactions('all',1);
  }
  get_transactions(q,p){
	if(this.callInvoked == 0){
		var cf = q;
		var page = (p)?p:this.state.page;
		payload = {"page":page,"filter":cf}; 
		this.callInvoked=1;
		this.props.transactions(payload).then((resp) => {
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
  onEndReached=()=>{
	this.get_transactions(this.state.cfilter,0);
  }
  _renderRow=(data)=>{
	  console.log("data===" + JSON.stringify(data));
     return (
		<View style={{width: AppSizes.screen.width-10,flexDirection:'row',margin:5,borderBottomWidth:0.5,borderColor:AppColors.brand.secondary,paddingBottom:5}}>
			<View style={{flex:0.6}}>
				<Text >{striptags(data.description)}</Text>
				<Text style={{fontSize:8,paddingTop:5},[AppStyles.lightFontText]}>{data.created_at}</Text>
			</View>
			<View style={{flex:0.2,alignItems:'center'}}> 
				<Text >{data.credit_amount}</Text>
			</View>
			<View style={{flex:0.2,alignItems:'center'}}>
				<Text >{data.debit_amount}</Text> 
			</View>
		</View>  

         );
   }
  filter=(id)=>{
	  var cf = '';
		if(id=='all'){
			cf = 'all';
		}
		else if(id=='today'){
			cf = 'today';
		}
		else if(id=='thisweek'){
			cf = 'this_week';
		}
		else if(id=='thismonth'){ 
			cf = 'this_month';
		}
	  this.setState({cfilter:id,page:1,dataList:[],nodata:0},this.get_transactions(cf,1)); 
  }
  render = () => 
    {
		var fall = (this.state.cfilter == 'all')?styles.selected_tab:styles.tab;
		var ftoday = (this.state.cfilter == 'today')?styles.selected_tab:styles.tab;
		var fthisweek = (this.state.cfilter == 'thisweek')?styles.selected_tab:styles.tab;
		var fthismonth = (this.state.cfilter == 'thismonth')?styles.selected_tab:styles.tab;
		
		var fallt = (this.state.cfilter == 'all')? [styles.headerGrey,styles.whiteText,AppStyles.regularFontText] : [styles.headerGrey,AppStyles.regularFontText];
		var ftodayt = (this.state.cfilter == 'today')? [styles.headerGrey,styles.whiteText,AppStyles.regularFontText] :[styles.headerGrey,AppStyles.regularFontText];
		var fthisweekt = (this.state.cfilter == 'thisweek')? [styles.headerGrey,styles.whiteText,AppStyles.regularFontText] :[styles.headerGrey,AppStyles.regularFontText];
		var fthismontht = (this.state.cfilter == 'thismonth')? [styles.headerGrey,styles.whiteText,AppStyles.regularFontText] :[styles.headerGrey,AppStyles.regularFontText];
		var disabled = false;
		if(this.callInvoked)
			disabled = true;
    return(
    <View style={[AppStyles.container, styles.background]}>
		<View style={{backgroundColor:'#303030',height:50,flexDirection:'row',justifyContent:'center',alignItems:'center',width:AppSizes.screen.width}}> 
			<TouchableOpacity disabled={disabled} onPress={this.filter.bind(this,'all')} style={fall}>
				<Text style={fallt}>{Strings.props[this.state.userLang].all}</Text>
			</TouchableOpacity>
			<TouchableOpacity disabled={disabled} onPress={this.filter.bind(this,'today')} style={ftoday}>
				<Text style={ftodayt}>{Strings.props[this.state.userLang].today}</Text>
			</TouchableOpacity>
			<TouchableOpacity disabled={disabled} onPress={this.filter.bind(this,'thisweek')} style={fthisweek}>
				<Text style={fthisweekt}>{Strings.props[this.state.userLang].thisweek}</Text>
			</TouchableOpacity>
			<TouchableOpacity disabled={disabled} onPress={this.filter.bind(this,'thismonth')} style={fthismonth}>
				<Text style={fthismontht}>{Strings.props[this.state.userLang].thismonth}</Text>
			</TouchableOpacity>
		</View>
		<View style={{backgroundColor:'#303030',flexDirection:'row',padding:5,paddingBottom:10,height:40,borderTopWidth:0.5,borderColor:AppColors.brand.primary}}>
			<View style={{flex:0.6}}>
				<Text style={{fontSize:16,lineHeight:25,color:AppColors.brand.primary}}>{Strings.props[this.state.userLang].description}</Text>
			</View>
			<View style={{flex:0.2,marginTop:2,justifyContent:'center',alignItems:'center'}}>
				<Text style={{fontSize:16,color:AppColors.brand.primary}}>{Strings.props[this.state.userLang].credit}</Text>
			</View> 
			<View style={{flex:0.2,marginTop:2,justifyContent:'center',alignItems:'center'}}>
				<Text style={{fontSize:16,color:AppColors.brand.primary}}>{Strings.props[this.state.userLang].debit}</Text>
			</View>
		</View>
		{(this.state.nodata == 0) ? 
			<View style={{padding:0,margin:0}}>
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
    </View>
  );
  }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps,mapDispatchToProps)(Transaction);
