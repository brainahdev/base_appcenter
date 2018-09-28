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
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import * as UserActions from '@redux/user/actions';
import { connect } from 'react-redux';

// Consts and Libs
import { AppStyles, AppSizes } from '@theme/';
import Strings from '@lib/string.js'
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
};

/* Component ==================================================================== */
class Language extends Component {
  static componentName = 'Language';

  static propTypes = {

  }

  constructor() {
    super();
  }
  componentDidMount = () => {
    
  }
  setLang=(lang)=>{
	  AsyncStorage.setItem('userLang', lang); 
	  Actions.Search({ type: 'reset' });
  }
  render = () => (
    <View style={[AppStyles.container]}>
      <Image
        source={require('../../images/launch.jpg')}
        style={[styles.launchImage, AppStyles.containerCentered]}
      >
		<View style={{justifyContent:'center',alignItems:'center',marginTop:230}}>
			<Text style={{fontFamily:'OpenSans',fontSize:17}}>{Strings.selectyourlanguage}</Text>
			<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',paddingTop:10,paddingBottom:10}}>
				<TouchableOpacity onPress={this.setLang.bind(this,'en')} style={{width:50,height:50,borderRadius:50,borderWidth:1,borderColor:'#000',justifyContent:'center',alignItems:'center'}}>
					<Text style={{fontFamily:'OpenSans',fontSize:12}}>en</Text>
				</TouchableOpacity>
				<View style={{width:20}}/>
				<TouchableOpacity onPress={this.setLang.bind(this,'ar')} style={{width:50,height:50,borderRadius:50,borderWidth:1,borderColor:'#000',justifyContent:'center',alignItems:'center'}}>
					<Text style={{fontFamily:'OpenSans',fontSize:12}}>ar</Text>
				</TouchableOpacity>
			</View>
		</View>
      </Image>
    </View>
  );
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(Language);