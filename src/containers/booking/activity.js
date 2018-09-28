/**
 * Activity Screen
 *
 * Lists the activities
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,Alert,
  AsyncStorage,
  ListView,
  ScrollView,
} from 'react-native';
import * as UserActions from '@redux/user/actions';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { AppConfig} from '@constants/';
var moment = require('moment');
var timezone = require('moment-timezone');
import Strings from '@lib/string.js'
import NavComponent from '@components/NavComponent.js';
import Loading from '@components/general/Loading';
// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';
import ModalPicker from 'react-native-modal-picker';
// Components
import { Spacer, Text, Button,Card,FormInput,LblFormInput} from '@ui/';
import { Rating } from 'react-native-elements';

const mapStateToProps = () => ({
});
const mapDispatchToProps = {
  item_user_messages: UserActions.item_user_messages,
  bookings: UserActions.bookings,
  private_notes:UserActions.private_notes,
  vehicle_disputes:UserActions.vehicle_disputes,
  booker:UserActions.booker,
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
  headerTitle:{
	  fontWeight:'bold',
	  fontSize:16,
  },
  header:{
	  fontSize:14,
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
  selected_tab:{
	  margin:3,padding:2,minWidth:70,paddingLeft:10,paddingRight:10,backgroundColor:AppColors.brand.btnColor,borderRadius:10,justifyContent:'center',alignItems:'center',height:23
  },
});

/* Component ==================================================================== */
class Activity extends Component {
  static componentName = 'Activity';
  static propTypes = {
	item_user_messages: PropTypes.func.isRequired,
	bookings: PropTypes.func.isRequired,
	private_notes: PropTypes.func.isRequired,
	vehicle_disputes:PropTypes.func.isRequired,
	booker:PropTypes.func.isRequired,
  }
  constructor(props) { 
		super(props); 
		
		this.callInvoked=0;
		this.data = JSON.parse(this.props.data);
		this.state = { 
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2,
			  }),
			page:1,
			dataList:[],
			nodata:0,
			data:JSON.parse(this.props.data),
			cfilter:this.data.id,
			rating_value:0,
			selected_index:0,
			private_note_value:'',
			loading:false,
			vehicle_disputes:[],
			vehicle_dispute_type_id:0,
			vehicle_dispute_type_lbl:'',
			userLang:'en',
		}; 
		 this.setUserLanguage();
  }
  async setUserLanguage() { 
    var l = await AsyncStorage.getItem('userLang'); 
	this.setState({userLang:l});
  } 
  componentDidMount(){
	this.activity_data();
	this.item_user_messages(this.data.id,1); 
	this.vehicle_disputes();
  }
  vehicle_disputes(){
	var payload = {"id":this.data.id};
	this.props.vehicle_disputes(payload).then((resp) => {
		if(resp.dispute_types){
			var vehicle_type = [{ key: 0, section: true, label: Strings.props[this.state.userLang].choosedisputetype}];
			for(var i=0;i<resp.dispute_types.length;i++){
				var ojt = { key: resp.dispute_types[i].id, label: resp.dispute_types[i].name }
				vehicle_type.push(ojt); 
			}
			console.log("loooooo  " + JSON.stringify(vehicle_type));
			this.setState({vehicle_disputes: vehicle_type});
		}
	}).catch(() => {
		console.log("error");
	});
  }
  activity_data(){
	var payload = {"booking_id":this.data.id,"call_from":"activity"};
	this.props.bookings(payload).then((resp) => {
		console.log(JSON.stringify(resp));
		if(resp.id){
			if(resp.item_user_status && resp.item_user_status.id == 8){
				this.vehicle_disputes();
			} 
			this.setState({data:resp});
		}
	}).catch(() => {
		console.log("error");
	});
  }
  reload=()=>{
	  this.activity_data();
  }
  item_user_messages(q,p){
	if(this.callInvoked == 0){
		var cf = q;
		var page = (p)?p:this.state.page;
		payload = {"page":page,"filter":cf}; 
		this.callInvoked=1;
		this.props.item_user_messages(payload).then((resp) => {
			var respmessage = resp.messages.messages;
			var messagee = [];
			Object.keys(respmessage).forEach(function(key) {
				  messagee.push(JSON.stringify(respmessage[key]));
				});
				
			var datares=this.state.dataList.concat(messagee);
			
			var cpage = page + 1;
			this.callInvoked=0;
			if(this.state.page == 1 && messagee.length ==0)
				this.setState({nodata:1,page:cpage,dataList:datares,dataSource: this.state.dataSource.cloneWithRows(datares)});
			else
				this.setState({page:cpage,dataList:datares,dataSource: this.state.dataSource.cloneWithRows(datares)});
		}).catch(() => {
			console.log("error");
		});
	}
  }
  onEndReached=()=>{
	this.item_user_messages(this.data.id,0);
  }
  _renderRow=(data)=>{
	  var dta = JSON.parse(data);
	  var date = '';
	  if(dta.created_at && dta.created_at.date){
		  date = moment(dta.created_at.date);  
		  date = date.tz(dta.created_at.timezone).fromNow();  
	  }		  
     return (
		<View style={{flex:1,borderBottomWidth:0.5,borderColor:AppColors.brand.black,padding:5,paddingBottom:10}}>
			<View style={{flexDirection:'row'}}>
				<Text style={styles.normalText11}>{dta.description}</Text>
			</View>
			<View style={{flexDirection:'row'}}> 
				<View style={{flex:0.5}}>
					<Text style={[styles.normalText11,AppStyles.lightFontText]}>{date}</Text> 
				</View>
				<View style={{flex:0.5,alignItems:'flex-end'}}>
					<Text style={[styles.headerGrey,AppStyles.regularFontText]}>{dta.status}</Text>
				</View> 
			</View>
		</View>  

         );
   }
   update_status=(data)=>{
	   var id = data.id;
	   var item_user_status_id = data.item_user_status_id;
	   var type = data.type;
	   var payload = {"type":data.type,"id":id,"call_from":"activity_status_update"};
		this.props.bookings(payload).then((resp) => {
			var msg = resp.message;
			if(resp.Success){
				Alert.alert(
				  AppConfig.appName,
				  resp.Success,
				  [
				  {text: 'OK', onPress: () => console.log('OK Pressed')},
				  ],
				  { cancelable: false }
				);
				this.activity_data();
				this.setState({dataList:[]},this.item_user_messages(this.state.data.id,1));
			}
			else if(resp.message){
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
			Alert.alert(
				  AppConfig.appName,
				  msg,
				  [
				  {text: 'OK', onPress: () => console.log('OK Pressed')},
				  ],
				  { cancelable: false }
				);
			console.log("error");
		});
   }
   private_note=()=>{
	   if(this.state.private_note_value.trim() == ''){
		   Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].enterprivatenote,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	   }else{
			var payload = {"type":"post_private_note","id":this.state.data.id,"message":this.state.private_note_value};
			console.log("payload" + JSON.stringify(payload));
			this.setState({loading:true});
			this.props.private_notes(payload).then((resp) => {
				if(resp.Success){
					Alert.alert(
					  AppConfig.appName,
					  resp.Success,
					  [
					  {text: 'OK', onPress: () => console.log('OK Pressed')},
					  ],
					  { cancelable: false }
					);
					this.setState({rating_value:0,private_note_value:'',vehicle_dispute_type_id:0,vehicle_dispute_type_lbl:''});
					this.item_user_messages(this.state.data.id,1)
				}else{
					this.setState({loading:false});
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
				console.log("error");
			});
	   }
   }
   feedback=()=>{
	   if(this.state.rating_value == 0){
		   Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].provideyourrating,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	   }
	   else if(this.state.private_note_value.trim() == ''){
		   Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].enterprivatenote,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	   }else{
		   //http://bookorrent.servicepg.develag.com/public/api/host/review
		   //feedback	Good 
			//item_user_id	41
			//rating	3
			var payload = {"type":"post_booker_review","rating":this.state.rating_value,"item_user_id":this.state.data.id,"feedback":this.state.private_note_value};
			console.log("payload" + JSON.stringify(payload));
			this.setState({loading:true});
			this.props.booker(payload).then((resp) => {
				if(resp.Success){
					Alert.alert(
					  AppConfig.appName,
					  resp.Success,
					  [
					  {text: 'OK', onPress: () => console.log('OK Pressed')},
					  ],
					  { cancelable: false }
					);
					this.setState({selected_index:0,rating_value:0,private_note_value:'',vehicle_dispute_type_id:0,vehicle_dispute_type_lbl:''});
					this.activity_data();
					this.item_user_messages(this.state.data.id,1)
				}else{
					this.setState({loading:false});
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
				console.log("error");
			});
	   }
   }
   dispute=()=>{
	   if(this.state.vehicle_dispute_type_id == 0){
		   Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].choosedisputetype,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	   }
	   else if(this.state.private_note_value.trim() == ''){
		   Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].enterprivatenote,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	   }else{
		   //http://bookorrent.servicepg.develag.com/public/api/vehicle_disputes/ad
		   //dispute_type	3
			//dispute_type_id	3
			//item_user_id	76
			//reason	Worst
			var payload = {"type":"post_host_dispute","dispute_type":this.state.vehicle_dispute_type_id,"dispute_type_id":this.state.vehicle_dispute_type_id,"item_user_id":this.state.data.id,"reason":this.state.private_note_value};
			console.log("payload" + JSON.stringify(payload));
			this.setState({loading:true});
			this.props.vehicle_disputes(payload).then((resp) => {
				if(resp.Success){
					Alert.alert(
					  AppConfig.appName,
					  resp.Success,
					  [
					  {text: 'OK', onPress: () => console.log('OK Pressed')},
					  ],
					  { cancelable: false }
					);
					this.setState({rating_value:0,private_note_value:'',vehicle_dispute_type_id:0,vehicle_dispute_type_lbl:''});
					this.activity_data();
					this.item_user_messages(this.state.data.id,1)
				}else{
					this.setState({loading:false});
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
				console.log("error");
			});
	   }
   }
  render = () => 
	{
 		var view_data = this.state.data;
		var imageurl=AppConfig.car_image;
		if(view_data && view_data.item_userable && view_data.item_userable.attachments && view_data.item_userable.attachments.thumb){
			imageurl = view_data.item_userable.attachments.thumb.largemedium;
		}
		
		var notestyle = (this.state.selected_index == 0) ? 
							{borderBottomLeftRadius:20,borderTopLeftRadius:20,height:30,width:80,justifyContent:'center',alignItems:'center',backgroundColor:AppColors.brand.btnColor}
						: 
							{borderBottomLeftRadius:20,borderTopLeftRadius:20,height:30,width:80,justifyContent:'center',alignItems:'center',backgroundColor:AppColors.brand.navbar};
		var disputestyle = (this.state.selected_index == 1) ? 
							{height:30,width:80,justifyContent:'center',alignItems:'center',backgroundColor:AppColors.brand.btnColor,borderBottomLeftRadius:1,borderColor:AppColors.brand.white,borderBottomRightRadius:0.5}
						: 
							{height:30,width:80,justifyContent:'center',alignItems:'center',backgroundColor:AppColors.brand.navbar,borderBottomLeftRadius:1,borderColor:AppColors.brand.white,borderBottomRightRadius:0.5};
		var ratingstyle = (this.state.selected_index == 2) ? 
							{borderBottomRightRadius:20,borderTopRightRadius:20,height:30,width:80,justifyContent:'center',alignItems:'center',backgroundColor:AppColors.brand.btnColor}
						: 
							{borderBottomRightRadius:20,borderTopRightRadius:20,height:30,width:80,justifyContent:'center',alignItems:'center',backgroundColor:AppColors.brand.navbar};
    return(
    <View style={[AppStyles.container, styles.background],{justifyContent:'center',alignItems:'center'}}> 
		<View style={{width: AppSizes.screen.width-10,flexDirection:'row',margin:10,marginTop:0,backgroundColor:AppColors.brand.primary,padding:10,borderRadius:15}}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={{flexDirection:'row'}}>
					<View>
						<Image style={{width:100,height:100,marginRight:5}} source={{uri:imageurl}}/>
					</View>
					<View>
						<Text style={styles.headerTitle,[AppStyles.boldedFontText]}>{(view_data && view_data.item_userable && view_data.item_userable.name)?view_data.item_userable.name:null}</Text>
						<TouchableOpacity onPress={()=>{Actions.Review({'vehicle_id':view_data.item_userable_id})}}>
							<Rating
							  showRating={false}
							  type="star"
							  fractions={1}
							  startingValue={(view_data && view_data.item_userable && view_data.item_userable.feedback_rating)? parseFloat(view_data.item_userable.feedback_rating) :0}
							  readonly
							  imageSize={18}
							  style={{ paddingTop: 5 }}
							/>
						</TouchableOpacity>
						<Spacer size={5}/>
						<View style={{flexDirection:'row'}}>
							<View style={{flexDirection:'row',marginRight:5}}>
								<Text>{Strings.props[this.state.userLang].day} - </Text>
								<Text style={styles.headerGrey}>${(view_data && view_data.item_userable && view_data.item_userable.per_day_amount)?view_data.item_userable.per_day_amount:0}</Text>
							</View>
							<View style={{flexDirection:'row',marginRight:5}}>
								<Text>{Strings.props[this.state.userLang].hour} - </Text> 
								<Text style={styles.headerGrey}>${(view_data && view_data.item_userable && view_data.item_userable.per_hour_amount)?view_data.item_userable.per_hour_amount:0}</Text>
							</View>
						</View>
						<Spacer size={10} />
						<View style={{flexDirection:'row'}}>
							{(view_data.item_user_status && view_data.item_user_status.id == 1) ? 
								<TouchableOpacity style={styles.selected_tab} onPress={()=>{
									Actions.BookOrderPay({'viewdata':view_data,'reload':this.reload});
								}}> 
									<Text style={[styles.headerGrey,styles.whiteText,AppStyles.regularFontText]}>{Strings.props[this.state.userLang].paynow}</Text>
								</TouchableOpacity>
							: null}
							{(view_data.item_user_status && view_data.item_user_status.id == 2) ? 
								<TouchableOpacity style={styles.selected_tab} onPress={this.update_status.bind(this,{"id":view_data.id,"item_user_status_id":view_data.item_user_status.id,"type":"cancel"})}> 
									<Text style={[styles.headerGrey,styles.whiteText,AppStyles.regularFontText]}>{Strings.props[this.state.userLang].cancel}</Text>
								</TouchableOpacity>
							: null}
							{(view_data.item_user_status && ((view_data.item_user_status.id == 8 && view_data.is_dispute == 0) || (view_data.item_user_status.id == 10 && view_data.is_dispute == 0) )) ? 
								<View>
									<TouchableOpacity style={styles.selected_tab} onPress={this.update_status.bind(this,{"id":view_data.id,"item_user_status_id":view_data.item_user_status.id,"type":"review"})}> 
										<Text style={[styles.headerGrey,styles.whiteText,AppStyles.regularFontText]}>{Strings.props[this.state.userLang].review}</Text>
									</TouchableOpacity>
								</View>
							: null}
						</View>
					</View>
				</View>
				<Spacer size={20}/>
				<View style={{flexDirection:'row',flexWrap:'wrap',borderBottomWidth:0.5,borderTopWidth:0.5,borderColor:AppColors.brand.black,paddingTop:5,paddingBottom:5}}>
					{(view_data && view_data.item_userable && view_data.item_userable.is_manual_transmission) ? 
						<View style={{flexDirection:'row',marginRight:10}}>
							<View style={{justifyContent:'flex-start'}}>
								<Image style={{width:20,height:20}} source={require('@images/manual.png')}/>
							</View>
							<View style={{justifyContent:'center'}}>
								<Text style={{fontSize:12}}>{Strings.props[this.state.userLang].manual}</Text>
							</View>
						</View>
					: null}
					{(view_data && view_data.item_userable && view_data.item_userable.is_ac) ? 
						<View style={{flexDirection:'row',marginRight:10}}>
							<View style={{justifyContent:'flex-start'}}>
								<Image style={{width:20,height:20}} source={require('@images/air.png')}/>
							</View>
							<View style={{justifyContent:'center'}}>
								<Text style={{fontSize:12}}>{Strings.props[this.state.userLang].aircondition}</Text>
							</View>
						</View>
					: null}
					{(view_data && view_data.item_userable && view_data.item_userable.no_of_seats) ? 
						<View style={{flexDirection:'row',marginRight:10}}>
							<View style={{justifyContent:'flex-start'}}>
								<Image style={{width:20,height:20}} source={require('@images/user-list.png')}/>
							</View>
							<View style={{justifyContent:'center'}}>
								<Text style={{fontSize:12}}>{view_data.item_userable.no_of_seats} {Strings.props[this.state.userLang].people}</Text>
							</View>
						</View>
					: null}
					{(view_data && view_data.item_userable && view_data.item_userable.no_small_bags) ? 
						<View style={{flexDirection:'row',marginRight:10}}>
							<View style={{justifyContent:'flex-start'}}>
								<Image style={{width:20,height:20}} source={require('@images/bag.png')}/>
							</View>
							<View style={{justifyContent:'center'}}>
								<Text style={{fontSize:12}}>{view_data.item_userable.no_small_bags} {Strings.props[this.state.userLang].smallbags}</Text>
							</View>
						</View>
					: null}
					{(view_data && view_data.item_userable && view_data.item_userable.no_large_bags ) ? 
						<View style={{flexDirection:'row',marginRight:10}}>
							<View style={{justifyContent:'flex-start'}}>
								<Image style={{width:20,height:20}} source={require('@images/luggage.png')}/>
							</View>
							<View style={{justifyContent:'center'}}>
								<Text style={{fontSize:12}}>{view_data.item_userable.no_large_bags} {Strings.props[this.state.userLang].largebags}</Text>
							</View>
						</View>
					: null}
				</View>
				<Spacer size={20}/> 
				<View style={{backgroundColor:AppColors.brand.navbar,padding:10}}>
					<Text style={styles.header,[AppStyles.boldedFontText]}>{Strings.props[this.state.userLang].activities}</Text>
				</View>
				<ListView dataSource={this.state.dataSource} renderRow={this._renderRow} />
				<Spacer size={25}/>
				{/*tabs*/}
				{(view_data.item_user_status && (view_data.item_user_status.id == 8 || view_data.item_user_status.id == 10)) ? 
					<View>
						<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
							<TouchableOpacity style={notestyle} onPress={()=>{this.setState({selected_index:0})}}>  
								<Text style={{fontSize:12,color:AppColors.brand.black}}>{Strings.props[this.state.userLang].note}</Text>
							</TouchableOpacity> 
							<TouchableOpacity style={disputestyle} onPress={()=>{this.setState({selected_index:1})}}>    
								<Text style={{fontSize:12,color:AppColors.brand.black}}>{Strings.props[this.state.userLang].dispute}</Text>
							</TouchableOpacity> 
							<TouchableOpacity style={ratingstyle} onPress={()=>{this.setState({selected_index:2})}}>    
								<Text style={{fontSize:12,color:AppColors.brand.black}}>{Strings.props[this.state.userLang].review}</Text> 
							</TouchableOpacity> 
						</View>
						<Spacer size={15}/>
					</View>
				: null}
				{(view_data.item_user_status && (view_data.item_user_status.id == 8  || view_data.item_user_status.id == 10) && this.state.selected_index == 2) ? 
					<View>
						{(view_data.is_dispute == 1) ? 
							<View style={{justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:10}}>{Strings.props[this.state.userLang].cannotreview}</Text></View>
						: 
							<View>
								<Rating imageSize={30} fractions={0} showRating={false} startingValue={0} onFinishRating={(data)=>{this.setState({rating_value:data})}}/>
								<Spacer size={10}/>
								<LblFormInput lblTxt={Strings.props[this.state.userLang].feedback} placeholderTxt={Strings.props[this.state.userLang].feedback} value={this.state.private_note_value} onChangeText={(text) => this.setState({private_note_value:text})}/>
								<Button
									small
									title={Strings.props[this.state.userLang].submit}
									backgroundColor={'#33BB76'}
									onPress={this.feedback}
									borderRadius = {50}
									fontSize={15}
									buttonStyle={{padding:14}}
									outlined
								  /> 
							  </View>
						}
					</View>
				: null}
				{(view_data.item_user_status && (view_data.item_user_status.id == 8) && this.state.selected_index == 1) ? 
					<View>
						{(view_data.is_dispute || view_data.item_user_status.id == 10) ?
							<View style={{justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:10}}>{Strings.props[this.state.userLang].disputemessage}</Text></View>
						: 
							<View>
								<ModalPicker
									  data={this.state.vehicle_disputes}
									  initValue={Strings.props[this.state.userLang].choosedisputetype}
									  option_selected_key={this.state.vehicle_dispute_type_id}
									  selectStyle={{color:AppColors.brand.btnColor}}
									  sectionTextStyle ={[AppStyles.boldedFontText]}
									  optionTextStyle ={[AppStyles.regularFontText]} 
									  cancelStyle = {{justifyContent: 'center',alignItems:'center', borderRadius:50/2,}}
									  cancelTextStyle={[AppStyles.regularFontText]}
									  overlayStyle = {{backgroundColor: 'rgba(0,0,0,0.9)'}} 
									  onChange={(option)=>{
													this.setState({vehicle_dispute_type_id:`${option.key}`,vehicle_dispute_type_lbl:`${option.label}`});
												}}> 
										<LblFormInput select_opt={1} value={this.state.vehicle_dispute_type_lbl} placeholderTxt={Strings.props[this.state.userLang].disputetype} lblTxt={Strings.props[this.state.userLang].disputetype} editable={false}/>
								</ModalPicker>
								<Spacer size={10}/>
								<LblFormInput lblTxt={Strings.props[this.state.userLang].feedback} placeholderTxt={Strings.props[this.state.userLang].feedback} value={this.state.private_note_value} onChangeText={(text) => this.setState({private_note_value:text})}/>
								<Button
									small
									title={Strings.props[this.state.userLang].submit}
									backgroundColor={'#33BB76'}
									onPress={this.dispute}
									borderRadius = {50}
									fontSize={15}
									buttonStyle={{padding:14}}
									outlined
								  /> 
							</View>
						}
					</View>
				: null}
				
				{(this.state.selected_index == 0) ? 
					<View>
						<LblFormInput lblTxt={Strings.props[this.state.userLang].privatenote} placeholderTxt={Strings.props[this.state.userLang].note} value={this.state.private_note_value} onChangeText={(text) => this.setState({private_note_value:text})}/>
						<Button
							small
							title={Strings.props[this.state.userLang].submit}
							backgroundColor={'#33BB76'}
							onPress={this.private_note}
							borderRadius = {50}
							fontSize={15}
							buttonStyle={{padding:14}}
							outlined
						  /> 
					</View>
				: null} 
			</ScrollView>
		</View>
    </View>
   );}
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps,mapDispatchToProps)(Activity);
