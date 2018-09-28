/**
 * Filter used to apply filter for search
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';
import * as UserActions from '@redux/user/actions';
import { Actions } from 'react-native-router-flux';
import Listing from '@containers/search/Listing';
import Icon from 'react-native-vector-icons/Ionicons';
import FA from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import Strings from '@lib/string.js'
// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';
import { CheckBox } from 'react-native-elements'
import NavComponent from '@components/NavComponent.js'
// Components
import { Spacer, Text, Button,Card,FormInput,} from '@ui/';
// What data from the store shall we send to the component?
const mapStateToProps = state => ({

});
// Any actions to map to the component?
const mapDispatchToProps = {

};
/* Styles ==================================================================== */
const MENU_BG_COLOR = '#fff';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
  menuContainer: {
    flex: 1,
    left: 0,
    right: 0,backgroundColor:AppColors.brand.navbar
  },

  // Main Menu
  menu: {
    flex: 3,
    left: 0,
    right: 0,
    backgroundColor:AppColors.brand.navbar,
    padding: 20,
    paddingTop: AppSizes.statusBarHeight + 20,
  },
  menuItem: {
	 backgroundColor:'#df5749',
	 borderRadius:10,
   // borderBottomWidth: 1,
//borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 10,
  },
  menuItem_text: {
    fontSize: 16,
    lineHeight: parseInt(16 + (16 * 0.5), 10),
    fontWeight: '500',
    marginTop: 14,
    marginBottom: 8,
    color: '#EEEFF0',
  },

  // Menu Bottom
  menuBottom: {
    flex: 1,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  menuBottom_text: {
    color: '#EEEFF0',
  },
  RowBorder:{
    top: 2,
    borderWidth: 2
  },
  Rows: {flex:1,height:50,flexDirection:'row'},
  srows: {height:40,flexDirection:'row',alignItems:'center',justifyContent:'flex-start'},
  RowHeaderView:{paddingLeft:10,backgroundColor:'#df5749', borderRadius:5,flex:1,alignItems:'center',justifyContent:'flex-start',flexDirection:'row',marginBottom:5},
  MainTitles: {
    marginLeft: 15,
    fontSize: 17,
    color: AppColors.brand.primary,
	paddingBottom:3
  },
  subTitles:{
	marginLeft: 15,
    fontSize: 16,
    color: '#000',
	paddingBottom:3
  },
  subMenuSep:{
	  height: 1, backgroundColor: '#eee'
  }
});
var customStyles2 = StyleSheet.create({
  track: {
    height: 4,
    borderRadius: 2,
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: 'white',
    borderColor: '#30a935',
    borderWidth: 2,
  }
});

/* Component ==================================================================== */
class Search extends Component {
  static componentName = 'Search';
  constructor(props) {
    super(props);
	console.log("reloadData" + JSON.stringify(this.props.payload))
	
    this.state = {
	  userLang:'en',
	  dayprice_highest:(this.props.payload && this.props.payload.sort_by_price && this.props.payload.sortby && this.props.payload.sort_by_price == 'day' && this.props.payload.sortby == 'desc') ? true:false,
	  dayprice_lowest:(this.props.payload && this.props.payload.sort_by_price && this.props.payload.sortby && this.props.payload.sort_by_price == 'day' && this.props.payload.sortby == 'asc') ? true:false,
	  hourprice_highest:(this.props.payload && this.props.payload.sort_by_price && this.props.payload.sortby && this.props.payload.sort_by_price == 'hour' && this.props.payload.sortby == 'desc') ? true:false,
	  hourprice_lowest:(this.props.payload && this.props.payload.sort_by_price && this.props.payload.sortby && this.props.payload.sort_by_price == 'hour' && this.props.payload.sortby == 'asc') ? true:false,
	  rating_highest:(this.props.payload && this.props.payload.sort && this.props.payload.sortby && this.props.payload.sort == 'rating' && this.props.payload.sortby == 'desc') ? true:false,
	  rating_lowest:(this.props.payload && this.props.payload.sort && this.props.payload.sortby && this.props.payload.sort == 'rating' && this.props.payload.sortby == 'asc') ? true:false,
    };
	this.setUserLanguage();
  }
  async setUserLanguage() { 
    var l = await AsyncStorage.getItem('userLang'); 
	this.setState({userLang:l});
  } 
  componentWillReceiveProps(){
	      console.log("reloadData" + JSON.stringify(this.props)); 
	}
  static propTypes = {

  }
 
  static defaultProps = {
    user: null,
	callBack:null,
  }

