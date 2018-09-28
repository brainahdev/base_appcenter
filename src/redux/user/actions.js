/**
 * User Actions
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import { AsyncStorage } from 'react-native';
import { ErrorMessages, Firebase, FirebaseRef } from '@constants/';
import * as RecipeActions from '../recipes/actions';
import { AppConfig} from '@constants/';

/**
  * Get Login Credentials from AsyncStorage
  */
async function getCredentialsFromStorage() {
  const values = await AsyncStorage.getItem('api/credentials');
  const jsonValues = JSON.parse(values);

  // Return credentials from storage, or an empty object
  if (jsonValues.email || jsonValues.password) return jsonValues;
  return {};
}

async function getTokenFromStorage() {
  const values = await AsyncStorage.getItem('userToken');
  // Return credentials from storage, or an empty object
  if (values) return values;
  return {};
}

/**
  * Save Login Credentials to AsyncStorage
  */
async function saveCredentialsToStorage(email = '', password = '') {
  await AsyncStorage.setItem('api/credentials', JSON.stringify({ email, password }));
}

/**
  * Remove Login Credentials from AsyncStorage
  */
async function removeCredentialsFromStorage() {
  await AsyncStorage.removeItem('api/credentials');
}

/**
  * Get this User's Details
  */
function getUserData(dispatch) {
  if (Firebase === null) {
    return () => new Promise((resolve, reject) =>
      reject({ message: ErrorMessages.invalidFirebase }));
  }

  const UID = Firebase.auth().currentUser.uid;
  if (!UID) return false;

  const ref = FirebaseRef.child(`users/${UID}`);

  return ref.on('value', (snapshot) => {
    const userData = snapshot.val() || [];

    return dispatch({
      type: 'USER_DETAILS_UPDATE',
      data: userData,
    });
  });
}

/**
  * Login to Firebase with Email/Password
  */
export function login(formData = {}, verifyEmail = false) {
  if (Firebase === null) {
    return () => new Promise((resolve, reject) =>
      reject({ message: ErrorMessages.invalidFirebase }));
  }

  // Reassign variables for eslint ;)
  let email = formData.Email || '';
  let password = formData.Password || '';

  return async (dispatch) => {
    // When no credentials passed in, check AsyncStorage for existing details
    if (!email || !password) {
      const credsFromStorage = await getCredentialsFromStorage();
      if (!email) email = credsFromStorage.email;
      if (!password) password = credsFromStorage.password;
    }

    // Update Login Creds in AsyncStorage
    if (email && password) saveCredentialsToStorage(email, password);

    // We're ready - let's try logging them in
    return Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        if (res && res.uid) {
          // Update last logged in data
          FirebaseRef.child(`users/${res.uid}`).update({
            lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP,
          });

          // Send verification Email - usually used on first login
          if (verifyEmail) {
            Firebase.auth().currentUser
              .sendEmailVerification()
              .catch(() => console.log('Verification email failed to send'));
          }

          // Get Favourites
          RecipeActions.getFavourites(dispatch);

          // Get User Data
          getUserData(dispatch);
        }

        // Send to Redux
        return dispatch({
          type: 'USER_LOGIN',
          data: res,
        });
      }).catch((err) => { throw err; });
  };
}

/**
  * Sign Up to Firebase
  */
export function signUp(formData = {}) {
  if (Firebase === null) {
    return () => new Promise((resolve, reject) =>
      reject({ message: ErrorMessages.invalidFirebase }));
  }

  const email = formData.Email || '';
  const password = formData.Password || '';
  const firstName = formData.FirstName || '';
  const lastName = formData.LastName || '';

  return () => Firebase.auth()
    .createUserWithEmailAndPassword(email, password)
    .then((res) => {
      // Setup/Send Details to Firebase database
      if (res && res.uid) {
        FirebaseRef.child(`users/${res.uid}`).set({
          firstName,
          lastName,
          signedUp: Firebase.database.ServerValue.TIMESTAMP,
          lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP,
        });
      }
    });
}

/**
  * Reset Password
  */
