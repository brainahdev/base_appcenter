/**
 * Auth Scenes
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React from 'react';
import { Scene, ActionConst } from 'react-native-router-flux';
// Consts and Libs
import { AppStyles, AppSizes,AppColors } from '@theme/';
import { AppConfig } from '@constants/';
import { NavbarMenuButton } from '@containers/ui/NavbarMenuButton/NavbarMenuButtonContainer';
// Scenes
import Camera from '@components/CameraView';
import Authenticate from '@containers/auth/AuthenticateView';
import Search from '@containers/search/Search';
import Listing from '@containers/search/Listing';
import BookNow from '@containers/search/BookNow';
import BookOrderPay from '@containers/search/Order';
import Filter from '@containers/search/Filter';
import LoginForm from '@containers/auth/Forms/LoginContainer';
import SignUpForm from '@containers/auth/Forms/SignUpContainer';
import EditProfile from '@containers/user/edit_profile';
import ChangePassword from '@containers/user/change_password';
import MyTransaction from '@containers/user/my_transactions';

import MyVehicle from '@containers/user/my_vehicles';
import AddVehicle from '@containers/user/add_vehicle';
import EditVehicle from '@containers/user/edit_vehicle';
import VehicleDetail from '@containers/user/vehicle_details';

import MyVehicleMaintainence from '@containers/user/my_vehicle_maintainence';
import AddVehicleMaintainence from '@containers/user/add_vehicle_maintainence';

import MoneyTransferAccount from '@containers/user/money_transfer_account';
import BecomeHost from '@containers/user/become_host';
import Booking from '@containers/booking/booking';
import Order from '@containers/booking/order';
import Calendar from '@containers/booking/calendar';
import Activity from '@containers/booking/activity';
import Review from '@containers/booking/review';

import ResetPasswordForm from '@containers/auth/Forms/ResetPasswordContainer';
import UpdateProfileForm from '@containers/auth/Forms/UpdateProfileContainer';
const navbarPropsTabs = {
  ...AppConfig.navbarProps,
  renderLeftButton: () => <NavbarMenuButton />
};
/* Routes ==================================================================== */ 
const scenes = (
  <Scene key={'authenticate'}>
    
    <Scene
	  navTransparent={true}
	  renderLeftButton={() => <NavbarMenuButton />}
	  navigationBarStyle={{backgroundColor:'transparent',top:0,padding:0,margin:0,borderBottomWidth:0}}
      key={'Search'}
      component={Search}
      type={ActionConst.RESET}
    />
	
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'VehicleDetail'}
      title={'VEHICLE DETAILS'}
      component={VehicleDetail}
    />
	
	<Scene
	  hideNavBar
      key={'authLanding'}
      component={Authenticate}
      analyticsDesc={'Authentication'}
    />
    
	<Scene
      hideNavBar
      key={'Listing'}
      component={Listing}
    />
	<Scene
      hideNavBar
      key={'Filter'}
      component={Filter}
	  onExit={'reload'}
    />
    
    <Scene
      hideNavBar
      key={'login'}
      title={'Login'}
      clone
      component={LoginForm}
      analyticsDesc={'Login'}
    />
    <Scene
      hideNavBar
      key={'signUp'}
      title={'Sign Up'}
      clone
      component={SignUpForm}
      analyticsDesc={'Sign Up'}
    />
    <Scene
      hideNavBar
      key={'passwordReset'}
      title={'Password Reset'}
      clone
      component={ResetPasswordForm}
      analyticsDesc={'Password Reset'}
    />
    <Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'EditProfile'}
      title={'EDIT PROFILE'}
      component={EditProfile}
    />
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'ChangePassword'}
      title={'CHANGE PASSWORD'}
      component={ChangePassword}
    />
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'MyTransaction'}
      title={'MY TRANSACTIONS'}
      component={MyTransaction}
    />
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'MoneyTransferAccount'}
      title={'MONEY TRANSFER ACCOUNT'}
      component={MoneyTransferAccount}
    />
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'BecomeHost'}
      title={'BECOME A HOST'}
      component={BecomeHost}
    />
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'Booking'}
      title={'BOOKINGS'}
      component={Booking}
    />
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'Order'}
      title={'ORDERS'}
      component={Order}
    />
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'BookNow'}
      title={'BOOK NOW'}
      component={BookNow}
    />
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'BookOrderPay'}
      title={'ORDER'}
      component={BookOrderPay}
    />
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'Calendar'}
      title={'BOOKING CALENDAR'}
      component={Calendar}
    />
	<Scene
      hideNavBar
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'MyVehicle'}
      title={'MY VEHICLES'}
      component={MyVehicle}
    />
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'AddVehicle'}
      title={'ADD VEHICLE'}
      component={AddVehicle}
    />
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'EditVehicle'}
      title={'EDIT VEHICLE'}
      component={EditVehicle}
    />
	
	
	
	
	<Scene
      hideNavBar
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'MyVehicleMaintainence'}
      title={'MY VEHICLE MAINTAINENCES'}
      component={MyVehicleMaintainence}
    />
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'AddVehicleMaintainence'}
      title={'ADD VEHICLE MAINTAINENCE'}
      component={AddVehicleMaintainence}
    />
	
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'Activity'}
      title={'ACTIVITIES'}
      component={Activity}
    />
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'Review'}
      title={'REVIEWS'}
      component={Review}
    />
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'Camera'}
      title={'CAMERA'}
      component={Camera}
    />
  </Scene>
);

export default scenes;
