/**
 * Search Screen
 */
import Autocomplete from 'react-native-autocomplete-input';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,AsyncStorage,
  TouchableOpacity,
} from 'react-native';
import * as UserActions from '@redux/user/actions';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { AppConfig} from '@constants/';
import InternetConnection from '@components/InternetConnection.js'
var moment = require('moment');
import Strings from '@lib/string.js'
// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';
// Components
import { Spacer, Text, Button,Card,FormInput,} from '@ui/';

const mapStateToProps = (state) => {
  return {
	user_data: state.user.user_data,
  }
};

// Any actions to map to the component?
const mapDispatchToProps = {

};
/* Styles ==================================================================== */
const styles = StyleSheet.create({
  icon72: {
    height: 72,
    width: 72,
	backgroundColor:'transparent',
  },
});
/* Component ==================================================================== */
class Search extends Component {
  static componentName = 'Search';
  constructor(props) {
    super(props);

	this.state = {
	  userLang:'en',
    };
  }
  async setUserLanguage() { 
    var l = await AsyncStorage.getItem('userLang'); 
	this.setState({userLang:l});
  } 

  componentWillMount () {
	this.setUserLanguage();
  }
  
  render = () => 
    {
	return(
    <View style={[AppStyles.containerCentered, AppStyles.container]}>
		<InternetConnection />
		<Image source={require('@images/launch.jpg')} style={{flex:1,resizeMode: 'cover',justifyContent:'center',alignItems:'center'}}>
			<TouchableOpacity style={styles.icon72,{borderRadius:10}}>
				<Image source={require('@images/jockey.png')} style={styles.icon72}/>
			</TouchableOpacity> 
		</Image>
    </View>
  );
  }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(Search);
