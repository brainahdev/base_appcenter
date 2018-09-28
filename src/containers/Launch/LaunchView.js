/**
 * Launch Screen
 *  - Shows a nice loading screen whilst:
 *    - Preloading any specified app content
 *    - Checking if user is logged in, and redirects from there
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Alert,
  StatusBar,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import * as UserActions from '@redux/user/actions';
import { connect } from 'react-redux';

// Consts and Libs
import { AppStyles, AppSizes } from '@theme/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  launchImage: {
    width: AppSizes.screen.width,
    height: AppSizes.screen.height,
  },
});

// What data from the store shall we send to the component?
const mapStateToProps = () => ({
});

// Any actions to map to the component?
const mapDispatchToProps = {
  settings: UserActions.settings,
  countries: UserActions.countries,
  auth:UserActions.auth,
};

/* Component ==================================================================== */
class AppLaunch extends Component {
  static componentName = 'AppLaunch';

  static propTypes = {
    login: PropTypes.func.isRequired,
	settings: PropTypes.func.isRequired,
	countries: PropTypes.func.isRequired,
	auth:PropTypes.func.isRequired,
  }

  constructor() {
    super();
	this.userdata = '';
	this.userId = '';
	AsyncStorage.setItem('userLang', 'en');
    console.ignoredYellowBox = ['Setting a timer'];
  }
  async _refreshuserData () { 
    this.userdata = await AsyncStorage.getItem('userToken');
	console.log("logged =============" + this.userdata);
  } 
  async _refreshuserId () { 
	this.userId = await AsyncStorage.getItem('userId'); 
	console.log("logged =============" + this.userId);
  } 
  componentDidMount = () => {
    // Show status bar on app launch
    StatusBar.setHidden(false, true);
	// Preload content here
    Promise.all([
		this.props.countries(),
		this._refreshuserData(),
		this._refreshuserId()
    ]).then(() => {
      // Once we've preloaded basic content,
      // - Try to authenticate based on existing token
	  console.log("logged =============" + this.userId + " = "+ this.userdata);
	  if(this.userdata && this.userId){
		  this.props.auth({"token":this.userdata,"userId":this.userId})
			// Logged in, show index screen
		.then(() => {
				console.log("loggedc=============");
				Actions.app({ type: 'reset' });
			})
			// Not Logged in, show Login screen
		.catch(() => {
				console.log("logged err=============");
				Actions.app({ type: 'reset' });
			});
	  }else{
		  console.log("logged============= eee");
		  Actions.app({ type: 'reset' });
	  }
    }).catch(err => Alert.alert(err.message));
  }

  render = () => (
    <View style={[AppStyles.container]}>
      <Image
        source={require('../../images/launch.jpg')}
        style={[styles.launchImage, AppStyles.containerCentered]}
      >
        <ActivityIndicator
          animating
          size={'large'}
          color={'#C1C5C8'}
        />
      </Image>
    </View>
  );
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(AppLaunch);