/**
 * Tabs Scenes
 *
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
import menu from '@containers/ui/Menu/Menu';
import AuthScenes from './auth';

/* Routes ==================================================================== */
const scenes = (
  <Scene key={'menuControls'}>
      {/* General */}
      {AuthScenes}
  </Scene>
);

export default scenes;