export function resetPassword(formData = {}) {
  if (Firebase === null) {
    return () => new Promise((resolve, reject) =>
      reject({ message: ErrorMessages.invalidFirebase }));
  }

  const email = formData.Email || '';
  return () => Firebase.auth().sendPasswordResetEmail(email);
}

/**
  * Update Profile
  */
export function updateProfile(formData = {}) {
  if (Firebase === null) {
    return () => new Promise((resolve, reject) =>
      reject({ message: ErrorMessages.invalidFirebase }));
  }

  const UID = Firebase.auth().currentUser.uid;
  if (!UID) return false;

  const email = formData.Email || '';
  const firstName = formData.FirstName || '';
  const lastName = formData.LastName || '';

  // Set the email against user account
  return () => Firebase.auth().currentUser
    .updateEmail(email)
      .then(() => {
        // Then update user in DB
        FirebaseRef.child(`users/${UID}`).update({
          firstName, lastName,
        });
      });
}

/**
  * Logout
  */
export function logout() {
  return {
    type: 'USER_LOGOUT',
  };
}

//settings
export function settings() {
   return async (dispatch) => {
	   try {
		   const response = await fetch(AppConfig.urls.site+AppConfig.endpoints.settings,
				'GET',{'Accept': 'application/json','Content-Type': 'application/json',},''
		   );
		   const responseJson = await response.json();
		   return dispatch({
			  type: 'SETTINGS',
			  data: responseJson,
		   });
	   } catch(error){
			console.log(error);
	   }
   }
}

//forgot password
export function forgot_password(payload) {
   return async (dispatch) => {
	   try {
		   const response = await fetch(AppConfig.urls.site+AppConfig.endpoints.forgot_password, {
			  method: 'POST',
			  headers: AppConfig.headers,
			  body: JSON.stringify(payload),
			});
		   const responseJson = await response.json();
		   console.log("record ss" + JSON.stringify(AppConfig.urls.site+AppConfig.endpoints.forgot_password));
		   console.log("record ss" + JSON.stringify(payload));
		   console.log("record ss" + JSON.stringify(responseJson));
		   return responseJson;
	   } catch(error){
			console.log(error);
	   }
   }
   
}
//signup
export function signup(payload) {
   return async (dispatch) => {
	   try {
		   console.log("record ss payload" + AppConfig.urls.site+AppConfig.endpoints.register + JSON.stringify(payload));
		   const response = await fetch(AppConfig.urls.site+AppConfig.endpoints.register, {
			  method: 'POST',
			  headers: AppConfig.headers,
			  body: JSON.stringify(payload),
			});
		   const responseJson = await response.json();
		   console.log("record ss" + JSON.stringify(responseJson));
		   return responseJson;
	   } catch(error){
			console.log(error);
	   }
   }
   
}
//login
export function userlogin(payload) {
   return async (dispatch) => {
	   try {
			console.log("record ss" + AppConfig.urls.site+AppConfig.endpoints.login);
			const response = await fetch(AppConfig.urls.site+AppConfig.endpoints.login, {
			  method: 'POST',
			  headers: AppConfig.headers,
			  body: JSON.stringify(payload),
			});
			console.log("record ss" + JSON.stringify(payload));
		   const responseJson = await response.json();
		   console.log("record ss" + JSON.stringify(responseJson));
		   return responseJson;
	   } catch(error){
			console.log(error);
	   }
   }
   
}
//social login
export function social_login(payload) {
   return async (dispatch) => {
	   try {
		   var url = AppConfig.urls.site+AppConfig.endpoints.social_logins;
		   if(payload.provider)
			   url = url + '/' + payload.provider;
		   
		   const response = await fetch(url, {
			  method: 'POST',
			  headers: AppConfig.headers,
			  body: JSON.stringify(payload),
			});
		   const responseJson = await response.json();
		   console.log("dddd record payload" + url + JSON.stringify(payload));
		   console.log("dddd record payload res" + url + JSON.stringify(responseJson));
		   return responseJson;
	   } catch(error){
			console.log(error);
	   }
   }
   
}
//twitter register
export function twitter_register(payload) {
   return async (dispatch) => {
	   try {
		   console.log(JSON.stringify(AppConfig.urls.site+AppConfig.endpoints.twitter_register));
		   var url = AppConfig.urls.site+AppConfig.endpoints.twitter_register;
		   const response = await fetch(url, {
			  method: 'POST',
			  headers: AppConfig.headers,
			  body: JSON.stringify(payload),
			});
		   const responseJson = await response.json();
		   return responseJson;
	   } catch(error){
			console.log(error);
	   }
   }
   
}

