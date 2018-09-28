/**
 * List Messages
 *
 * Lists the messages
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

// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';
import NavComponent from '@components/NavComponent.js'
// Components
import { Spacer, Text, Button,Card,FormInput,} from '@ui/';
const striptags = require('striptags');
const mapStateToProps = () => ({
});
const mapDispatchToProps = {
  messages: UserActions.messages,
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
class ListMessages extends Component {
  static componentName = 'ListMessages';
  static propTypes = {
	messages: PropTypes.func.isRequired,
  }
  constructor(props) { 
		super(props); 
		this.callInvoked=0;
		this.state = { 
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2,
			  }),
			page:1,
			userLang:'en',
			dataList:[],
			nodata:0,
			refresh:0,
		}; 
		this.setUserLanguage();
  }
  async setUserLanguage() { 
    var l = await AsyncStorage.getItem('userLang'); 
	this.setState({userLang:l});
  } 
  componentDidMount(){
	this.get_messages(1);
  }
  get_messages(p){
	if(this.callInvoked == 0){
		var page = (p)?p:this.state.page;
		payload = {"page":page,"type":this.props.message_type}; 
		this.callInvoked=1;
		this.props.messages(payload).then((resp) => {
			console.log("messages " + JSON.stringify(resp)); 
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
	this.get_messages(0);
  }
  reload=()=>{
	  this.setState({page:1,dataList:[],nodata:0,});
	  this.get_messages(0);
  }
  starred=(data)=>{
		payload = {"id":data.id,"stared":data.is_starred,"type":'put'}; 
		this.callInvoked=1;
		this.props.messages(payload).then((resp) => {
			if(resp.Success){
				this.callInvoked=0;
				this.setState({refresh:this.state.refresh + 1,dataList:[]},this.get_messages(1));
			}
		}).catch(() => {
			console.log("error");
		});
  }
  _renderRow=(data)=>{
     return (
		<View style={{width: AppSizes.screen.width-10,flexDirection:'row',margin:5,borderBottomWidth:0.5,borderColor:AppColors.brand.secondary,paddingBottom:5}}>
			<TouchableOpacity style={{flex:0.1,alignItems:'center',marginTop:5}} onPress={this.starred.bind(this,data)}>
				{(data.is_starred)?<Image style={{width:20,height:20}} source={require('@images/start_selected.png')}/> : <Image style={{width:20,height:20}} source={require('@images/star.png')}/> }
			</TouchableOpacity>
			<TouchableOpacity style={{flexDirection:'row',flex:0.9}} onPress={()=>{Actions.ViewMessage({'title':data.message_content.subject,'view_data':data.message_content.message,'reload':this.reload})}}> 
				<View style={{flex:0.2}}>
					<Text style={{fontSize:8,paddingTop:5},[AppStyles.lightFontText]}>{data.created_at}</Text>
				</View>
				<View style={{flex:0.2,alignItems:'center'}}> 
					<Text >{data.from_user.username}</Text>
				</View>
				<View style={{flex:0.5,alignItems:'center'}}>
					<Text >{data.message_content.subject}</Text> 
				</View>
			</TouchableOpacity>
		</View>  

         );
   }
  render = () => 
    {
		console.log("refresh " + this.state.refresh); 
    return(
    <View style={[AppStyles.container, styles.background]}>
		<NavComponent backArrow={true} title={this.props.title}/>
		{(this.state.nodata == 0) ? 
			<View style={{padding:0,margin:0,height:AppSizes.screen.height-70}}>
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
export default connect(mapStateToProps,mapDispatchToProps)(ListMessages);
