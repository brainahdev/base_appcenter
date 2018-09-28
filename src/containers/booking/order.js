/**
 * Orders Screen
 *
 * Lists the orders
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
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
  item_orders: UserActions.item_orders,
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
class Order extends Component {
  static componentName = 'Order';
  static propTypes = {
	item_orders: PropTypes.func.isRequired,
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
			cfilter:'all',
			userLang:'en',
		}; 
		this.setUserLanguage(); 
  }
  async setUserLanguage() { 
    var l = await AsyncStorage.getItem('userLang'); 
	this.setState({userLang:l});
  } 
  componentDidMount(){
	this.get_orders('all',1);
  }
  get_orders(q,p){
	if(this.callInvoked == 0){
		var cf = q;
		var page = (p)?p:this.state.page;
		payload = {"page":page,"filter":cf}; 
		this.callInvoked=1;
		this.props.item_orders(payload).then((resp) => {
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
	this.get_orders(this.state.cfilter,0);
  }
  _renderRow=(data)=>{
	  console.log("data===" + JSON.stringify(data)); 
     return (
		<TouchableOpacity style={{width: AppSizes.screen.width-10,margin:5,backgroundColor:AppColors.brand.primary,padding:10,borderRadius:15}} onPress={()=>{Actions.OrderActivity({'data':JSON.stringify(data)})}}>
			<View style={{flexDirection:'row',justifyContent:'space-between'}}>
				<View><Text >Booking ID: #{data.id}</Text></View>
				<View><Text >No of Days: {data.date_diff.total_days}</Text></View>
			</View>
			<Spacer size={5}/>
			<View style={{flexDirection:'row',justifyContent:'space-between'}}>
				<View><Text style={{fontSize:16}}>{data.item_userable.name}</Text></View>
				<View><Text >Booker: {data.user.username}</Text></View> 
			</View>
			<Spacer size={5}/>
			<View style={{flexDirection:'row',justifyContent:'space-between'}}>
				<View><Text style={{fontSize:10}}>From: {data.item_booking_start_date}</Text></View>
				<View><Text style={{fontSize:10}}>To: {data.item_booking_end_date}</Text></View>
			</View>
			<Spacer size={5}/>
			<View style={{flexDirection:'row',justifyContent:'space-between'}}>
				<View><Text style={{fontSize:10}}>Booked On: {data.created_at}</Text></View>
				<View><Text style={{fontSize:10}}>Gross: ${data.total_amount}</Text></View>
			</View> 
		</TouchableOpacity> 

         );
   }
  filter=(id)=>{
		var cf = '';
		if(id=='all'){
			cf = 'all';
		}
		else if(id=='confirmed'){
			cf = '7';
		}
		else if(id=='cancelled'){ 
			cf = '4';
		}
		else if(id=='waitingforacceptance'){ 
			cf = '2';
		}
		else if(id=='rejected'){ 
			cf = '3';
		}
		else if(id=='expired'){ 
			cf = '6';
		}
		else if(id=='attended'){ 
			cf = '12';
		}
		else if(id=='waitingforreview'){ 
			cf = '8';
		}
		else if(id=='waitingforbookerreview'){ 
			cf = '10';
		}
		else if(id=='waitingforpaymentcleared'){ 
			cf = '13';
		}
		else if(id=='completed'){ 
			cf = '11';
		}
	  this.setState({cfilter:id,page:1,dataList:[],nodata:0},this.get_orders(cf,1)); 
  }
  render = () => 
    {
		console.log("cfilter " + this.state.cfilter);
		var fall = (this.state.cfilter == 'all')?styles.selected_tab:styles.tab;
		var fpending = (this.state.cfilter == 'pending')?styles.selected_tab:styles.tab;
		var fwaitingforacceptance = (this.state.cfilter == 'waitingforacceptance')?styles.selected_tab:styles.tab;
		var fconfirmed = (this.state.cfilter == 'confirmed')?styles.selected_tab:styles.tab;
		var fcancelled = (this.state.cfilter == 'cancelled')?styles.selected_tab:styles.tab;
		var frejected = (this.state.cfilter == 'rejected')?styles.selected_tab:styles.tab;
		var fexpired = (this.state.cfilter == 'expired')?styles.selected_tab:styles.tab;
		var fattended = (this.state.cfilter == 'attended')?styles.selected_tab:styles.tab;
		var fwaitingforreview = (this.state.cfilter == 'waitingforreview')?styles.selected_tab:styles.tab;
		var fwaitingforbookerreview = (this.state.cfilter == 'waitingforbookerreview')?styles.selected_tab:styles.tab;
		var fwaitingforpaymentcleared = (this.state.cfilter == 'waitingforpaymentcleared')?styles.selected_tab:styles.tab;
		var fcompleted = (this.state.cfilter == 'completed')?styles.selected_tab:styles.tab;
		
		var fallt = (this.state.cfilter == 'all')? [styles.headerGrey,styles.whiteText,AppStyles.regularFontText] : [styles.headerGrey,AppStyles.regularFontText];
		var fwaitingforacceptancet = (this.state.cfilter == 'waitingforacceptance')? [styles.headerGrey,styles.whiteText,AppStyles.regularFontText] :[styles.headerGrey,AppStyles.regularFontText];
		var fconfirmedt = (this.state.cfilter == 'confirmed')? [styles.headerGrey,styles.whiteText,AppStyles.regularFontText] :[styles.headerGrey,AppStyles.regularFontText];
		var fcancelledt = (this.state.cfilter == 'cancelled')? [styles.headerGrey,styles.whiteText,AppStyles.regularFontText] :[styles.headerGrey,AppStyles.regularFontText];
		var frejectedt = (this.state.cfilter == 'rejected')? [styles.headerGrey,styles.whiteText,AppStyles.regularFontText] :[styles.headerGrey,AppStyles.regularFontText];
		var fexpiredt = (this.state.cfilter == 'expired')? [styles.headerGrey,styles.whiteText,AppStyles.regularFontText] :[styles.headerGrey,AppStyles.regularFontText];
		var fattendedt = (this.state.cfilter == 'attended')? [styles.headerGrey,styles.whiteText,AppStyles.regularFontText] :[styles.headerGrey,AppStyles.regularFontText];
		var fwaitingforreviewt = (this.state.cfilter == 'waitingforreview')? [styles.headerGrey,styles.whiteText,AppStyles.regularFontText] :[styles.headerGrey,AppStyles.regularFontText];
		var fwaitingforbookerreviewt = (this.state.cfilter == 'waitingforbookerreview')? [styles.headerGrey,styles.whiteText,AppStyles.regularFontText] :[styles.headerGrey,AppStyles.regularFontText];
		var fwaitingforpaymentclearedt = (this.state.cfilter == 'waitingforpaymentcleared')? [styles.headerGrey,styles.whiteText,AppStyles.regularFontText] :[styles.headerGrey,AppStyles.regularFontText];
		var fcompletedt = (this.state.cfilter == 'completed')? [styles.headerGrey,styles.whiteText,AppStyles.regularFontText] :[styles.headerGrey,AppStyles.regularFontText];
		
		var disabled = false;
		if(this.callInvoked)
			disabled = true;
    return(
    <View style={[AppStyles.container, styles.background]}>
		<View style={{backgroundColor:'#303030',height:50,flexDirection:'row',justifyContent:'center',alignItems:'center',width:AppSizes.screen.width}}> 
		<ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{paddingTop:5,backgroundColor:'#303030',width:AppSizes.screen.width}} >
			<TouchableOpacity disabled={disabled} onPress={this.filter.bind(this,'all')} style={fall}>
				<Text style={fallt}>{Strings.props[this.state.userLang].all}</Text>
			</TouchableOpacity>
			<TouchableOpacity disabled={disabled} onPress={this.filter.bind(this,'waitingforacceptance')} style={fwaitingforacceptance}>
				<Text style={fwaitingforacceptancet}>{Strings.props[this.state.userLang].waitingforacceptance}</Text>
			</TouchableOpacity>
			<TouchableOpacity disabled={disabled} onPress={this.filter.bind(this,'confirmed')} style={fconfirmed}>
				<Text style={fconfirmedt}>{Strings.props[this.state.userLang].confirmed}</Text>
			</TouchableOpacity>
			<TouchableOpacity disabled={disabled} onPress={this.filter.bind(this,'cancelled')} style={fcancelled}>
				<Text style={fcancelledt}>{Strings.props[this.state.userLang].cancelled}</Text>
			</TouchableOpacity>
			<TouchableOpacity disabled={disabled} onPress={this.filter.bind(this,'rejected')} style={frejected}>
				<Text style={frejectedt}>{Strings.props[this.state.userLang].rejected}</Text>
			</TouchableOpacity>
			<TouchableOpacity disabled={disabled} onPress={this.filter.bind(this,'expired')} style={fexpired}>
				<Text style={fexpiredt}>{Strings.props[this.state.userLang].expired}</Text>
			</TouchableOpacity>
			<TouchableOpacity disabled={disabled} onPress={this.filter.bind(this,'attended')} style={fattended}>
				<Text style={fattendedt}>{Strings.props[this.state.userLang].attended}</Text>
			</TouchableOpacity>
			<TouchableOpacity disabled={disabled} onPress={this.filter.bind(this,'waitingforreview')} style={fwaitingforreview}>
				<Text style={fwaitingforreviewt}>{Strings.props[this.state.userLang].waitingforreview}</Text>
			</TouchableOpacity>
			<TouchableOpacity disabled={disabled} onPress={this.filter.bind(this,'waitingforbookerreview')} style={fwaitingforbookerreview}>
				<Text style={fwaitingforbookerreviewt}>{Strings.props[this.state.userLang].waitingforbookerreview}</Text>
			</TouchableOpacity>
			<TouchableOpacity disabled={disabled} onPress={this.filter.bind(this,'waitingforpaymentcleared')} style={fwaitingforpaymentcleared}>
				<Text style={fwaitingforpaymentclearedt}>{Strings.props[this.state.userLang].waitingforpaymentcleared}</Text>
			</TouchableOpacity>
			<TouchableOpacity disabled={disabled} onPress={this.filter.bind(this,'completed')} style={fcompleted}>
				<Text style={fcompletedt}>{Strings.props[this.state.userLang].completed}</Text>
			</TouchableOpacity>
	</ScrollView>
	</View>
		{(this.state.nodata == 0) ? 
			<View style={{padding:0,margin:0,height:(AppSizes.screen.height-130)}}> 
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
export default connect(mapStateToProps,mapDispatchToProps)(Order);
