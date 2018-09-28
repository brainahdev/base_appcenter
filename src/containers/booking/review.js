/**
 * Reviews Screen
 *
 * Lists the reviews
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
import { Actions } from 'react-native-router-flux';
import * as UserActions from '@redux/user/actions';
import { connect } from 'react-redux';
import { AppConfig} from '@constants/';

import Strings from '@lib/string.js'
import NavComponent from '@components/NavComponent.js'
// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';
import { Rating } from 'react-native-elements';
// Components
import { Spacer, Text, Button,Card,FormInput,} from '@ui/';

// Any actions to map to the component?
const mapStateToProps = () => ({
});
const mapDispatchToProps = {
  reviews: UserActions.reviews,
};

/* Styles ====================================================================  */
const styles = StyleSheet.create({
  background: {
    backgroundColor: AppColors.brand.navbar,
    height: AppSizes.screen.height,
    width: AppSizes.screen.width,
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
  }
});

/* Component ==================================================================== */
class Reviews extends Component {
  static componentName = 'Reviews';
  static propTypes = {
	reviews: PropTypes.func.isRequired,
  }
  constructor(props) { 
		super(props); 
		this.callInvoked=0;
		this.state = { dataList:[],nodata:0,page:1,userLang:'en',dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2,
			  }),}; 
		//get the search lists
		this.setUserLanguage();
  }
  async setUserLanguage() { 
    var l = await AsyncStorage.getItem('userLang'); 
	this.setState({userLang:l});
  } 
  componentDidMount(){
	this.freview();
  }
  freview(){
	if(this.callInvoked == 0){
		var payload = {"page":this.state.page,"vehicle_id":this.props.vehicle_id};
		this.callInvoked=1;
		this.props.reviews(payload).then((resp) => {
			var datares=this.state.dataList.concat(resp.data);
			var cpage = this.state.page + 1;
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
  _renderRow=(data)=>{ 
     var imageurl=AppConfig.user_image;
     if(data.user.attachmentable && data.user.attachmentable.thumb){
		 imageurl = data.user.attachmentable.thumb.medium;
	 }
	
     return (
		<View style={{flex:1,flexDirection:'row',margin:10,marginBottom:0,borderBottomWidth:1,borderColor:AppColors.brand.black,padding:10,borderRadius:15,backgroundColor:AppColors.brand.primary}}> 
			<View style={{flex:0.25}}>
				<Image style={{width:65,height:65,borderRadius:10}} source={{uri:imageurl}} />
			</View>
			<View style={{flex:0.75}}>
				<Text style={styles.header,[AppStyles.boldFontText]}>{data.user.username}</Text>
				<Rating
				  showRating={false}
				  type="star"
				  fractions={1}
				  startingValue={data.rating}
				  readonly
				  imageSize={22}
				/>
				<View style={{flexWrap:'wrap'}}>
					<Text style={styles.normalText11}>{data.feedback}</Text>
				</View>
			</View>
		</View>  

         );
   }
   onEndReached=()=>{
	this.freview();
  }
  render = () => 
  {
	  var loadstyle = [AppStyles.container, styles.background];
	  if(this.props.loaded_from == 'vehicle_details'){
		  loadstyle='';
	  }
  return(
    <View style={loadstyle}> 
	{(this.state.nodata == 0) ? 
		<View>
			{(this.state.dataList && this.state.dataList.length > 0) ?
				<ListView dataSource={this.state.dataSource} renderRow={this._renderRow} onEndReached={this.onEndReached}/>
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
export default connect(mapStateToProps,mapDispatchToProps)(Reviews);
