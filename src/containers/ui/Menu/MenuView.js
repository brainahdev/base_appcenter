/**
 * Menu Contents
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Alert,
  StyleSheet,Image,
  TouchableOpacity,ScrollView,
  AsyncStorage,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import * as UserActions from '@redux/user/actions';
import { connect } from 'react-redux';
import { AppConfig} from '@constants/'
import Strings from '@lib/string.js'
// Consts and Libs
import { AppStyles, AppSizes } from '@theme/';
import AppUtil from '@lib/util';
// Components
import { Spacer, Text, Button } from '@ui/';

const mapStateToProps = state =>{
console.log("fsfjjdfg==>" + JSON.stringify(state.user.user_data))
return({ user_data: state.user.user_data,sideMenuIsOpen: state.sideMenu.isOpen,})
};
// Any actions to map to the component?
const mapDispatchToProps = {

};
/* Styles ==================================================================== */
const MENU_BG_COLOR = '#000';

const styles = StyleSheet.create({
  backgroundFill: {
    backgroundColor: MENU_BG_COLOR,
    height: AppSizes.screen.height,
    width: AppSizes.screen.width,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  container: {
    position: 'relative',
	backgroundColor: MENU_BG_COLOR,
    flex: 1,
  },
  menuContainer: {
    flex: 1,
    left: 0,
    right: 0,
    backgroundColor: MENU_BG_COLOR,
  },

  // Main Menu
  menu: {
    flex: 3,
    left: 0,
    right: 0,
    backgroundColor: MENU_BG_COLOR,
    padding: 20,
    paddingTop: AppSizes.statusBarHeight,
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
});


/* Component ==================================================================== */
class Menu extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    closeSideMenu: PropTypes.func.isRequired,
    user: PropTypes.shape({
      email: PropTypes.string,
    }),
  }
  static defaultProps = {
    user: null,
  }
  defineMenu(data,lang){
	  if(data.user_data){

		this.state = {
			idx: 0, 
			userLang:'en',
			  menu:[ 
				{
				  title: Strings.props[lang].myprofile,
				  onPress: () => { this.props.closeSideMenu();Actions.EditProfile({'user_data':this.props.user_data})},
				},
				{
				  title: Strings.props[lang].settings,
				  onPress: () => { this.props.closeSideMenu();Actions.Settings()},
				},
				{
				  title: Strings.props[lang].orders,
				  onPress: () => { this.props.closeSideMenu();Actions.Order()},
				},
				{
				  title: Strings.props[lang].logout,
				  onPress: () => { 
					this.logout();  
				  },
				},
			  ],
			};
	}else{
		this.state = {
		  idx: 0, 
		  userLang:'en',
		  menu: [
			{
			  title: Strings.props[lang].login,
			  onPress: () => { this.props.closeSideMenu();Actions.authLanding()},
			},
			{
			  title: Strings.props[lang].register,
			  onPress: () => { this.props.closeSideMenu();Actions.signUp()},
			}
		  ],
		};
	}
  }
  componentWillReceiveProps(nextProps){
	  this.defineMenu(nextProps,this.state.userLang);
  }
  
   componentDidMount(){
		console.log("componentDidmount==>>>" + JSON.stringify(this.props))
  }
  constructor(props) {
    super(props);
	var userToken = AsyncStorage.getItem('userToken');
	console.log("fsdjfhjgklsgn==>>>" + JSON.stringify(this.props.closeSideMenu))
	this.postImg=AppConfig.user_image;
	this.setUserLanguage();
	this.defineMenu(this.props,'en');
  }
  async setUserLanguage() { 
    var l = await AsyncStorage.getItem('userLang'); 
	this.setState({userLang:l});
  } 
  login = () => {
    this.props.closeSideMenu();
    Actions.login();
  }
  reload=()=>{
	  if(this.props.user_data && this.props.user_data.attachment && this.props.user_data.attachment.id){
		var md5string=this.props.user_data.attachment.class+this.props.user_data.attachment.id+'pnglarge_thumb';
		var imagetemp=AppUtil.MD5(md5string);
		this.postImg = AppConfig.urls.site+'/images/large_thumb/'+this.props.user_data.attachment.class+'/'+this.props.user_data.attachment.id+'.'+imagetemp+'.png';
	  }
	  this.setState({idx:this.state.idx+1});
  }
  logout = () => {
    if (this.props.logout) {
      this.props.logout();
		AsyncStorage.removeItem('api/credentials');
		AsyncStorage.removeItem('userToken');
		AsyncStorage.removeItem('user_data');
		AsyncStorage.removeItem('user');
		this.props.closeSideMenu();
		Actions.authLanding({'logout':1});

    }
  }

  render = () => {
    const { menu } = this.state;

    // Build the actual Menu Items
    const menuItems = [];
    menu.map((item) => {
      const { title, onPress } = item;

      return menuItems.push(
        <TouchableOpacity
          key={`menu-item-${title}`}
          onPress={onPress}
        >
          <View style={[styles.menuItem]}>
            <Text style={[styles.menuItem_text,AppStyles.regularFontText]}>
              {title}
            </Text>
          </View>
        </TouchableOpacity>,
      );
    });
	
	if(this.props.user_data && this.props.user_data.attachment && this.props.user_data.attachment.id){
			var md5string=this.props.user_data.attachment.class+this.props.user_data.attachment.id+'pnglarge_thumb';
			var imagetemp=AppUtil.MD5(md5string);
			this.postImg = AppConfig.urls.site+'/images/large_thumb/'+this.props.user_data.attachment.class+'/'+this.props.user_data.attachment.id+'.'+imagetemp+'.png';

		}
		
    return (
      /*<ScrollView style={[styles.container]}>
        <View style={[styles.backgroundFill]} />
		{(this.props.user_data && this.props.user_data.attachmentable && this.props.user_data.attachmentable.thumb) ? 
			<View style={{justifyContent:'center',alignItems:'center',height:70,marginTop:10}}> 			
				{(this.postImg) ? 
					<Image style={{width:70,height:70,borderRadius:50}} source={{uri:this.postImg}} /> 
				: null} 
			</View>
		: null}*/
        <View style={[styles.menuContainer]}>
		  {(this.props.user_data && this.props.user_data.attachment && this.props.user_data.attachment.id) ? 
			<View style={{justifyContent:'center',alignItems:'center',height:70,marginTop:10}}> 			
				{(this.postImg) ? 
					<Image style={{width:70,height:70,borderRadius:50}} source={{uri:this.postImg}} /> 
				: null} 
			</View>
			: null}
          <View style={[styles.menu]}>{menuItems}</View>
        </View>
      //</ScrollView>
    );
  }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(Menu);