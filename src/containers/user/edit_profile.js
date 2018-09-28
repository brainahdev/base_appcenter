/**
 * Edit profile Screen
 *
 * 
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,Alert,ScrollView,
  TouchableOpacity,
  AsyncStorage,
  ListView,
  Platform,
  Keyboard,
} from 'react-native';
import Loading from '@components/general/Loading';
import * as UserActions from '@redux/user/actions';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { AppConfig} from '@constants/';
import AppUtil from '@lib/util';
import Strings from '@lib/string.js'
import NavComponent from '@components/NavComponent.js'
// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';
import { CheckBox } from 'react-native-elements'
// Components
import { Spacer, Text, Button,Card,FormInput,LblFormInput} from '@ui/';
const Permissions = require('react-native-permissions').default;
var ImagePicker = require('react-native-image-picker');
import ModalPicker from 'react-native-modal-picker';
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
var options_postImg = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
/* Component ==================================================================== */
const mapStateToProps = state =>{
	return({ countries: state.user.countries})
};
const mapDispatchToProps = {
  update_user: UserActions.update_user,
  auth:UserActions.auth,
};
class EditProfile extends Component {
  static componentName = 'EditProfile';
  static propTypes = {
	update_user: PropTypes.func.isRequired,
	auth:PropTypes.func.isRequired,
  }
  constructor(props) { 
	super(props); 
	this.userdata = '';
	this.state={ 
		userLang:'en',
		user_id:this.props.user_data.id,
		firstname:(this.props.user_data)?this.props.user_data.first_name:'',
		lastname:(this.props.user_data)?this.props.user_data.last_name:'',
		city:(this.props.user_data.city)?this.props.user_data.city.name:'',
		state:(this.props.user_data.state)?this.props.user_data.state.name:'',
		phone:'',
		country:(this.props.user_data.country)?this.props.user_data.country.iso2:'',
		textInputValue:(this.props.user_data.country)?this.props.user_data.country.name:'',
		scrollSpacer:50,
		photopermission:"",
		camerapermission:"",
		storagepermission:"",
		postImg:AppConfig.user_image,
		postImgData:"",
		loading:false,
		countries:this.props.countries,
		gender_male:(this.props.user_data && this.props.user_data.gender_id == 1)?true:false,
		gender_female:(this.props.user_data && this.props.user_data.gender_id == 2)?true:false,
	}
	this.userdata = '';
	this.userId = '';
	this.setUserLanguage();
	console.log("propsuserdata " + JSON.stringify(this.props.user_data));
  }
  async setUserLanguage() { 
    var l = await AsyncStorage.getItem('userLang'); 
	this.setState({userLang:l});
  } 
  async _refreshuserData () { 
    this.userdata = await AsyncStorage.getItem('userToken');
	console.log("logged =============" + this.userdata);
  } 
  async _refreshuserId () { 
	this.userId = await AsyncStorage.getItem('userId'); 
	console.log("logged =============" + this.userId);
  } 
  componentDidMount=()=> {
	  this._refreshuserData();
	  this._refreshuserId();
	  var phonecode = '';
	  if(this.props.user_data.country){
		  phonecode = this.props.user_data.country.phone+"-";
	  }
	  if(this.props.user_data.mobile)
		  this.setState({"phone":phonecode+this.props.user_data.mobile});
	  this.checkCameraAndLibraryPermissions();
	  if(this.props.user_data.attachment && this.props.user_data.attachment.id){
			var md5string=this.props.user_data.attachment.class+this.props.user_data.attachment.id+'pnglarge_thumb';
			var imagetemp=AppUtil.MD5(md5string);
			var imageurl = AppConfig.urls.site+'/images/large_thumb/'+this.props.user_data.attachment.class+'/'+this.props.user_data.attachment.id+'.'+imagetemp+'.png';
			this.setState({postImg:imageurl})
		}
  }
  checkCameraAndLibraryPermissions=()=>{
	  Permissions.checkMultiple(['camera', 'photo','storage'])
			  .then(response => {
				//response is an object mapping type to permission
				  if(response.photo == "authorized"){
					 this.setState({ photopermission: "1" })
				  }
				  if(response.camera == "authorized"){
					 this.setState({ camerapermission: "1" })
				  }
				  if(response.storage == "authorized"){
					 this.setState({ storagepermission: "1" })
				  }
				
		});
	}
  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }
  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
	if(this.props.reload)
		this.props.reload();
  }

  _keyboardDidShow () {
	this.setState({scrollSpacer:200});
  }

  _keyboardDidHide () {
	  this.setState({scrollSpacer:50});
  }
  ValidURL=(str)=>{
	  var pattern = new RegExp("^http(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?$");
        
	  if(!pattern.test(str)) {
		return false;
	  } else {
		return true;
	  }
	}
  editprofile=()=>{
	  console.log("postImgData" + JSON.stringify(this.state.postImgData)); 
	  var phonenumber = this.state.phone;
	  phonenumber = phonenumber.split("-").pop();
	  if(this.state.firstname == '')
	  {
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].firstname,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if(this.state.lastname == '')
	  {
		  Alert.alert(
			  AppConfig.appName,
			  Strings.props[this.state.userLang].lastname,
			  [
			  {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			);
	  }
	  else if (!AppUtil.validateMobile(phonenumber)) {
		  Alert.alert(AppConfig.appName,
				 Strings.props[this.state.userLang].entervalidphonenumber,
				 [
				 {text: 'Ok', onPress: ()=> console.log("error==>")},
				 ],{ cancelable: false}
			  )
	  }
	  else{
			this.setState({loading:true});
			
			var profileData = new Object;
			profileData['user_id'] = this.state.user_id;
			profileData['first_name'] = this.state.firstname;
			profileData['last_name'] = this.state.lastname;
			if(this.state.country)
				profileData['country'] = {"iso2":this.state.country}
			if(this.state.city)
				profileData['city'] = {"name":this.state.city};
			if(this.state.state)
				profileData['state'] = {"name":this.state.state};
			if(this.state.postImgData && this.state.postImgData.data)
				profileData['image_data'] = this.state.postImgData.data;
			if(this.state.phone)
				profileData['phone'] = phonenumber;
			if(this.state.gender_male == true)
				profileData['gender_id'] = 1;
			if(this.state.gender_female == true)
				profileData['gender_id'] = 2;
			
			this.props.update_user(profileData).then((res) => {
                if(res.data && res.data.id){
					if(this.userdata && this.userId){
						this.props.auth({"token":this.userdata,"userId":this.userId})
						.then(() => {
							Actions.pop();
						})
						.catch(() => {
								console.log("logged err=============");
						});
					}else{
						  console.log("logged============= eee");
					}
				}
                this.setState({loading:false});
            }).catch((err) => {
				console.log('propsuserdata err ==>'+JSON.stringify(err));
                this.setState({loading:false});
            });
	  }
  }
  pickerImagePressed=(imgtype)=> {
		if(this.state.photopermission === "" || this.state.camerapermission === "")
		{
            Permissions.request('photo')
              .then(response => {
              //returns once the user has chosen to 'allow' or to 'not allow' access
              //response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
              if(response == "authorized"){
                this.setState({ photopermission: "1"})
               }
              });
			Permissions.request('camera')
			  .then(response => {
				//returns once the user has chosen to 'allow' or to 'not allow' access
				//response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
				if(response == "authorized"){
					 this.setState({camerapermission: "1" })
				  }
			  });
			
		}else{
			if(imgtype == 'postImg')
				options = options_postImg;
			ImagePicker.showImagePicker(options, (response) => {
					 console.log("postImage==" + JSON.stringify(response));
					  if (response.didCancel) {

					  }
					  else if (response.error) {
							 var alermessage=response.error;
							  if(alermessage === '1' && Platform.OS !== 'ios'){
								  Actions.Camera({reloadView:this.getCatpturedImage.bind(this,imgtype)});
							  }else{
								Alert.alert(
								  AppConfig.appName,
								  response.error,
								  [
									  {text: 'OK', onPress: () => 
										console.log('OK Pressed')
									  },
								  ],
								  { cancelable: false }
								);
							  }
					  }
					  else {
						if(imgtype == 'postImg'){
							this.setState({postImgData:response,postImg: "data:image/png;base64,"+response.data});
						}
					  }
					});
		}
		
    }
  getCatpturedImage=(imgtype,image)=>{
		console.log("postImage == imgtype" + imgtype)
		if(image.capturedImage){
			if(imgtype == 'postImg'){
				this.setState({postImgData:image,postImg: "data:image/png;base64,"+image.capturedImage});
			}
		}
	}
  gender=(val)=>{
	  if(val == 1)
		this.setState({gender_male:true,gender_female:false});
	  else if(val == 2)
		this.setState({gender_male:false,gender_female:true});
  }
  render = () => 
    {
		var carray = this.state.countries;
		var vmcountry_data = [{ key: 0, section: true, label: 'Select Country' }];
		var country_isoo = [];
		Object.keys(carray).forEach(function(key) {
			var lbl = carray[key].name;
			vmcountry_data.push({key:carray[key].id,label:lbl});
		});
	return(
    <View style={[AppStyles.container, styles.background],{justifyContent:'center',alignItems:'center'}}>
		<ScrollView style={{margin:10}} showsVerticalScrollIndicator={false}>
			<TouchableOpacity onPress={this.pickerImagePressed.bind(this, 'postImg')} style={{height:70,justifyContent:'center',alignItems:'center'}}>
				<Image style={{width:70,height:70,borderRadius:50,borderWidth:0.5,borderColor:'#000'}} source={{uri:this.state.postImg}} />
			</TouchableOpacity>
			<View style={{height:30}}>
				<Text style={{color: AppColors.brand.black, fontSize: 16,textAlign:'left'},[AppStyles.boldedFontText]}>{Strings.props[this.state.userLang].personalinfo}</Text>
			</View>
			<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
				<LblFormInput placeholderTxt={Strings.props[this.state.userLang].firstname} lblTxt={Strings.props[this.state.userLang].enteryourfirstname} value={this.state.firstname} onChangeText={(text) => this.setState({firstname:text})}/>
			</View>
			<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
				<LblFormInput placeholderTxt={Strings.props[this.state.userLang].lastname} lblTxt={Strings.props[this.state.userLang].enteryourlastname} value={this.state.lastname} onChangeText={(text) => this.setState({lastname:text})}/>
			</View>
			<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent',flexDirection:'row',marginBottom:5,marginTop:5}}>
				<Text style={AppStyles.regularFontText,{color: AppColors.brand.txtinputcolor}}>{Strings.props[this.state.userLang].chooseyourgender}</Text>
			</View>
			<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent',flexDirection:'row',marginBottom:15,marginTop:10}}>
				<CheckBox
				  center
				  title={Strings.props[this.state.userLang].male}
				  checkedIcon='dot-circle-o'
				  uncheckedIcon='circle-o'
				  containerStyle={{padding:0,margin:0,backgroundColor:"transparent"}}
				  textStyle={[AppStyles.regularFontText,{color: AppColors.brand.txtinputcolor}]}
				  checked={this.state.gender_male}
				  onPress={this.gender.bind(this,1)}
				/>
				<View style={{width:15}}/>
				<CheckBox
				  center
				  title={Strings.props[this.state.userLang].female}
				  checkedIcon='dot-circle-o'
				  uncheckedIcon='circle-o'
				  containerStyle={{padding:0,margin:0,backgroundColor:"transparent"}}
				  textStyle={[AppStyles.regularFontText,{color: AppColors.brand.txtinputcolor}]}
				  checked={this.state.gender_female}
				  onPress={this.gender.bind(this,2)}
				/>
			</View>
			<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
				<ModalPicker
				  data={vmcountry_data}
				  initValue={Strings.props[this.state.userLang].choosecountry}
				  sectionTextStyle ={{textAlign: 'left',color: AppColors.brand.primary,fontSize: 16,fontWeight:'bold',fontFamily:'SourceSansPro-Regular'}}
				  optionTextStyle ={{textAlign: 'left',color: '#000',fontSize: 16,fontWeight:'normal',fontFamily:'SourceSansPro-Regular'}}
				  cancelStyle = {{backgroundColor:'#F75174', justifyContent: 'center',alignItems:'center', borderRadius:50/2,}}
				  cancelTextStyle={{fontSize: 20,fontWeight:'normal',fontFamily:'SourceSansPro-Regular'}}
				  overlayStyle = {{backgroundColor: 'rgba(0,0,0,0.9)'}}
				  onChange={(option)=>{
						this.setState({textInputValue:option.label,country_id:`${option.key}`,CountryText:`${option.label}`});
						var ii = option.key;
						var pickedObject = carray.filter((item)=>item['id'] === ii);
						pickedObject = pickedObject[0];
						console.log('pickedObject==>'+JSON.stringify(pickedObject));//
						this.setState({country:pickedObject['iso2'],phone:pickedObject['phone']+"-"});
					}}>
					<View style={styles.containerBottom11}>
						<LblFormInput placeholderTxt={Strings.props[this.state.userLang].choosecountry} lblTxt={Strings.props[this.state.userLang].choosecountry} editable={false} value={this.state.textInputValue} />
					</View>
				</ModalPicker>
			</View>
			<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
				<LblFormInput placeholderTxt={Strings.props[this.state.userLang].state} lblTxt={Strings.props[this.state.userLang].enterstate} value={this.state.state} onChangeText={(text) => this.setState({state:text})}/>
			</View>
			<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
				<LblFormInput placeholderTxt={Strings.props[this.state.userLang].city} lblTxt={Strings.props[this.state.userLang].entercity} value={this.state.city} onChangeText={(text) => this.setState({city:text})}/>
			</View>
			<View style={{width:AppSizes.screen.width-50,backgroundColor:'transparent'}}>
				<LblFormInput placeholderTxt={Strings.props[this.state.userLang].phone} lblTxt={Strings.props[this.state.userLang].phone} value={this.state.phone} onChangeText={(text) => this.setState({phone:text})}/>
			</View>
			<View style={{height:20}} />
			<Button
				title={Strings.props[this.state.userLang].submit}
				backgroundColor={AppColors.brand.btnColor}
				textStyle={{color:'#FFFFFF'}}
				onPress={this.editprofile}
				borderRadius = {50}
				fontSize={15}
				buttonStyle={{padding:14}}
				outlined
			  />
			<Spacer size={this.state.scrollSpacer}/>
		</ScrollView>
		{this.state.loading?<View style={AppStyles.LoaderStyle}><Loading color = {AppColors.brand.primary}/></View>:(null)}
    </View>
   );}
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps,mapDispatchToProps)(EditProfile); 

