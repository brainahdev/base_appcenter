/**
 * App Theme - Colors
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */

const app = {
  background: '#EDEDED',
  cardBackground: '#EDEDED',
  listItemBackground: '#FFFFFF',
};

const brand = {
  brand: {
    primary: '#333399',
    secondary: '#FFFFFF',
	grey:'',
	cardbg: '#EEE',
	navbar: '#ededed',
	black:'#000',
	txtinputcolor:'#938d8d',
	txtplaceholder:'#938d8d',
	btnColor:'#333399',
	white:'#fff',
  },
};
const social_login_bg = {
  social_login_bg: {
    google_login: '#DC503B',
    facebook_login: '#425796',
  },
};
const text = {
  textPrimary: '#222222',
  textSecondary: '#777777',
  headingPrimary: brand.brand.primary,
  headingSecondary: brand.brand.primary,
};

const borders = {
  border: '#D0D1D5',
};

const tabbar = {
  tabbar: {
    background: '#ffffff',
    iconDefault: '#BABDC2',
    iconSelected: brand.brand.primary,
  },
};

export default {
  ...app,
  ...brand,
  ...text,
  ...borders,
  ...tabbar,
  ...social_login_bg,
};
