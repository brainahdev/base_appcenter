import React, { Component, PropTypes } from 'react';
import { Actions } from 'react-native-router-flux';
import {
Alert,View,TouchableOpacity,Image,Text,StyleSheet,TouchableHighlight,Dimensions,StatusBar,NetInfo,AsyncStorage
} from 'react-native';
var {width, height} = Dimensions.get('window');
import { AppColors,AppStyles,AppSizes,Fonts } from '@theme/';
import { AppConfig} from '@constants/';
import * as SideMenuActions from '@containers/ui/DrawerContainer';
import * as ListMenuActions from '@redux/sidemenu/actions';
import { connect } from 'react-redux';
var styles = StyleSheet.create({
	backgroundImage: {
		width:width,
		height:120,
		backgroundColor:'white',
		flex: 1,
		resizeMode: 'cover', // or 'stretch'
	},
	members:{
		backgroundColor:AppColors.brand.primary,
		width:80,
		alignItems:'center',
		justifyContent:'center',
		bottom:30,
		borderTopLeftRadius:20,
		borderBottomLeftRadius:20
	},
	memberscard:{
		width:130,
		height:150,
		backgroundColor:'#fff',
		borderRadius: 5,
		marginLeft:5,
		marginRight:5,
		marginTop:25,
		justifyContent:'center',
		alignItems:'center'
	},
	cardview:{
		backgroundColor:'#fff',
		borderRadius: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 1,
		marginLeft:20,
		marginRight:20,
		alignItems:'center',
		justifyContent:'center'
	},
	memberbtnormal:{
		borderRadius: 20,
		borderWidth:0.5,
		borderColor:'#929292',
		width:90,
		backgroundColor:'#fff',
		justifyContent:'center',
		alignItems:'center',
		bottom:1
	},
	memberbtremove:{
		borderRadius: 20,
		borderWidth:0.5,
		borderColor:'#F75174',
		width:90,
		backgroundColor:'#F75174',
		justifyContent:'center',
		alignItems:'center',
	},
	menulistitem:{
		marginTop:5,marginBottom:5,height:30,borderBottomWidth:1,borderColor:'#D9D9D9',flexDirection:'row'
	},
	menulistfont:{
		fontSize: 16,color:AppColors.brand.primary,bottom:1,left:25
	},
	drpmenu:{
		position:'absolute',width:width/2,backgroundColor:'#fff',top:50,left:width/2,shadowColor: "#000000",        shadowOpacity: 1, shadowRadius: 5, shadowOffset: { height: 5, width: 5}
	}
});


// What data from the store shall we send to the component?
const mapStateToProps = state => ({
	listMenuOpen: state.sideMenu.listMenuOpen,
});

// Any actions to map to the component?
const mapDispatchToProps = {
	toggleSideMenu: ListMenuActions.toggle,
	closeSideMenu: ListMenuActions.close,
};


