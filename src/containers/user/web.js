/**
 * WebView
 *
 * 
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,Alert,ScrollView,Linking,WebView,
  TouchableOpacity,AsyncStorage,
  ListView,Keyboard,Platform,
} from 'react-native';
import * as UserActions from '@redux/user/actions';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { AppConfig} from '@constants/';

import Strings from '@lib/string.js'
import NavComponent from '@components/NavComponent.js'
// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';
import { CheckBox } from 'react-native-elements'
// Components
import { Spacer, Text, Button,Card,FormInput,LblFormInput} from '@ui/';
var WebViewAndroid = require('react-native-webview-android');
const mapStateToProps = state =>{return({ user_data: state.user.user_data})};
const mapDispatchToProps = {

};
/* Styles ====================================================================  */
var styles = StyleSheet.create({
  containerWebView: {
    flex: 1,
  }
});
/* Component ==================================================================== */
class Web extends Component {
  static componentName = 'Web';
  constructor(props) {
        super(props);
		this.userToken= '';
		this.screen = '';
		this.loaded = 0;
        this.state = {
            urll: this.props.pay_url,
            cookie: '',
            isreload: false,userLang:'en',
        };
		this.setUserLanguage();
  }
  async setUserLanguage() { 
    var l = await AsyncStorage.getItem('userLang'); 
	this.setState({userLang:l});
  }
    componentWillMount = () => {
		var access_token = '';
		AsyncStorage.multiGet(['userToken'], (err, stores) => {
            stores.map((result, i, store) => {
                let key = store[i][0];
                let val = store[i][1];
                if (key == 'userToken') {
                    access_token = val;
                }
                if (access_token != '') {
                    var cookie = 'document.cookie=\'auth=' + JSON.stringify(this.props.user_data) + '; token=' + access_token + '\'';
					cookie = 'if(typeof(Storage) !== "undefined") { localStorage.userRole="";localStorage.userToken="";localStorage.userRole = '+this.props.user_data.role_id+';localStorage.userToken="'+access_token+'"}'; 
					console.log('cookie===>' + cookie); 
                    this.setState({
                        cookie: cookie,
                    });
                }
            });
        });

    }
    _onNavigationStateChange = (res) => {  
		console.log("_onNavigationStateChange " + res.url);
		var res_url = res.url;
		if(res_url.includes("wallets/success")){
			this.screen = 'wallets/success';
			this.webview.stopLoading();
			if(this.loaded == 0){
				this.loaded = 1; 
				Alert.alert(
				  AppConfig.appName,
				  Strings.props[this.state.userLang].walletsuccess,
				  [
					  {text: 'OK', onPress: () => {
							Actions.pop();
						}
					  },
				  ],
				  { cancelable: false }
				);
			}
		}else if(res_url.includes("vehicle/success")){
			this.screen = 'vehicles/success';
			this.webview.stopLoading();
			if(this.loaded == 0){
				this.loaded = 1; 
				Alert.alert(
				  AppConfig.appName,
				  Strings.props[this.state.userLang].vehiclessuccess,
				  [
					  {text: 'OK', onPress: () => {
							Actions.pop();
						}
					  },
				  ],
				  { cancelable: false }
				);
			}
		}
		else if(res_url.includes("vehicle_rental/status/success")){
			this.screen = 'vehicle_rental/status/success';
			this.webview.stopLoading();
			if(this.loaded == 0){
				this.loaded = 1; 
				Alert.alert(
				  AppConfig.appName,
				  Strings.props[this.state.userLang].ordersuccess,
				  [
					  {text: 'OK', onPress: () => {
							console.log("00000000"+ JSON.stringify(res_url));
							Actions.Search();
						}
					  },
				  ],
				  { cancelable: false }
				);
			}
		}
		else if(res_url.includes("wallets/cancel") || res_url.includes("vehicle/fail") || res_url.includes("vehicle_rental/status/fail")){
			this.webview.stopLoading();
			if(this.loaded == 0){
				this.loaded = 1; 
				Alert.alert(
				  AppConfig.appName,
				  Strings.props[this.state.userLang].cancelmessage,
				  [
					  {text: 'OK', onPress: () => {
							Actions.app({ type: 'reset' });
						}
					  },
				  ],
				  { cancelable: false }
				);
			}
		}
       // if (res.loading == false) {
          //  console.log('_onNavigationStateChange--->' + JSON.stringify(res));
       //}
    }

	componentWillUnmount(){
		if(this.props.reload)
			this.props.reload(this.screen);
	}

    render() {
        return (
            <View style={{ flex: 1 }}>
                <WebView
                    url={this.state.urll}
                    javaScriptEnabled={true}
					onShouldStartLoadWithRequest={this._onNavigationStateChange}
                    onNavigationStateChange={this._onNavigationStateChange}
                    injectedJavaScript={this.state.cookie}
					ref={(ref) => { this.webview = ref; }}
					startInLoadingState={true}
                />
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps,mapDispatchToProps)(Web); 