/**
 * Book Now Screen
 *
 * BookNow screen that confirms the details
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  ListView,
  ScrollView,
} from 'react-native';
import * as UserActions from '@redux/user/actions';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { AppConfig} from '@constants/';

import Strings from '@lib/string.js'
import NavComponent from '@components/NavComponent.js';
var moment = require('moment');
// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';
import { CheckBox } from 'react-native-elements'
// Components
import { Spacer, Text, Button,Card,FormInput,} from '@ui/';

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
const mapStateToProps = state =>{return({ user_data: state.user.user_data})}; 
const mapDispatchToProps = {
  bookings: UserActions.bookings,
};
/* Component ==================================================================== */
class BookNow extends Component {
  static componentName = 'BookNow';
  static propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string,
    }),
  }

  static defaultProps = {
    user: null,
	bookings: PropTypes.func.isRequired,
  }
  constructor(props) { 
	super(props); 
	this.viewdata = JSON.parse(this.props.viewdata);
	this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2,
			  }),
			page:1,
			vehicle_id:this.props.bookingdata.vehicle_id,
			start_date:this.props.bookingdata.start_date,
			end_date:this.props.bookingdata.end_date,
			address_id:this.props.bookingdata.address_id,
			address:this.props.bookingdata.address,
			pickup_address_id:this.props.bookingdata.address_id,
			pickup_address:this.props.bookingdata.address,
			dropup_address_id:this.props.bookingdata.address_id,
			dropup_address:this.props.bookingdata.address,
			dataList:[],
			userLang:'en',
			nodata:0,
			loading:false,
			
			total_days:moment(new Date(this.props.bookingdata.end_date)).diff(new Date(this.props.bookingdata.start_date),'days'),
		}; 
		this.setUserLanguage();
  }
  async setUserLanguage() { 
    var l = await AsyncStorage.getItem('userLang'); 
	this.setState({userLang:l});
  } 
  changePickup=(data)=>{
	  this.setState({pickup_address_id:data.id,pickup_address:data.address});
  }
  changeDropup=(data)=>{
	  this.setState({dropup_address_id:data.id,dropup_address:data.address});
  }
  BookOrderPay=()=>{
	  this.setState({loading:true});
	  if(this.props.user_data && this.props.user_data.email){
			var payload = {"vehicle_id":this.state.vehicle_id,"item_booking_start_date":this.state.start_date,"item_booking_end_date":this.state.end_date,"pickup_counter_location_id":this.state.pickup_address_id,"drop_counter_location_id":this.state.dropup_address_id,"call_from":"booknow"};
			
			console.log("respppp responseJson bn" + JSON.stringify(this.state.vehicle_id ));
							
			this.props.bookings(payload).then((resp) => {
				if(resp.id){
					AsyncStorage.setItem('book_details', ''); 
					Actions.BookOrderPay({'viewdata':resp});
				}
			}).catch((err) => {
				console.log("error"  + JSON.stringify(err));
			});
			
	  }else{
		  var data_list = {"vehicle_id":this.state.vehicle_id,'pickup_address_id':this.state.pickup_address_id,'pickup_address':this.state.pickup_address,'dropup_address_id':this.state.dropup_address_id,'dropup_address':this.state.dropup_address,'start_date':this.state.start_date,'end_date':this.state.end_date};
		AsyncStorage.setItem('book_details', JSON.stringify(data_list)); 
		Actions.authLanding({'userfrom':'booknow'});
	  }
  }
  
  render = () => 
    {
		var counter_start_locations = [];
		if(this.viewdata){
			for (var j = 0; j < this.viewdata.pickup_locations.length; j++)
			{
				var data = this.viewdata.pickup_locations[j]
				var pickup_address = false;
				if(data.id == this.state.pickup_address_id)
					pickup_address=true;
				counter_start_locations.push(<CheckBox
												key={j}
												  left
												  checked={pickup_address}
												  title={data.address}
												  onPress={this.changePickup.bind(this,data)}
												  checkedIcon='dot-circle-o'
												  uncheckedIcon='circle-o'
												  containerStyle={{backgroundColor:'transparent'}}
												  textStyle={[styles.normalText11,,AppStyles.regularFontText]} 
												/> 
											)
			 }
		}
		var counter_end_locations = [];
		if(this.viewdata){
			for (var j = 0; j < this.viewdata.drop_locations.length; j++)
			{
				var data = this.viewdata.drop_locations[j]
				var dropup_address = false;
				if(data.id == this.state.dropup_address_id)
					dropup_address=true;
				counter_end_locations.push(	<CheckBox
												key={j} 
												  left
												  checked={dropup_address} 
												  onPress={this.changeDropup.bind(this,data)}
												  title={data.address}
												  checkedIcon='dot-circle-o'
												  uncheckedIcon='circle-o'
												  containerStyle={{backgroundColor:'transparent'}}
												  textStyle={[styles.normalText11,,AppStyles.regularFontText]} 
												/> 
											)
			 }
		}
    return(
    <View style={[AppStyles.container, styles.background]}>
		<View style={{backgroundColor:'#303030',height:50,flexDirection:'row',justifyContent:'center',alignItems:'center',width:AppSizes.screen.width}}>
			<View style={[styles.col]}>
				<View><Text style={[styles.headerGrey,AppStyles.regularFontText]}>{moment(new Date(this.state.start_date)).format('dddd')}</Text></View>
				<View><Text style={[styles.headerGrey,AppStyles.regularFontText]}>{moment(new Date(this.state.start_date)).format('DD MMM YYYY, h:mm A')}</Text></View>
			</View>
			<View style={{width:40}}>
				<Image style={{width:40,height:40}} source={require('@images/date-select-arror.png')} />
			</View>
			<View style={[styles.col]}>
				<View><Text style={[styles.headerGrey,AppStyles.regularFontText]}>{moment(new Date(this.state.end_date)).format('dddd')}</Text></View>
				<View><Text style={[styles.headerGrey,AppStyles.regularFontText]}>{moment(new Date(this.state.end_date)).format('DD MMM YYYY, h:mm A')}</Text></View>
			</View> 		
		</View>
		<Spacer size={10} />
		<ScrollView>
			<Card>
				<View><Text>{Strings.pickuplocation}</Text></View>
				<View style={{justifyContent:'flex-start'}}>
				{counter_start_locations}
				</View>
			</Card>
			<Card>
				<View><Text>{Strings.dropuplocation}</Text></View>
				<View style={{justifyContent:'flex-start'}}>
				{counter_end_locations} 
				</View>
			</Card>
		</ScrollView>
		<Spacer size={10} />
		<Button
			small
			title={Strings.next}
			backgroundColor={AppColors.brand.btnColor}
			onPress={this.BookOrderPay}
			borderRadius = {50}
			fontSize={15}
			buttonStyle={{padding:14,margin:10}}
			outlined
		  /> 
    </View>
   );}
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps,mapDispatchToProps)(BookNow);