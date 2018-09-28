/**
 * User Reducer
 *
 */

// Set initial state
const initialState = {};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'USER_LOGIN': {
      if (action.data) {
        const input = action.data;
        return {
          ...state,
          //uid: input.uid,
          email: input.email,
		  token:input.userToken,
          //emailVerified: input.emailVerified,
        };
      }
      return {};
    }
    case 'USER_DETAILS_UPDATE': {
      if (action.data) {
        const input = action.data;
		console.log("record ss reducer" + JSON.stringify(input));
        return {
          ...state,
          user_data: input,
        };
      }
      return {};
    }
	case 'COUNTRIES': {
	  console.log("Countries loaded " + JSON.stringify(action));
      if (action.data) {
        const input = action.data;
		console.log("record ss reducer COUNTRIES" + JSON.stringify(input));
        return {
          ...state,
          countries: input,
        };
      }
      return {};
    }
	case 'SETTINGS':
	  if (action.data) {
        const input = action.data;
		console.log("SETTINGS == "+JSON.stringify(input)); 
        return {
			...state,
			settings: input,
		  };
      }
      return {};
    case 'USER_LOGOUT': {
      return {
          ...state,
          user_data: null,
        };
    }
    default:
      return state;
  }
}
