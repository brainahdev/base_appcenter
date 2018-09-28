/**
 * Messages
 *

 */
import React, { Component } from 'react';
import {
  View,
  Alert,
  ListView,
  ScrollView,
  StyleSheet,AsyncStorage,
  TouchableOpacity,
} from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import { SocialIcon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import Strings from '@lib/string.js'
// Consts and Libs
import { AppColors, AppStyles } from '@theme/';

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

// Example Data
const settings = [
  { title: 'Inbox', icon: 'inbox',message_type:'messages'},
  { title: 'Sent', icon: 'send',message_type:'sentmessages'},
  { title: 'Starred', icon: 'star',message_type:'starmessages'},
];

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

/* Component ==================================================================== */
class Messages extends Component {
  static componentName = 'Messages';

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
		userLang:'en',
      dataSource: ds.cloneWithRows([]),
    };
	this.setUserLanguage();
  }
  async setUserLanguage() { 
    var l = await AsyncStorage.getItem('userLang'); 
	const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
	this.setState({userLang:l,dataSource: ds.cloneWithRows([
	  { title: Strings.props[l].inbox, icon: 'inbox',message_type:'messages'},
	  { title: Strings.props[l].sent, icon: 'send',message_type:'sentmessages'},
	  { title: Strings.props[l].starred, icon: 'star',message_type:'starmessages'},
	]),});
  } 
  /**
    * Each List Item
    */
  renderRow = (data, sectionID) => (
    <ListItem
      key={`list-row-${sectionID}`}
      onPress={()=>{Actions.ListMessages({title:data.title,'message_type':data.message_type});}}
      title={data.title}
      subtitle={data.role || null}
      leftIcon={data.icon ? { name: data.icon } : null}
      avatar={data.avatar ? { uri: data.avatar } : null}
      roundAvatar={!!data.avatar}
    />
  )

  render = () => (
    <View style={styles.tabContainer}>
		  <List style={{backgroundColor:AppColors.brand.white}}>
			<ListView
			  renderRow={this.renderRow}
			  dataSource={this.state.dataSource}
			/>
		  </List>
	  </View>
  )
}

/* Export Component ==================================================================== */
export default Messages;
