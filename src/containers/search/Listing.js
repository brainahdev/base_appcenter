/**
 * Listing Screen
 *
 * Lists the search matches cars
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  Platform,
  ScrollView,
  ListView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import * as UserActions from '@redux/user/actions';
import { connect } from 'react-redux';
import { AppConfig} from '@constants/';
import Filter from '@containers/search/Filter';
import Sort from '@containers/search/Sort';
import Strings from '@lib/string.js'
import NavComponent from '@components/NavComponent.js'
// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';
// Components
import { Spacer, Text, Button,Card,FormInput,} from '@ui/';
var moment = require('moment');
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
// Any actions to map to the component?
const mapStateToProps = state =>{return({ user_data: state.user.user_data})};
const mapDispatchToProps = {
  Search: UserActions.Search,
};
/* Component ==================================================================== */
class Listing extends Component {
  static componentName = 'Listing';
  static propTypes = {
	Search: PropTypes.func.isRequired,
  }
  constructor(props) { 
		super(props); 
		this.callInvoked=0;
		this.filter_values='';
		this.sort_values='';
		this.fpayload='';
		this.spayload='';
		this.state = { 
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2,
			  }),
			page:1,
			userLang:'en',
			start_date:this.props.start_date,
			end_date:this.props.end_date,
			address_id:this.props.address_id,
			address:this.props.address,
			dataList:[],
			nodata:0,
			show_filter:0,
			show_sort:0,
			filter_height:(Platform.OS == 'ios')?60:40,
			total_days:moment(new Date(this.props.end_date)).diff(new Date(this.props.start_date),'days'),
		}; 
		 
		console.log("ddddddd " + moment(new Date(this.props.end_date)).diff(new Date(this.props.start_date),'days'));
  }
  async setUserLanguage() { 
    var l = await AsyncStorage.getItem('userLang'); 
	this.setState({userLang:l});
  } 
  componentDidMount(){
		this.setUserLanguage();
		this.search(1);
  }
  componentWillUnmount(){
	  if(this.props.reload)
		this.props.reload();
  }
  search(p){
	if(this.callInvoked == 0){
		//get the search lists
		var vehicle_type = [];
		var fuel_type = [];
		var payload = '';
		var seat_min=0;
		var seat_max=0;
		var ac=0;
		var airbag=0;
		var manual_transmission=0;
		var non_ac=0;
		var auto_transmission=0;
		//sort =>price
		//sort_by_price = > day/hour
		//sortby=> asc/desc
		var pge = (p == 1)?p:this.state.page;
		if(this.filter_values){
			console.log("filter_values"+JSON.stringify(this.filter_values));
			vehicle_type = this.filter_values.selected_filter.car_types;
			fuel_type = this.filter_values.selected_filter.fuel_options;
			var sc=this.filter_values.selected_filter.seating_capacity;
			seat_min = sc[0];
			seat_max = sc[1];
			
			if(this.filter_values.selected_filter.preferences.length){
				for(var i=0;i<this.filter_values.selected_filter.preferences.length;i++){
					if(this.filter_values.selected_filter.preferences[i] == 'ac')
						ac = 1;
					else if(this.filter_values.selected_filter.preferences[i] == 'airbag')
						airbag = 1;
					else if(this.filter_values.selected_filter.preferences[i] == 'manual_transmission')
						manual_transmission = 1;
					else if(this.filter_values.selected_filter.preferences[i] == 'non_ac')
						non_ac = 1;
					else if(this.filter_values.selected_filter.preferences[i] == 'auto_transmission')
						auto_transmission = 1;
				}
			}
			//filter_values{"selected_filter":{"car_types":[3,2],"day_price":[300,2748],"hour_price":[112,200],"preferences":["ac","non_ac","manual_transmission","auto_transmission","airbag"],"fuel_options":[2,3,5,4,1],"seating_capacity":[6,9]}}
			
			//{"vehicle_type":[2,3],"fuel_type":[2,5],"price_type":"hour","page":1,"price_min":12,"price_max":192,"auto_transmission":1,"airbag":1,"seat_min":4,"seat_max":9}
			
			payload = {"start_date":this.state.start_date,"end_date":this.state.end_date,"pickup_location_id":this.state.address_id,"drop_location_id":this.state.address_id,"pickup_location":{"id":this.state.address_id,"address":this.state.address},"drop_location":{"id":this.state.address_id,"address":this.state.address},"vehicle_type":vehicle_type,"fuel_type":fuel_type,"seat_min":seat_min,"seat_max":seat_max,"sort":"price","sortby":"asc","page":pge,"pickup_date":this.state.start_date,"drop_date":this.state.end_date};
			if(ac)
				payload['ac']=1;
			if(airbag)
				payload['airbag']=1;
			if(manual_transmission)
				payload['manual_transmission']=1;
			if(non_ac)
				payload['non_ac']=1;
			if(auto_transmission)
				payload['auto_transmission']=1;
			if(this.filter_values.selected_filter.price_type == 'day'){
				payload['price_type'] = 'day';
				payload['price_min'] = this.filter_values.selected_filter.day_price[0];
				payload['price_max'] = this.filter_values.selected_filter.day_price[1];
			}else{
				payload['price_type'] = 'hour';
				payload['price_min'] = this.filter_values.selected_filter.hour_price[0];
				payload['price_max'] = this.filter_values.selected_filter.hour_price[1];
			}
		}else{
			payload = {"start_date":this.state.start_date,"end_date":this.state.end_date,"pickup_location_id":this.state.address_id,"drop_location_id":this.state.address_id,"pickup_location":{"id":this.state.address_id,"address":this.state.address},"drop_location":{"id":this.state.address_id,"address":this.state.address},"vehicle_type":vehicle_type,"fuel_type":fuel_type,"sort":"price","sortby":"asc","page":pge,"pickup_date":this.state.start_date,"drop_date":this.state.end_date};
		}
		if(this.sort_values){
			console.log("sort_values"+JSON.stringify(this.sort_values));
			this.spayload = this.sort_values.selected_filter;
			if(this.spayload && this.spayload.sort == 'day'){
				payload['sort_by_price'] = 'day';
				payload['sort'] = 'price';
			}
			if(this.spayload && this.spayload.sort == 'hour'){
				payload['sort_by_price'] = 'hour';
				payload['sort'] = 'price';
			}
			if(this.spayload && this.spayload.sort == 'rating'){
				payload['sort'] = 'rating';
			}
			if(this.spayload && this.spayload.sortby){
				payload['sortby'] = this.spayload.sortby;
			}
		}
		console.log("filter_values payload"+JSON.stringify(payload));
		this.callInvoked=1;
		this.fpayload = payload;
		this.props.Search(payload).then((resp) => {
			console.log("datalist " + JSON.stringify(resp));
			var datares=this.state.dataList.concat(resp.data);
			var cpage = this.state.page + 1;
			this.callInvoked=0;
			if(pge == 1 && resp.data.length ==0)
				this.setState({nodata:1,page:cpage,dataList:datares,dataSource: this.state.dataSource.cloneWithRows(datares)});
			else
				this.setState({page:cpage,dataList:datares,dataSource: this.state.dataSource.cloneWithRows(datares)});
		}).catch(() => {
			console.log("error");
		});
	}
  }
  viewdetails(data){
	  var vdata = JSON.stringify(data);
	  Actions.VehicleDetail({'viewdata':vdata});
  }
  booknow(data){
	  var vdata = JSON.stringify(data);
	  var bookingdata = {'vehicle_id':data.id,'address_id':this.props.address_id,'address':this.props.query,'start_date':moment(this.props.start_date).format(),'end_date':moment(this.props.end_date).format()}
	  Actions.BookNow({'viewdata':vdata,'bookingdata':bookingdata});
  }
  _renderRow=(data)=>{
	 var imageurl=AppConfig.car_image;
     if(data && data.attachments && data.attachments.thumb){
		 imageurl = data.attachments.thumb.largemedium;
	 }
	 var book = true;
	 if(this.props.user_data && this.props.user_data.id == data.user_id){
		 book = false;
	 }
	 console.log('tttt ' + JSON.stringify(data));
     return ( 
		<View style={{width: AppSizes.screen.width,justifyContent:'center',alignItems:'flex-end',marginBottom:5}} >
			<View style={{backgroundColor: AppColors.brand.white,width: AppSizes.screen.width-35,borderRadius:10,height:140,marginRight:5,paddingLeft:70,paddingTop:10,shadowColor: '#000000',shadowOffset: {width: 0,height: 3},shadowRadius: 5,shadowOpacity: 1.0}}>
				<View style={{flexDirection:'row'}}>
					<TouchableOpacity onPress={this.viewdetails.bind(this,data)} style={{flex:0.55}}>
						<Text style={styles.header,[AppStyles.boldedFontText]}>{data.name}</Text>
						<View style={{flexDirection:'row'}}><Text style={[styles.header,{color:'orange'},AppStyles.boldedFontText]}>${data.per_day_amount}</Text><Text style={[styles.header,AppStyles.regularFontText]}> / {Strings.props[this.state.userLang].day}</Text></View>
						<View style={{flexDirection:'row'}}><Text style={[styles.header,{color:'orange'},AppStyles.boldedFontText]}>${this.state.total_days * data.per_day_amount}</Text><Text style={[styles.header,AppStyles.regularFontText]}> / {Strings.props[this.state.userLang].totaltripcost}</Text></View>
						{data.max_discount_percent ?
							<View>
								<Spacer size={5}/>
								<View style={{flexDirection:'row'}}><Text style={[styles.header,AppStyles.regularFontText]}>{data.max_discount_percent}% {Strings.props[this.state.userLang].offer}</Text></View>
							</View>
						: null}
					</TouchableOpacity>
					{(book) ? 
						<TouchableOpacity onPress={this.booknow.bind(this,data)} style={{flex:0.45,justifyContent:'center',alignItems:'center'}}>
							<Image style={{width:75,height:50,justifyContent:'center',alignItems:'center',paddingBottom:3,paddingRight:5}} source={require('@images/button-bg.png')} >
								<Text style={[{color:'#fff',fontSize: 11},AppStyles.regularFontText]}>{Strings.props[this.state.userLang].book}</Text>
							</Image>
						</TouchableOpacity> 
					:null}
				</View>
				<View style={{flexDirection:'row',flexWrap:'wrap'}}>
					{data.is_manual_transmission ?
						<View style={{flexDirection:'row',marginRight:10}}>
							<View style={{justifyContent:'flex-start'}}>
								<Image style={{width:20,height:20,paddingRight:3}} source={require('@images/manual.png')}/>
							</View>
							<View style={{justifyContent:'center'}}>
								<Text style={{fontSize:12}}>{Strings.props[this.state.userLang].manual}</Text>
							</View>
						</View>
					: null}
					{data.is_ac ?
						<View style={{flexDirection:'row',marginRight:10}}>
							<View style={{justifyContent:'flex-start'}}>
								<Image style={{width:20,height:20,paddingRight:3}} source={require('@images/air.png')}/>
							</View>
							<View style={{justifyContent:'center'}}>
								<Text style={{fontSize:12}}>{Strings.props[this.state.userLang].aircondition}</Text>
							</View>
						</View>
					: null}
					{data.no_of_seats ?
						<View style={{flexDirection:'row',marginRight:10}}>
							<View style={{justifyContent:'flex-start'}}>
								<Image style={{width:20,height:20,paddingRight:3}} source={require('@images/user-list.png')}/>
							</View>
							<View style={{justifyContent:'center'}}>
								<Text style={{fontSize:12}}>{data.no_of_seats} {Strings.props[this.state.userLang].people}</Text>
							</View>
						</View>
					: null}
					{data.no_small_bags ?
						<View style={{flexDirection:'row',marginRight:10}}>
							<View style={{justifyContent:'flex-start'}}>
								<Image style={{width:20,height:20,paddingRight:3}} source={require('@images/bag.png')}/>
							</View>
							<View style={{justifyContent:'center'}}>
								<Text style={{fontSize:12}}>{data.no_small_bags} {Strings.props[this.state.userLang].smallbags}</Text>
							</View>
						</View>
					: null}
					{data.no_large_bags ?
						<View style={{flexDirection:'row',marginRight:10}}>
							<View style={{justifyContent:'flex-start'}}>
								<Image style={{width:20,height:20,paddingRight:3}} source={require('@images/luggage.png')}/>
							</View>
							<View style={{justifyContent:'center'}}>
								<Text style={{fontSize:12}}>{data.no_large_bags} {Strings.props[this.state.userLang].largebags}</Text>
							</View>
						</View>
					: null}
				</View>
			</View>
			<TouchableOpacity onPress={this.viewdetails.bind(this,data)} style={{backgroundColor: '#fff',borderWidth:1,borderColor:'#eee',width:75,height:75,borderRadius:10,left:5,position:'absolute',shadowColor: '#000000',    shadowOffset: {width: 0,height: 3},shadowRadius: 5,shadowOpacity: 1.0}}>
				<Image style={{width:75,height:75,borderRadius:10}} source={{uri:imageurl}} />
			</TouchableOpacity>
		</View>

         );
   }
  onEndReached=()=>{
	this.search(0);
  }
  filter=()=>{
	 if(this.state.show_filter)
		this.setState({show_filter:0});
	 else
		 this.setState({show_filter:1,show_sort:0});
  }
  sort=()=>{
	 if(this.state.show_sort)
		this.setState({show_sort:0});
	 else
		 this.setState({show_sort:1,show_filter:0});
  }
  apply_sort=(options)=>{
	  this.setState({show_sort:0,dataList:[],nodata:0});
	  this.sort_values = options;
	  this.search(1);
  }
  apply_filter=(options)=>{
	  this.setState({show_filter:0,dataList:[],nodata:0});
	  this.filter_values = options;
	  this.search(1);
  }

  render = () => {
	  console.log("nodata === " + this.state.nodata);
	  return(
    <View style={[AppStyles.container, styles.background]}>
		<NavComponent backArrow={true} title={Strings.props[this.state.userLang].findacar} is_sort={true} onsortPress={this.sort} is_filter={true} onRightNavPress={this.filter}/>
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
		<View>
		{(this.state.nodata == 0) ? 
			<View style={{height:AppSizes.screen.height-125}}>
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
		{this.state.show_filter ? 
			<View style={{position:'absolute',right:0,width:300,top:this.state.filter_height}}>
				<Filter callBack={this.apply_filter} payload={this.fpayload}/>
			</View>
		: null}
		{this.state.show_sort ? 
			<View style={{position:'absolute',right:0,width:300,top:this.state.filter_height}}>
				<Sort callBack={this.apply_sort} payload={this.fpayload}/>
			</View>
		: null}
    </View>
);}
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps,mapDispatchToProps)(Listing); 
