/**
 * Tabs Scenes
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React from 'react';
import { Scene } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '@constants/';
import { AppStyles, AppSizes } from '@theme/';

// Components
import { TabIcon } from '@ui/';
import { NavbarMenuButton } from '@containers/ui/NavbarMenuButton/NavbarMenuButtonContainer';

// Scenes
import Placeholder from '@components/general/Placeholder';
import Error from '@components/general/Error';
import StyleGuide from '@containers/StyleGuideView';
import Recipes from '@containers/recipes/Browse/BrowseContainer';
import RecipeView from '@containers/recipes/RecipeView';


import Search from '@containers/search/Search';
import Listing from '@containers/search/Listing';
import Filter from '@containers/search/Filter'; 
import BookNow from '@containers/search/BookNow';

import LoginForm from '@containers/auth/Forms/LoginContainer';
import SignUpForm from '@containers/auth/Forms/SignUpContainer';
import ResetPasswordForm from '@containers/auth/Forms/ResetPasswordContainer';
import Authenticate from '@containers/auth/AuthenticateView';

const navbarPropsTabs = {
  ...AppConfig.navbarProps,
  renderLeftButton: () => <NavbarMenuButton />,
  sceneStyle: {
    paddingBottom: 0,
  },
};

/* Routes ==================================================================== */
const scenes = (
  <Scene key={'tabBar1'} pressOpacity={0.95}>
	<Scene
      {...navbarPropsTabs}
      key={'SearchHome'}
      title={'Search'} 
    >
	  <Scene
		  hideNavBar
		  key={'authLanding1'}
		  component={Authenticate}
		  analyticsDesc={'Authentication'}
		/>
      <Scene
		  navTransparent={true}
		  renderLeftButton={() => <NavbarMenuButton />}
		  navigationBarStyle={{backgroundColor:'transparent',top:0,padding:0,margin:0,borderBottomWidth:0}}
		  key={'SearchListing1'}
		  component={Search}
		/>
      <Scene
        {...AppConfig.navbarProps}
		 hideNavBar
        key={'Listing1'}
        component={Listing}
        getTitle={props => ((props.title) ? props.title : 'Listing Cars')}
      />
	  <Scene
		  {...AppConfig.navbarProps}
		  navigationBarStyle={AppStyles.navbarStyle}
		  key={'BookNow1'}
		  title={'BOOK NOW'}
		  component={BookNow}
		/>
	  <Scene
      hideNavBar
      key={'login1'}
      title={'Login'}
      clone
      component={LoginForm}
      analyticsDesc={'Login'}
    />
    <Scene
      hideNavBar
      key={'signUp1'}
      title={'Sign Up'}
      clone
      component={SignUpForm}
      analyticsDesc={'Sign Up'}
    />
    <Scene
      hideNavBar
      key={'passwordReset1'}
      title={'Password Reset'}
      clone
      component={ResetPasswordForm}
      analyticsDesc={'Password Reset'}
    />
    </Scene>
  </Scene>
);

export default scenes;