//linkedin register
export function linkedin_get(access_token) {
	console.log("access_token= " + access_token);
   return async (dispatch) => {
	   try {
		   var url = 'https://api.linkedin.com/v1/people/~:(first-name,last-name,email-address)?format=json';
		   const response = await fetch(url, {
			  method: 'GET',
			  headers: {
				'Authorization': 'Bearer ' + access_token,
				'Content-Type': 'application/json'				
			  },
			});
		   const responseJson = await response.json();
		   return responseJson;
	   } catch(error){
			console.log(error);
	   }
   }
   
}

//auth
export function auth(payload) {
   return async (dispatch) => {
	   try {
		   var header = AppConfig.headers;
		   header['Authorization']='Bearer '+payload.token;
		   
		   const response = await fetch(AppConfig.urls.site+AppConfig.endpoints.users+"/"+payload.userId+'?filter={"include":{"0":"country","1":"state","2":"city","3":"attachment"}}', {
			  method: 'GET',
			  headers: header,
			}); 
		   var responseJson = await response.json();
		   console.log("dddd record payload" + AppConfig.urls.site+AppConfig.endpoints.auth);
		   console.log("dddd record payload" + JSON.stringify(responseJson));
		   console.log("dddd record header" + JSON.stringify(header));
		   responseJson['userToken'] = payload;
		   //return responseJson;
		   return dispatch({
			  type: 'USER_DETAILS_UPDATE',
			  data: responseJson.data,
		   });
	   } catch(error){
			console.log(error);
	   }
   }
   
}

//user put
export function update_user(payload) {
   return async (dispatch) => {
	   try {
			const credsFromStorage = await getTokenFromStorage();
			var header = AppConfig.headers;
		   
			if(credsFromStorage)
				header['Authorization']='Bearer '+credsFromStorage;

			header['Content-Type']='application/json,multipart/form-data;';
			
			console.log("record ss responseJson" + JSON.stringify(AppConfig.urls.site+AppConfig.endpoints.users+"/"+payload.user_id));
			
			const response = await fetch(AppConfig.urls.site+AppConfig.endpoints.users+"/"+payload.user_id,{
			  method: 'PUT',
			  headers: header,
			  body: JSON.stringify(payload),
			});
			const responseJson = await response.json();
			console.log("record ss responseJson" + JSON.stringify(responseJson));
			return responseJson;
	   } catch(error){
			console.log(error);
	   }
   }
   
}

//user profile
export function user_profile(payload) {
   return async (dispatch) => {
	   try {
		   const credsFromStorage = await getTokenFromStorage();
		   var header = AppConfig.headers;
		   
		   	console.log("record ss payload" + AppConfig.urls.site+AppConfig.endpoints.user_profiles + JSON.stringify(payload));
		   if(credsFromStorage)
			 header['Authorization']='Bearer '+credsFromStorage;
		 
		   header['Content-Type']='application/json,multipart/form-data;';
		   console.log("record ss header" + JSON.stringify(header));
		   const response = await fetch(AppConfig.urls.site+AppConfig.endpoints.user_profiles,{
			  method: 'POST',
			  headers: header,
			  body: JSON.stringify(payload),
			});
		   const responseJson = await response.json();
			console.log("record ss responseJson" + JSON.stringify(responseJson));
		   return responseJson;
	   } catch(error){
			console.log(error);
	   }
   }
   
}