  btn_filter = (val,srt,srtby) => {
    if(this.props.callBack){
		console.log("sdfsdfsdfsdf callback");
		this.props.callBack({'selected_filter':{"sort":srt,"sortby":srtby}});
		this.setState({
			dayprice_highest:false,
			dayprice_lowest:false,
			hourprice_highest:false,
			hourprice_lowest:false,
			rating_highest:false,
			rating_lowest:false,
		});
		if(val == 'dayprice_highest')
			this.setState({dayprice_highest:true});
		else if(val == 'dayprice_highest')
			this.setState({dayprice_lowest:true});
		else if(val == 'hourprice_highest')
			this.setState({hourprice_highest:true});
		else if(val == 'hourprice_lowest')
			this.setState({hourprice_lowest:true});
		else if(val == 'rating_highest')
			this.setState({rating_highest:true});
		else if(val == 'rating_lowest')
			this.setState({rating_lowest:true});
	}
  }
  render = () => {
	  
	return(
	<View style={[styles.container]}>
	  {/*<NavComponent backArrow={true} title={Strings.props[this.state.userLang].searchfilter} />*/}
      <View style={[styles.menuContainer]}>
        <View style={[styles.menu]}>
			<View style={{padding:20,backgroundColor:'#df5749',paddingTop:0,paddingBottom:0,borderRadius:5,height:35,justifyContent:'center'}}>
				<Text style={{fontFamily:'OpenSans',fontSize:15,color:'#fff',lineHeight:22}}>{Strings.props[this.state.userLang].dayprice}</Text>
			</View>
			<View style={{padding:20,paddingTop:10,paddingBottom:10,flexDirection:'row'}}>
				<CheckBox
					onPress={this.btn_filter.bind(this,'dayprice_highest','day','desc')}
					  center
					  title={Strings.props[this.state.userLang].highestprice}
					  checkedIcon='dot-circle-o'
					  uncheckedIcon='circle-o'
					  checked={this.state.dayprice_highest}
					  containerStyle={{padding:0,margin:0,backgroundColor:'transparent'}}
					  textStyle={{fontFamily:'OpenSans',fontWeight:'normal',fontSize:14,color:'#000'}}
					/>
			</View>
			<View style={{padding:20,paddingTop:0,paddingBottom:10,flexDirection:'row'}}>
				<CheckBox
					onPress={this.btn_filter.bind(this,'dayprice_lowest','day','asc')} 
					  center
					  title={Strings.props[this.state.userLang].lowestprice}
					  checkedIcon='dot-circle-o'
					  uncheckedIcon='circle-o'
					  checked={this.state.dayprice_lowest}
					  containerStyle={{padding:0,margin:0,backgroundColor:'transparent'}}
					  textStyle={{fontFamily:'OpenSans',fontWeight:'normal',fontSize:14,color:'#000'}}
					/>
			</View>
			
			
			<View style={{padding:20,backgroundColor:'#df5749',paddingTop:0,paddingBottom:0,borderRadius:5,height:35,justifyContent:'center'}}>
				<Text style={{fontFamily:'OpenSans',fontSize:15,color:'#fff',lineHeight:22}}>{Strings.props[this.state.userLang].hourprice}</Text>
			</View>
			<View style={{padding:20,paddingTop:10,paddingBottom:10,flexDirection:'row'}}>
				<CheckBox
					onPress={this.btn_filter.bind(this,'hourprice_lowest','hour','desc')} 
					  center
					  title={Strings.props[this.state.userLang].highestprice}
					  checkedIcon='dot-circle-o'
					  uncheckedIcon='circle-o'
					  checked={this.state.hourprice_highest}
					  containerStyle={{padding:0,margin:0,backgroundColor:'transparent'}}
					  textStyle={{fontFamily:'OpenSans',fontWeight:'normal',fontSize:14,color:'#000'}}
					/>
			</View>
			<View  style={{padding:20,paddingTop:0,paddingBottom:10,flexDirection:'row'}}>
				<CheckBox
					onPress={this.btn_filter.bind(this,'hourprice_lowest','hour','asc')}
					  center
					  title={Strings.props[this.state.userLang].lowestprice}
					  checkedIcon='dot-circle-o'
					  uncheckedIcon='circle-o'
					  checked={this.state.hourprice_lowest}
					  containerStyle={{padding:0,margin:0,backgroundColor:'transparent'}}
					  textStyle={{fontFamily:'OpenSans',fontWeight:'normal',fontSize:14,color:'#000'}}
					/>
			</View>
			
			
			<View style={{padding:20,backgroundColor:'#df5749',paddingTop:0,paddingBottom:0,borderRadius:5,height:35,justifyContent:'center'}}>
				<Text style={{fontFamily:'OpenSans',fontSize:15,color:'#fff',lineHeight:22}}>{Strings.props[this.state.userLang].rating}</Text>
			</View>
			<View  style={{padding:20,paddingTop:10,paddingBottom:10,flexDirection:'row'}}>
				<CheckBox
					onPress={this.btn_filter.bind(this,'rating_highest','rating','desc')}
					  center
					  title={Strings.props[this.state.userLang].higherrating}
					  checkedIcon='dot-circle-o'
					  uncheckedIcon='circle-o'
					  checked={this.state.rating_highest}
					  containerStyle={{padding:0,margin:0,backgroundColor:'transparent'}}
					  textStyle={{fontFamily:'OpenSans',fontWeight:'normal',fontSize:14,color:'#000'}}
					/>
			</View>
			<View style={{padding:20,paddingTop:0,paddingBottom:10,flexDirection:'row'}}>
				<CheckBox
					onPress={this.btn_filter.bind(this,'rating_lowest','rating','asc')} 
					  center
					  title={Strings.props[this.state.userLang].lowerrating}
					  checkedIcon='dot-circle-o'
					  uncheckedIcon='circle-o'
					  checked={this.state.rating_lowest}
					  containerStyle={{padding:0,margin:0,backgroundColor:'transparent'}}
					  textStyle={{fontFamily:'OpenSans',fontWeight:'normal',fontSize:14,color:'#000'}}
					/>
			</View>
			<Spacer size={20}/>
			<View style={{justifyContent:'center',alignItems:'center'}}>
				<Button
					title={Strings.props[this.state.userLang].clear}
					backgroundColor={'#33BB76'}
					onPress={this.btn_filter.bind(this,'','','')} 
					borderRadius = {50}
					fontSize={15}
					buttonStyle={{padding:5,paddingLeft:40,paddingRight:40,}}
					outlined
				  />
			</View>
			<Spacer size={20}/>
		</View> 
      </View>
    </View>
  )}
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(Search);