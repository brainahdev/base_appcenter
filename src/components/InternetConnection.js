import React, { Component, PropTypes } from 'react';
import {
Alert,View,NetInfo,
} from 'react-native';
import { AppConfig} from '@constants/';
import { connect } from 'react-redux';
const mapStateToProps = () => ({
});
const mapDispatchToProps = {
}
/* Component ==================================================================== */
class InternetConnection extends Component {
	constructor() {
		super();
	}
	handleFirstConnectivityChange=(reach)=>{
		 console.log('First change: ' + reach);
		 ((reach == 'WIFI' || reach == 'cell') ?
				console.log(`First, connected with ${reach}` )
			:
				Alert.alert(
				  AppConfig.appName,
				  'No Internet Connection',
				  [
					{text: 'OK', onPress: () => console.log("ok")},
				  ],
				  { cancelable: false }
				))
	 }

	componentDidMount() {
		 NetInfo.fetch().done((reach) => {
			 console.log('Initial: ' + reach);
		 });
		 NetInfo.addEventListener(
			 'change',
			 this.handleFirstConnectivityChange
		 );
	 }
	render = () => {
		return (<View />);
	}
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps) (InternetConnection);
