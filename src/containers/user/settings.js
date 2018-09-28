/**
 * Settings
 *

 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Alert,
  ListView,
  ScrollView,
  Image,
  StyleSheet,AsyncStorage,
  TouchableOpacity,
} from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import { SocialIcon } from 'react-native-elements';
import Loading from '@components/general/Loading';
import * as UserActions from '@redux/user/actions';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { AppConfig} from '@constants/';
// Consts and Libs
import Strings from '@lib/string.js'
import { AppColors, AppStyles } from '@theme/';
const mapStateToProps = state =>{return({ user_data: state.user.user_data})};
const mapDispatchToProps = {

};
// Components
import {
  Alerts,
  Button,
  Card,
  Spacer,
  Text,
  List,
  ListItem,
  FormInput,
  FormLabel,
} from '@components/ui/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  // Tab Styles
  tabContainer: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: AppColors.brand.primary,
  },
  tabbarIndicator: {
    backgroundColor: AppColors.brand.white,
  },
  tabbar_text: {
    color: AppColors.brand.white,
  },
});
// Example Data
/*var settings = [
  { title: Strings.props[this.state.userLang].changepassword, icon: 'unlock-alt',scene:0},
  { title: Strings.props[this.state.userLang].mytransactions, icon: 'list-alt',scene:1},
  { title: Strings.props[this.state.userLang].moneytransferaccount, icon: 'exchange',scene:2},
  { title: Strings.props[this.state.userLang].wallet, icon: 'money',scene:3},
  { title: Strings.props[this.state.userLang].withdrawrequests, icon: 'credit-card',scene:4},
  { title: Strings.props[this.state.userLang].messages, icon: 'envelope',scene:5},
];*/
/* Component ==================================================================== */
class Settings extends Component {
  static componentName = 'Settings';

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows([]),
	  loading:false,userLang:'en',
    };
	this.setUserLanguage();
  }
  async setUserLanguage() { 
    var l = await AsyncStorage.getItem('userLang'); 
	const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
	this.setState({userLang:l,dataSource: ds.cloneWithRows([
			  { title: Strings.props[this.state.userLang].changepassword, icon: 'unlock-alt',scene:0},
			  { title: Strings.props[this.state.userLang].mytransactions, icon: 'list-alt',scene:1},
			  { title: Strings.props[this.state.userLang].moneytransferaccount, icon: 'exchange',scene:2},
			  { title: Strings.props[this.state.userLang].wallet, icon: 'money',scene:3},
			  { title: Strings.props[this.state.userLang].withdrawrequests, icon: 'credit-card',scene:4},
			  { title: Strings.props[this.state.userLang].messages, icon: 'envelope',scene:5}
			])});
  }
  /**
    * Each List Item
    */
  renderRow = (data, sectionID) => (
    <ListItem
      key={`list-row-${sectionID}`}
      onPress={()=>{
		  if(data.scene == 0)
			Actions.ChangePassword();
		  else if(data.scene == 1)
			  Actions.MyTransaction();
		  else if(data.scene == 2)
			  Actions.MoneyTransferAccount();
		  else if(data.scene == 3)
			  Actions.Wallet();
		  else if(data.scene == 4)
			  Actions.Withdraw();
		  else if(data.scene == 5)
			  Actions.Messages();
	  }}
      title={data.title}
      subtitle={data.role || null}
      leftIcon={data.icon ? { name: data.icon,type:'font-awesome' } : null}
      avatar={data.avatar ? { uri: data.avatar } : null}
      roundAvatar={!!data.avatar}
    />
  )

  render = () => (
    <View style={styles.tabContainer}>
		<View style={{justifyContent:'center',alignItems:'center',margin:10}}>
			{/*<Image style={{width:65,height:65,borderRadius:50}} source={{uri:this.props.user_data.attachmentable.thumb.largemedium}}/>*/}
			<Text>{this.props.user_data.username.toUpperCase()}</Text>
		</View>
		  <List style={{backgroundColor:AppColors.brand.white}}>
			<ListView
			  renderRow={this.renderRow}
			  dataSource={this.state.dataSource}
			/>
		  </List>
		  {this.state.loading?<View style={AppStyles.LoaderStyle}><Loading color = {AppColors.brand.primary}/></View>:(null)}
	  </View>
  )
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps,mapDispatchToProps)(Settings); 