/* Component ==================================================================== */
class NavComponent extends Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		backArrow:PropTypes.bool,
		navigationImage:PropTypes.string,
		rightBarSearch:PropTypes.bool,
		rightBarDots:PropTypes.bool,
		rightBarAdd:PropTypes.bool,
		rightBarNone:PropTypes.bool,
		listMenuOpen: PropTypes.bool,
		onLeftNavPress:PropTypes.func,
		onRightNavPress:PropTypes.func,
		onsortPress:PropTypes.func,
	}
	static defaultProps = {
		title: null,
		navigationImage:null,
		backArrow: false,
		rightBarAdd:false,
		rightBarSearch:true,
		rightBarNone:false,
		rightBarDots:false,
		listMenuOpen: false,
		onLeftNavPress:null,
		onRightNavPress:null,
		onsortPress:null
	}
	constructor() {
		super();
		this.state = {
			showMenu:false,
		};
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

	onSideMenuChange = (isOpen) => {
		console.log("this.props.listMenuOpen"+this.props.listMenuOpen);
		if (isOpen !== this.props.listMenuOpen) {
		this.props.toggleSideMenu();
		}
	}
	filterPressed = () => {
		if(this.props.onRightNavPress)
			this.props.onRightNavPress();
	}
	sortPressed = () => {
		if(this.props.onsortPress)
			this.props.onsortPress();
	}
	static contextTypes = {
		drawer: PropTypes.object.isRequired,
	};

	showSideMenu=()=>{
		this.setState({
			showMenu: true,
		});
	}
	closeSideMenu=()=>{
		this.setState({
			showMenu: false,
		});
	}
	menu = () => {
		if(this.state.showmenu == 0)
			this.setState({showmenu: 1});
		else
			this.setState({showmenu: 0});
	}

	navLeftButtonPressed = () => {
		if(this.props.onLeftNavPress)
			this.props.onLeftNavPress();
		else if(this.props.backArrow){
			Actions.pop();
		}
		else
			this.context.drawer.open();
	}
	navRightButtonPressed = () => {
		if(this.props.onRightNavPress && this.props.passPropsonRightNavPress)
			this.props.onRightNavPress(this.props.passPropsonRightNavPress); 
		else if(this.props.onRightNavPress)
			this.props.onRightNavPress();
	}
	
	render = () => {
		var transparent = AppColors.brand.navbar;
		if(this.props.transparent == true)
			transparent = "rgba(0,0,0,0)";

		var backImage = this.props.backArrow ? require('../images/arrowleft.png') : require('../images/iconmenu.png');
		var rightImage = null;
		var sortrightImage = null;
		var onPressFunction;
		var onsortPressFunction;

		if (this.props.rightBarAdd) {
			rightImage = require('../images/AddNav.png')
			onPressFunction=this.navRightButtonPressed
		}else if (this.props.is_edit) {
			rightImage = require('../images/edit.png')
			onPressFunction=this.navRightButtonPressed
		}else if (this.props.is_update) {
			rightImage = require('../images/tick-icon.png')
			onPressFunction=this.navRightButtonPressed
		}else if (this.props.rightBarDots) {
			rightImage = require('../images/dot.png')
			onPressFunction=this.onSideMenuChange
		}else if(this.props.is_filter){
			rightImage = require('../images/filter.png')
			onPressFunction=this.filterPressed
		}
		if(this.props.is_sort){
			console.log("sdsfsdfsdf ssss");
			sortrightImage = require('../images/sort.png')
			onsortPressFunction=this.sortPressed;
		}
		console.log("sdsfsdfsdf " + sortrightImage);
		return (<View style={{height:44,backgroundColor:transparent,flexDirection:'row'}}>
		 		<StatusBar backgroundColor={AppColors.brand.navbar} barStyle="light-content"/>
				<View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row',marginLeft:10,marginRight:10,marginBottom:5,marginTop:5}}>
					<View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
						<TouchableOpacity style={{flex:1}} onPress={this.navLeftButtonPressed}>
						   <Image style={{height:20,width:20,backgroundColor:'transparent'}} source={backImage}></Image>
						</TouchableOpacity>
						{this.props.navigationImage ? <View style={{flex:1,alignItems:'center',justifyContent:'flex-start'}}><Image style={{height:30,width:30,borderRadius:15,backgroundColor:'transparent'}} source={{uri:this.props.navigationImage}}></Image></View> : null}
					</View>
					<View style={{flex:3,alignItems:'center',justifyContent:'center'}}>
					  <Text numberOfLines={1} style={[{color:'#000',fontSize: 16},AppStyles.regularFontText]}> {this.props.title} </Text>
					</View>
					<View style={{flex:1,alignItems:'center',justifyContent:'flex-end',flexDirection:'row'}}>
						{!this.props.rightBarNone && sortrightImage?
							<TouchableHighlight underlayColor='transparent' onPress={onsortPressFunction} style={{backgroundColor:'transparent',height:20,width:20,marginRight:15}}>
								<Image style={{height:20,width:20,backgroundColor:'transparent'}} source={sortrightImage}></Image>
							</TouchableHighlight>
						: <View style={{width:1}}/>}
						{!this.props.rightBarNone && rightImage?
							<TouchableHighlight underlayColor='transparent' onPress={onPressFunction} style={{backgroundColor:'transparent',height:20,width:20}}>
								<Image style={{height:20,width:20,backgroundColor:'transparent'}} source={rightImage}></Image>
							</TouchableHighlight>
						: <View style={{width:1}}/>}
					</View>
				</View>
            </View>);
	}
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps) (NavComponent);
