/**
 * SignUp Screen
 *
 * 
 */
import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,Alert,
  TouchableOpacity,
  ListView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Strings from '@lib/string.js'
import NavComponent from '@components/NavComponent.js'
// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';
import { CheckBox } from 'react-native-elements'
// Components
import { Spacer, Text, Button,Card,FormInput,} from '@ui/';

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
});

/* Component ==================================================================== */
class Terms extends Component {
  static componentName = 'Terms';
  constructor() { super(); }

  render = () => (
    <View style={[AppStyles.container, styles.background]}>
		<NavComponent backArrow={true} title={"TERMS & CONDITIONS"} />
		<Card>
				<View style={{margin:10,height:AppSizes.screen.height-250}}>
					<Text>
						Terms & Conditions
					</Text>
				</View>

		</Card>
    </View>
  )
}

/* Export Component ==================================================================== */
export default Terms;
