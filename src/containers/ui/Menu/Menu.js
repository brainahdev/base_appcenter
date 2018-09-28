import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as UserActions from '@redux/user/actions';
import {
	ScrollView,
	View,
	TextInput,
	ListView,
	TouchableOpacity,AsyncStorage,
	StyleSheet,
	Dimensions,
	SegmentedControlIOS,
	Image,
	Switch,
	Text
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { AppStyles,AppSizes,AppColors} from '@theme/';
var ChatSDK = require('NativeModules').ChatSDK;
var DiscoverModule = require('NativeModules').Discovery;
const MenuItem = ({ menuTitle,menuIcon,menuPress}) => (
	<View style={{marginLeft:20,marginRight:20}}>
		<TouchableOpacity onPress={menuPress}>
			<View style = {styles.MenuView}>
				<Image style={styles.MenuIcon} source={menuIcon}/>
				<Text style = {styles.MenuTitle}>
					{menuTitle}
				</Text>
			</View>
		</TouchableOpacity>
		<View style={styles.WhiteLine}/>
	</View>
);
// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  user: state.user,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  updateMyLocation: UserActions.updateMyLocation,
};
class NearBySocialCluster extends Component {
	static propTypes = {
		logout: PropTypes.func.isRequired,
		closeSideMenu: PropTypes.func.isRequired,
		updateMyLocation: PropTypes.func.isRequired,
	}

	constructor() {
		super();
		this.state = {
			menu: [
				{
					title: 'About & Help',
					onPress: () => { this.props.closeSideMenu();;Actions.about({type: 'reset'})},
					icon:require('../../../images/Help.png'),
				},
			],
			userLang:'en',
		};
		this.setUserLanguage();
	}
	async setUserLanguage() { 
		var l = await AsyncStorage.getItem('userLang'); 
		this.setState({userLang:l});
	} 
	back = () => {
		this.props.closeSideMenu();
	}
	logout = () => {
		if (this.props.logout) {
		  AsyncStorage.getItem("user/id").then((value) => 
			{
				this.props.updateMyLocation(value,{
					"current_location": '',
					"current_latitude": '',
					"current_longitude": '',
					"current_geohash": '',
					"lock_type": '',
					"is_discoverable":0
				}).then((res) => {
					console.log("tttt"+JSON.stringify(res));
					this.props.logout().then(() => {
						DiscoverModule.stopService((data) => {
							//console.log("stop service"+ data);
						});
						//Logout Matrix sessions
						AsyncStorage.clear();
						ChatSDK.LogOut((data) => {});
						this.props.closeSideMenu();
						Actions.splash({toLogin:true,type: 'reset'});	
					}).catch(() => {
					  console.log('Oh uh! logout==> went wrong.');
					});
				}).catch((err) => {
					console.log("Fetcher location-profile error  ==>"+err.error.message);
				});
			});
		  
		}
	}
   render = () => {
		 const { menu } = this.state;

     // Build the actual Menu Items
     const menuItems = [];
     menu.map((item) => {
       const { title,icon, onPress } = item;
       return menuItems.push(<MenuItem key={`menu-item-${title}`} menuTitle={title} menuPress={onPress} menuIcon={icon}/>);
     });

     return (
			 <View style={{flex:1,backgroundColor: 'transparent'}}>
					 <View style={{flex:1,backgroundColor: '#9a71fc'}}>
							 <View style = {styles.CloseView}>
								 <TouchableOpacity onPress={()=>this.back()} style={{top:20,left:20, width: 40, height:40}}>
								 <Image
									 style={{width: 40, height: 40}}
									 source={require('../../../images/close.png')}
								 />
								 </TouchableOpacity>
								 <TouchableOpacity onPress={()=>this.logout()} style={{alignItems:'center',justifyContent:'flex-end',top:0,left:0,width: 60, height: 60,marginRight:10}}>
								 <Image
									 style={{width: 40, height: 40}}
									 source={require('../../../images/Exit.png')}
								 />
								 </TouchableOpacity>
							 </View>
							 <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
									 <View style = {styles.MainView}>{menuItems}</View>
									 <View style={{height:100}}/>
					 		</ScrollView>
					 </View>
			 </View>
     );
   }
 }
 var styles = StyleSheet.create({
	topView: {
		flexDirection: 'row',
		justifyContent : 'space-between',
		backgroundColor: '#6C49DB',
		height:100,
		top:20
	},
	CircularImage: {
		borderRadius: 50,
		width: 100,
		height: 100,
		borderWidth:3,
		borderColor:'white'
	},
	ImageViewContents: {
		top:-30,
		flexDirection: 'column',
		alignItems : 'center',
		justifyContent : 'center',
	},
	Rows:{
		flexDirection: 'row',
		justifyContent : 'space-between',
		alignItems : 'center',
		height:60,
		backgroundColor:'#F7F5FD'
	},
	RowBorder:{
		top:2,
		borderColor:'white',
		borderWidth:2
	},
	MainTitles:{
		left:30,
		fontSize:16,
		color:'#512CC3',
		fontWeight: 'bold'
	},
	SubTitles:{
		left:30,
		fontSize:12,
		color:'black'
	},
	Arrow:{
		left:-20,
		width: 30,
		height: 30
	},
	//Menu Screen Styles:
	MainView:{
		flexDirection: 'column',
		backgroundColor: '#9a71fc',
	},
	CloseView:{
		flexDirection: 'row',
		justifyContent : 'space-between',
		backgroundColor: '#9a71fc',
		height:70
	},
	MenuView:{
	  flexDirection: 'row',
	   height:50,
	},
	MenuIcon:{
		top:3,
		width: 45,
		height: 45
	},
	MenuTitle:{
		top:15,
		left:20,
		height:30,
		fontSize:16,
		color:'white',
		fontFamily:'SourceSansPro-Regular',
	},
	WhiteLine:{
		height:0.5,
		backgroundColor:'#a47ffb',
	},
 });
export default connect(mapStateToProps, mapDispatchToProps)(NearBySocialCluster);

