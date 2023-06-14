import { writable, get } from "svelte/store";
import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE} from "$env/static/public";

export const DbStore = writable<DbInfo>({
  url: '', jwt: '', uid: '',
});

export const getDbInfo = ():DbInfo => {
  const dbInfo = get(DbStore);
  console.log("dbInfo:", dbInfo);
  return dbInfo;
}
export const updateDbInfo = (fieldName: string, value: string) => {
  const dbInfo = get(DbStore);
  console.log("fieldName:", fieldName, ', value:', value);
  const newDbInfo = { ...dbInfo, [fieldName]: value};
  console.log("newDbInfo:", newDbInfo);
  DbStore.update(() => {
    return newDbInfo;
  });
}

// addUser
export const addUser = async (user: User) => {
  console.log('addUser()... user:', user);
  console.log("PUBLIC env:", PUBLIC_POCKETBASE);
  const pocketbaseURL = PUBLIC_POCKETBASE;
  console.log('pocketbaseURL:', pocketbaseURL);
  const pb = new PocketBase(pocketbaseURL);

  // example create data
  const data = {
    "username": user.username,
    "email": user.email,
    "emailVisibility": true,
    "password": user.password,
    "passwordConfirm": user.passwordConfirmation,
    "name": user.name
  };
  console.log('data:', data);
  try {
    const record = await pb.collection('users').create(data);
    console.log('record created:', record);
    // (optional) send an email verification request
    //await pb.collection('users').requestVerification('test@example.com');
  } catch (error) {
    console.log('error:', error);
  }
}

// logoutUser
export const logoutUser = async() => {
  console.log('logoutUser()');
  const pocketbaseURL = PUBLIC_POCKETBASE;
  console.log('pocketbaseURL:', pocketbaseURL);
  const pb = new PocketBase(pocketbaseURL);
  pb.authStore.clear();
  updateDbInfo('uid','');
  updateDbInfo('jwt','');
}
// loginUser
export const loginUser = async(user: User):UserInfo => {
  console.log('loginUser()... user:', user);
  const pocketbaseURL = PUBLIC_POCKETBASE;
  console.log('pocketbaseURL:', pocketbaseURL);
  const pb = new PocketBase(pocketbaseURL);

  console.log('user.email || user.username:', user.email || user.username);
  try {
    const authData = await pb.collection('users').authWithPassword(user.email || user.username, user.password);
    console.log('authData:', authData);
    // after the above you can also access the auth data from the authStore
    const jwt = pb.authStore.token;
    const uid = pb.authStore.model.id;
    console.log(pb.authStore.isValid);
    //console.log(jwt);
    console.log('uid:', uid);
    updateDbInfo('uid',uid);
    updateDbInfo('jwt',jwt);
  
    return {
      id: uid,
      token: jwt,
      isValid: pb.authStore.isValid,
    };    
    // "logout" the last authenticated model
    //pb.authStore.clear();
  } catch (error) {
    console.log('error:', error);
    return {
      id:'',
      token:'',
      isValid:false,
    }; 
  }
}

// getUser
export const getUser = async(id: string):User => {
  console.log('getUser()... id:', id);
  const pocketbaseURL = PUBLIC_POCKETBASE;
  console.log('pocketbaseURL:', pocketbaseURL);
  const pb = new PocketBase(pocketbaseURL);

  try {
    const record = await pb.collection('users').getOne(id, {
        expand: 'relField1,relField2.subRelField',
    });
    return {
      id: id,
      username: record.username,
      email: record.email,
      password: '',
      passwordConfirmation: '',
      name: record.name,
      avatar: record.avatar,
      description: record.description,
      region: 'Antarctica',
      level: 0,
      verified: 0
    };    
    // "logout" the last authenticated model
    //pb.authStore.clear();
  } catch (error) {
    console.log('error:', error);
    return {
      id: '',
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      name: '',
      avatar: '',
      description: '',
      region: '',
      level: 0,
      verified: 0
    }; 
  }
}