/**
 * Calender Screen
 *
 * vehicle_rentals
 */ 
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ListView,
  AsyncStorage,
  ScrollView,
} from 'react-native';
import * as UserActions from '@redux/user/actions';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { AppConfig} from '@constants/';
import Strings from '@lib/string.js'
import NavComponent from '@components/NavComponent.js'
// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';
import {Agenda} from 'react-native-calendars';
// Components
import { Spacer, Text, Button,Card,FormInput,} from '@ui/';
var moment = require('moment');
const mapStateToProps = () => ({
});
const mapDispatchToProps = {
  bookings: UserActions.bookings,
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
	  margin:3,padding:2,minWidth:70,paddingLeft:10,paddingRight:10,backgroundColor:AppColors.brand.primary,borderRadius:10,justifyContent:'center',alignItems:'center',height:23
  },
  selected_tab:{
	  margin:3,padding:2,minWidth:70,paddingLeft:10,paddingRight:10,backgroundColor:AppColors.brand.btnColor,borderRadius:10,justifyContent:'center',alignItems:'center',height:23
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }
});

/* Component ==================================================================== */
class Calender extends Component {
  static componentName = 'Calender';
  static propTypes = {
	bookings: PropTypes.func.isRequired,
  }
  constructor() { super(); 
	var strTime = moment().unix();
	this.state={
		calendar_data:'',
		userLang:'en',
	}
	this.setUserLanguage();
  }
  async setUserLanguage() { 
    var l = await AsyncStorage.getItem('userLang'); 
	this.setState({userLang:l});
  } 
  componentDidMount(){
	this.props.bookings({'call_from':'calendar'}).then((resp) => {
			this.setState({calendar_data:resp.data});
		}).catch(() => {
			console.log("error"); 
		});
  }
  renderItem(item) {
    return (
      <View style={[styles.item]}><Text>{item.text}</Text></View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text>{Strings.props[this.state.userLang].nobookings}</Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }
  render = () => 
    {
		var calendar_vals = {};
		if(this.state.calendar_data){
			var cdata = this.state.calendar_data;
			for(var i=0;i< cdata.length;i++){
				
				var item_booking_start_date =  cdata[i].item_booking_start_date;
				var item_booking_end_date =  cdata[i].item_booking_end_date;
				var total_days = (cdata[i].date_diff)?cdata[i].date_diff.total_days:0;
				var total_hours = (cdata[i].date_diff)?cdata[i].date_diff.total_hours:0;
			    if(total_days && total_hours){
					total_days = total_days++; 
				}
				var fsd = moment(item_booking_start_date).format("YYYY-MM-DD");
				var fed = moment(item_booking_end_date).format("YYYY-MM-DD");
				if(fsd != fed && total_days == 1)
					total_days = 2;
				
				var txtVal = cdata[i].item_userable.name +" "+moment(item_booking_start_date).format("MMM DD, YYYY h:mm:ss a")+" - "+moment(item_booking_end_date).format("MMM DD, YYYY h:mm:ss a");
				if(total_days){
					var key = moment(item_booking_start_date).format("YYYY-MM-DD");
					for(j=0;j<total_days;j++){
						if(j>0){
							key = moment(item_booking_start_date).add(j, 'days').format("YYYY-MM-DD");
						}
						console.log("calendar_data ==="+JSON.stringify(key) + total_days);
						if(calendar_vals.hasOwnProperty(key)){
							var keyvalues = calendar_vals[key];
							keyvalues.push({text:txtVal});
							calendar_vals[key] = keyvalues;
						}
						else{
							calendar_vals[key] = [{text:txtVal}];
						}
					}
				}
				
				if(total_hours && total_days == 0){
					var key = moment(item_booking_start_date).format("YYYY-MM-DD");
					if(calendar_vals.hasOwnProperty(key)){
						var keyvalues = calendar_vals[key];
						keyvalues.push({text:txtVal})
						calendar_vals[key] = keyvalues;
					}
					else{
						calendar_vals[key] = [{text:txtVal}];
					}
						 
				}
			}
			for(var i=-30;i< 30;i++){
				var key = moment().add(i,"days").format("YYYY-MM-DD");
				console.log("calendar_data ==="+JSON.stringify(key));
				if(!calendar_vals.hasOwnProperty(key)){
					calendar_vals[key] = []; 
				}
			}
			//console.log("calendar_data ==  " + JSON.stringify(calendar_vals));
			/*items={
				{'2018-02-27': [{text: ' TOYOTA:Etios #73 Jan 31, 2018 12:00 AM - Feb 21, 2018 12:00 AM (00:00)'},{text: 'HONDA:Amaze#55 Feb 15, 2018 4:30 AM - Feb 16, 2018 4:30 AM (04:30)'}],
				 '2018-02-28': [{text: 'TOYOTA:Etios #73 Jan 31, 2018 12:00 AM - Feb 21, 2018 12:00 AM (00:00)'}],
				 '2018-03-11': [],
				 '2018-03-12': [{text: 'TOYOTA:Etios #73 Jan 31, 2018 12:00 AM - Feb 21, 2018 12:00 AM (00:00)'}],
				 '2018-03-12': [{text: 'TOYOTA:Etio #73 Jan 31, 2018 12:00 AM - Feb 21, 2018 12:00 AM (00:00)'}],
				}}*/
		}
		
    return(
    <View style={[AppStyles.container, styles.background]}> 
		<Agenda
			items={calendar_vals}
			selected={moment().format('YYYY-MM-DD')}
			renderItem={this.renderItem.bind(this)}
			renderEmptyDate={this.renderEmptyDate.bind(this)}
			rowHasChanged={this.rowHasChanged.bind(this)}
			
			// markingType={'period'}
			// markedDates={{
			//    '2017-05-08': {textColor: '#666'},
			//    '2017-05-09': {textColor: '#666'},
			//    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
			//    '2017-05-21': {startingDay: true, color: 'blue'},
			//    '2017-05-22': {endingDay: true, color: 'gray'},
			//    '2017-05-24': {startingDay: true, color: 'gray'},
			//    '2017-05-25': {color: 'gray'},
			//    '2017-05-26': {endingDay: true, color: 'gray'}}}
			 // monthFormat={'yyyy'}
			 // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
			//renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
		  />
		  <Spacer size={10}/>
    </View>
   );}
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps,mapDispatchToProps)(Calender);