//change_password
export function change_password(payload,user_id) {
   return async (dispatch) => {
	   try {
		   const credsFromStorage = await getTokenFromStorage();
		   var header = AppConfig.headers;
		   if(credsFromStorage)
			 header['Authorization']='Bearer '+credsFromStorage;
		   
		   //check get or post based on payload param
		   var url = AppConfig.urls.site+AppConfig.endpoints.users+'/'+user_id+'/change_password';
		   console.log("respppp url" + JSON.stringify(url));
		   console.log("respppp payload" + JSON.stringify(payload));
		   var type = 'PUT';
		   const response = await fetch(url, {
			  method: type,
			  headers: header,
			  body: JSON.stringify(payload),
			});
		   const responseJson = await response.json(); 
		   console.log("respppp responseJson" + JSON.stringify(responseJson)); 
		   return responseJson;
	   } catch(error){
			console.log(error);
	   }
   }
   
}

//transactions
export function transactions(payload) {
   return async (dispatch) => {
	   try {
		   const credsFromStorage = await getTokenFromStorage();
		   var header = AppConfig.headers;
		   if(credsFromStorage)
			 header['Authorization']='Bearer '+credsFromStorage;
		   
		   //check get or post based on payload param
		   var url = AppConfig.urls.site+AppConfig.endpoints.transactions+'?filter='+payload.filter+'&page='+payload.page;
		   console.log("respppp responseJson" + JSON.stringify(url));
		   var type = 'GET';
		   const response = await fetch(url, {
			  method: type,
			  headers: header,
			  body: null,
			});
		   const responseJson = await response.json(); 
		   console.log("respppp responseJson" + JSON.stringify(responseJson));
		   return responseJson;
	   } catch(error){
			console.log(error);
	   }
   }
   
}
//bookings
export function bookings(payload) {
   return async (dispatch) => {
	   try {
		   const credsFromStorage = await getTokenFromStorage();
		   var header = AppConfig.headers;
		   if(credsFromStorage)
			 header['Authorization']='Bearer '+credsFromStorage;
		   
		   //check get or post based on payload param
		   var url = AppConfig.urls.site+AppConfig.endpoints.vehicle_rentals+'?item_user_status_id='+payload.filter+'&page='+payload.page;
		   var type = 'GET';
		   var body_content = null
		   if(payload.filter == 'all')
			   url = AppConfig.urls.site+AppConfig.endpoints.vehicle_rentals+'?page='+payload.page;
		   if(payload.call_from == 'calendar')
			   url = AppConfig.urls.site+AppConfig.endpoints.vehicle_rentals+'?limit=all';
		   else if(payload.call_from == 'booknow'){
			   url = AppConfig.urls.site+AppConfig.endpoints.vehicle_rentals;
			   type = 'POST'; 
			   body_content = JSON.stringify(payload);
		   }
		   else if(payload.call_from == 'order'){
			   url = AppConfig.urls.site+AppConfig.endpoints.vehicle_rentals+'/'+payload.id;
			   type = 'PUT'; 
			   body_content = JSON.stringify(payload);
		   }
		   else if(payload.call_from == 'activity'){
			   url = AppConfig.urls.site+AppConfig.endpoints.vehicle_rentals+'/'+payload.booking_id;
			   type = 'GET'; 
		   }
		   else if(payload.call_from == 'orderpaylisting'){
			   url = AppConfig.urls.site+AppConfig.endpoints.vehicle_rentals+'/'+payload.vehicle_rental_id+'/paynow';
			   type = 'POST'; 
			   body_content = JSON.stringify(payload); 
		   }
		   else if(payload.call_from == 'activity_status_update'){
			   if(payload.type == 'checkout'){
					type = 'POST'; 
					body_content = JSON.stringify(payload); 
			   }
			   url = AppConfig.urls.site+AppConfig.endpoints.vehicle_rentals+'/'+payload.id+'/'+payload.type;
		   }
		   console.log("respppp responseJson" + JSON.stringify(url));
		   console.log("respppp responseJson" + JSON.stringify(body_content));		   
		   const response = await fetch(url, {
			  method: type,
			  headers: header,
			  body: body_content,
			});
		   const responseJson = await response.json(); 
		   console.log("respppp responseJson" + JSON.stringify(responseJson));
		   return responseJson;
	   } catch(error){
			console.log(error);
	   }
   }
   
}
//vehicle_disputes
export function vehicle_disputes(payload) {
   return async (dispatch) => {
	   try {
		   const credsFromStorage = await getTokenFromStorage();
		   var header = AppConfig.headers;
		   if(credsFromStorage)
			 header['Authorization']='Bearer '+credsFromStorage;
		   
		   //check get or post based on payload param
		   var url = AppConfig.urls.site+AppConfig.endpoints.vehicle_disputes+'/'+payload.id;
		   var type = 'GET';
		   var body_content = null;
		   if(payload.type == 'post_host_dispute'){
			   var url = AppConfig.urls.site+AppConfig.endpoints.vehicle_disputes+'/add';
    		   var type = 'POST';
			   body_content = JSON.stringify(payload);
		   }
		   const response = await fetch(url, {
			  method: type,
			  headers: header,
			  body: body_content,
			});
		   const responseJson = await response.json(); 
		   console.log("respppp responseJson" + JSON.stringify(responseJson));
		   return responseJson;
	   } catch(error){
			console.log(error);
	   }
   }
   
}

