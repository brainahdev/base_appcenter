/**
 * Camera View
 *
 */
 'use strict';
import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,Image,ImagePickerIOS,
  TouchableOpacity,Alert,AppRegistry,Dimensions,TouchableHighlight,
} from 'react-native';
import { Icon } from 'react-native-elements';
// Consts and Libs
import { AppStyles,AppColors } from '@theme/';
import { Actions } from 'react-native-router-flux';
var ReadImageData = require('NativeModules').ReadImageData;
var ImagePicker = require('react-native-image-picker');

// Components
import { Card, Text,Spacer, Button } from '@ui/';
import Camera from 'react-native-camera';
/* Styles ==================================================================== */
const styles = StyleSheet.create({
  favourite: {
    position: 'absolute',
    top: -45,
    right: 0,
  },
  slide: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 0,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    color: '#000',
  },
  Small: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
  },
  orientation: {
    width: 32,
    height: 32,
  },
  img_vid: {
    width: 30,
    height: 30,
  },
});
const { back, front } = Camera.constants.Type;
const { still, video } = Camera.constants.CaptureMode;


/* Component ==================================================================== */
class FriendsVw extends Component {
  static propTypes = {
    post_visible_time:PropTypes.number,
    post_visible_to:PropTypes.number,
    captionMessage:PropTypes.string,
	CaptureMode:PropTypes.string,

  }
   constructor(props) {
    super(props);
    this.state = {
      cameraType: Camera.constants.Type.back,
      cameraMode: Camera.constants.CaptureMode.still,
      cammode:0,
      avatarSource: null,
      reload:false,
      videoData:null,
      img_video:require('@images/Lash972.png'),
      capture_video:require('@images/Lash131.png'),
      top_img_video:require('@images/Lash971.png'),
      image:'',
	  loading:false,
    };
  }
  componentWillUnmount=()=>{
    if(this.state.reload){
		this.setState({reload:false});
      this.props.reloadView({capturedImage:this.state.image});
    }
  }
   render() {
    return (
      <View style={styles.container}>
        <View style={{backgroundColor:'transparent',justifyContent: 'center',alignItems: 'center',height:60,width:Dimensions.get('window').width}}>
            <View style={{flex:1,flexDirection:'row',justifyContent: 'center',alignItems: 'center',}}>
                <Icon name={'close'} style={{marginLeft:20}} size={30} color={'#ccc'} onPress={Actions.pop}/>
                <View style={{flex:1,flexDirection:'row',justifyContent: 'flex-end',alignItems: 'center'}}>
                    <TouchableHighlight underlayColor="white" onPress={this.orient.bind(this)} style={{width:32,height:32,marginRight:20}}>
						{(this.state.cameraType== 1) ? <Image style={styles.orientation} source={require('@images/352452-32.png')}/> :<Image style={styles.orientation} source={require('@images/352453-32.png')}/>}
					</TouchableHighlight>
                </View>
            </View>
        </View>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          type={this.state.cameraType}
          captureMode={this.state.cameraMode}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          captureQuality={Camera.constants.CaptureQuality.medium}
          defaultOnFocusComponent={ true }
          defaultTouchToFocus
        >
          <View style={{backgroundColor:'#FFF',justifyContent: 'center',alignItems: 'center',height:70,width:Dimensions.get('window').width}}>
            <View style={{flex:1,flexDirection:'row',justifyContent: 'center',alignItems: 'center',}}>
                <TouchableHighlight underlayColor="white" onPress={this.takePicture.bind(this)} style={styles.Small,{marginLeft:20,marginRight:20}}><Image style={styles.Small} source={this.state.capture_video}/></TouchableHighlight>
            </View>
          </View>
        </Camera>
		{this.state.loading ? (<View style={AppStyles.LoaderStyle}>
					  <Loading color = {AppColors.brand.primary}/>
					  </View>)
					   : (null)}
      </View>
    );
  }

  showLashImageView(){
  //  console.log('this.state.image--->'+JSON.stringify(this.state.image));
  //  console.log('this.state.videoData--->'+JSON.stringify(this.state.videoData));]
      this.setState({reload:true})
      Actions.pop();
    }
  takePicture() {
	  if(this.state.loading==false){
		  	  this.setState({loading:true});
    var state = this.state;
   // state.cameraMode = state.cameraMode === Camera.constants.CaptureMode.still ? Camera.constants.CaptureMode.video : Camera.constants.CaptureMode.still;

    if(this.state.cameraMode == 0){
        this.camera.capture({
				jpegQuality:60,
                captureQuality: Camera.constants.CaptureQuality.low,
            })
        .then((data) => {ReadImageData.readImage(data.path, (imageBase64) => {
          if(imageBase64 == ""){
            Alert.alert('Image Error','Image unable load please take another')
          }else {
        console.log('ImageBase64'+imageBase64);
        this.setState({ image:imageBase64,loading:false});
        this.showLashImageView();
      }
        });
      })
        .catch(err => console.error(err));
    }else{
      //  Alert.alert(this.state.cameraMode+" -"+this.state.cammode+" ");
        if(this.state.cammode == 0){
            this.state.cammode=1;
            this.camera.capture({
                audio: true,
                captureMode: Camera.constants.CaptureMode.video,
            })
            .then((data) => {
              //console.log('this is the video data stop--->'+JSON.stringify(data.imageBase64));
                 this.setState({
                   image:data.imageBase64,
                   videoData: data.videoBase64,
				   loading:false
                 })
                 this.showLashImageView();
            })
            .catch((err) => console.log(err));
        }else{
            this.camera.stopCapture();
        }
    }
	  }
  }
  orient() {
    var state = this.state;
    state.cameraType = state.cameraType === Camera.constants.Type.back ? Camera.constants.Type.front : Camera.constants.Type.back;
    this.setState(state);
  }
  mode() {
    var state = this.state;
    if(this.state.cameraMode == 0){
        this.state.img_video = require('@images/Lash971.png');
        this.state.top_img_video = require('@images/Lash972.png');
        this.state.capture_video = require('@images/Lash926.png');
    }else{
        this.state.img_video = require('@images/Lash972.png');
        this.state.top_img_video = require('@images/Lash971.png');
        this.state.capture_video = require('@images/Lash131.png');
    }
    state.cameraMode = state.cameraMode === Camera.constants.CaptureMode.still ? Camera.constants.CaptureMode.video : Camera.constants.CaptureMode.still;
    this.setState(state);
  }
}

/* Export Component ==================================================================== */
export default FriendsVw;