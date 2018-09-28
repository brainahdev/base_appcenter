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
import Language from '@containers/search/Language';
import Listing from '@containers/search/Listing';
import BookNow from '@containers/search/BookNow';
import BookOrderPay from '@containers/search/Order';
import Filter from '@containers/search/Filter';
import Sort from '@containers/search/Sort';
import LoginForm from '@containers/auth/Forms/LoginContainer';
import SignUpForm from '@containers/auth/Forms/SignUpContainer';
import EditProfile from '@containers/user/edit_profile';
import ChangePassword from '@containers/user/change_password';
import MyTransaction from '@containers/user/my_transactions';
import Wallet from '@containers/user/wallet';
import Withdraw from '@containers/user/withdraw';
import Messages from '@containers/user/messages';
import ListMessages from '@containers/user/list_messages';
import ViewMessage from '@containers/user/view_messages';
import Settings from '@containers/user/settings';
import Web from '@containers/user/web';
import PayListing from '@containers/user/pay_listing';

import MoneyTransferAccount from '@containers/user/money_transfer_account';
import Booking from '@containers/booking/booking';
import Order from '@containers/booking/order';
import OrderActivity from '@containers/booking/order_activity';
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
      key={'Sort'}
      component={Sort}
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
      key={'Wallet'}
      title={'MY WALLET'}
      component={Wallet}
    />
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'Withdraw'}
      title={'WITHDRAW REQUESTS'}
      component={Withdraw}
    />
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'Messages'}
      title={'MY MESSAGES'}
      component={Messages}
    />
	<Scene
	  hideNavBar
      key={'ListMessages'}
      title={'INBOX'}
      component={ListMessages}
    />
	<Scene
	  {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'Settings'}
      title={'SETTINGS'}
      component={Settings}
    />
	
	<Scene
	  hideNavBar
      key={'ViewMessage'}
      title={'View Message'}
      component={ViewMessage}
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
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'Web'}
      title={'PAYMENT'}
      component={Web}
    />
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'PayListing'}
      title={'PAY'}
      component={PayListing}
    />
	<Scene
      {...AppConfig.navbarProps}
	  navigationBarStyle={AppStyles.navbarStyle}
      key={'OrderActivity'}
      title={'ACTIVITY'}
      component={OrderActivity}
    />
	
  </Scene>
);

export default scenes;