//item_user_messages
export function item_user_messages(payload) {
   return async (dispatch) => {
	   try {
		   const credsFromStorage = await getTokenFromStorage();
		   var header = AppConfig.headers;
		   if(credsFromStorage)
			 header['Authorization']='Bearer '+credsFromStorage;
		   
		   //check get or post based on payload param
		   var url = AppConfig.urls.site+AppConfig.endpoints.item_user_messages+'/'+payload.filter+'?page='+payload.page;
		   var type = 'GET';
		   console.log("respppp url" + JSON.stringify(url));
		   const response = await fetch(url, {
			  method: type,
			  headers: header,
			  body: null,
			});
		   const responseJson = await response.json(); 
		   console.log("respppp responseJson" + JSON.stringify(responseJson));
		   return responseJson;
	   } catch(error){
			console.log(error);
	   }
   }
   
}

//money_transfer_accounts
export function money_transfer_accounts(payload) {
   return async (dispatch) => {
	   try {
		   const credsFromStorage = await getTokenFromStorage();
		   var header = AppConfig.headers;
		   if(credsFromStorage)
			 header['Authorization']='Bearer '+credsFromStorage; 
		   
		   //check get or post based on payload param
		   var url = '';
		   var type = 'GET';
		   var body_data = null;

		   if(payload.delete == 1){
				url = AppConfig.urls.site+AppConfig.endpoints.money_transfer_accounts+'/'+payload.money_transfer_id;
				type = 'Delete';
		   }
		   else if(payload.add == 1){
				url = AppConfig.urls.site+AppConfig.endpoints.money_transfer_accounts;
				type = 'POST';
				body_data = JSON.stringify(payload);
		   }
		   else
				url = AppConfig.urls.site+AppConfig.endpoints.money_transfer_accounts;
		   
		   console.log("respppp url" + JSON.stringify(url) + JSON.stringify(body_data)); 
		   console.log("respppp url" + JSON.stringify(header));  
		   const response = await fetch(url, {
			  method: type,
			  headers: header,
			  body: body_data,
			}); 
		   const responseJson = await response.json(); 
		   console.log("respppp responseJson" + JSON.stringify(responseJson));
		   return responseJson;
	   } catch(error){
			console.log(error);
	   }
   }
   
}

//get gateways
export function get_gateways(payload) {
   return async (dispatch) => {
	   try {
		   const credsFromStorage = await getTokenFromStorage();
		   var header = AppConfig.headers;
		   if(credsFromStorage)
			 header['Authorization']='Bearer '+credsFromStorage;
		   
		   //check get or post based on payload param
		   var url = AppConfig.urls.site+AppConfig.endpoints.get_gateways+'?page='+payload.page;
		   var type = 'GET';
		   const response = await fetch(url, {
			  method: type,
			  headers: header,
			  body: null,
			});
		   const responseJson = await response.json(); 
		   return responseJson;
	   } catch(error){
			console.log(error);
	   }
   } 
}
//get countries
export function countries() {
   return async (dispatch) => {
	   try {
		   const credsFromStorage = await getTokenFromStorage();
		   var header = AppConfig.headers;
		   if(credsFromStorage)
			 header['Authorization']='Bearer '+credsFromStorage;
		   
		   //check get or post based on payload param
		   var url = AppConfig.urls.site+AppConfig.endpoints.countries+'?filter={"where":{"is_active":1},"skip":0,"limit":1000,"order":"name asc"}';
		   var type = 'GET';
		   console.log("Countries loaded " + JSON.stringify(url));
		   const response = await fetch(url, {
			  method: type,
			  headers: header,
			  body: null,
			});
		   const responseJson = await response.json();
		   console.log("Countries loaded " + JSON.stringify(responseJson));
		   return dispatch({
			  type: 'COUNTRIES',
			  data: responseJson.data,
		   });
	   } catch(error){
			console.log(error);
	   }
   } 
}

//user cash withdrawals
export function user_cash_withdrawals(payload) {
   return async (dispatch) => {
	   try {
		   const credsFromStorage = await getTokenFromStorage();
		   var header = AppConfig.headers;
		   if(credsFromStorage)
			 header['Authorization']='Bearer '+credsFromStorage;
		   
		   //check get or post based on payload param
		   var url = AppConfig.urls.site+AppConfig.endpoints.user_cash_withdrawals+'?page='+payload.page;
		   var type = 'GET';
		   var body_data = null;
		   if(payload.type == 'post'){
			   url = AppConfig.urls.site+AppConfig.endpoints.user_cash_withdrawals;
			   type = 'POST';
			   body_data = JSON.stringify(payload);
		   }
		   console.log(url); 
		   const response = await fetch(url, {
			  method: type,
			  headers: header,
			  body: body_data,
			});
		   const responseJson = await response.json(); 
		   console.log("responseJson" + JSON.stringify(responseJson));
		   return responseJson;
	   } catch(error){
			console.log(error);
	   }
   } 
}
//get messages
export function messages(payload) {
   return async (dispatch) => {
	   try {
		   const credsFromStorage = await getTokenFromStorage();
		   var header = AppConfig.headers;
		   if(credsFromStorage)
			 header['Authorization']='Bearer '+credsFromStorage;
		   
		   //check get or post based on payload param
		   var url = AppConfig.urls.site+AppConfig.endpoints.messages+'?page='+payload.page;
		   var type = 'GET';
		   var body_content = null;
		   if(payload.type == 'starmessages')
				url = AppConfig.urls.site+AppConfig.endpoints.star_messages+'?page='+payload.page;
		   else if(payload.type == 'sentmessages')
				url = AppConfig.urls.site+AppConfig.endpoints.sent_messages+'?page='+payload.page;
		   else if(payload.type == 'put'){
				url = AppConfig.urls.site+AppConfig.endpoints.messages+'/'+payload.id;
				type='PUT';
				body_content = JSON.stringify(payload);
		   }
		   
		   
		   console.log("messages "+ url);
		   const response = await fetch(url, {
			  method: type,
			  headers: header,
			  body: body_content, 
			});
		   const responseJson = await response.json(); 
		   console.log("messages "+ JSON.stringify(responseJson));
		   return responseJson;
	   } catch(error){
			console.log(error);
	   }
   } 
}
//wallet
export function wallets(payload) {
   return async (dispatch) => {
	   try {
		   const credsFromStorage = await getTokenFromStorage();
		   var header = AppConfig.headers;
		   if(credsFromStorage)
			 header['Authorization']='Bearer '+credsFromStorage;
		   
		   //check get or post based on payload param
		   var url = AppConfig.urls.site+AppConfig.endpoints.wallets;
		   var type = 'GET';
		   var body_content = null;
		   if(payload.type == 'wallets')
				url = AppConfig.urls.site+AppConfig.endpoints.wallets;
		   else if(payload.type == 'post'){
				url = AppConfig.urls.site+AppConfig.endpoints.wallets;
				type='POST';
				body_content = JSON.stringify(payload);
		   }
		   
		   console.log("messages "+ url);
		   const response = await fetch(url, {
			  method: type,
			  headers: header,
			  body: body_content, 
			});
		   const responseJson = await response.json(); 
		   console.log("messages "+ JSON.stringify(responseJson));
		   return responseJson;
	   } catch(error){
			console.log(error);
	   }
   } 
}


