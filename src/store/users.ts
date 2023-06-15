import { writable, get } from "svelte/store";
import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE } from "$env/static/public";
console.log("PUBLIC env:", PUBLIC_POCKETBASE);
const pocketbaseURL = PUBLIC_POCKETBASE;

export const DbStore = writable<DbInfo>({
  url: '', jwt: '', uid: '',
});

export const getDbInfo = (): DbInfo => {
  const dbInfo = get(DbStore);
  console.log("dbInfo:", dbInfo);
  return dbInfo;
}
export const updateDbInfo = (fieldName: string, value: string) => {
  const dbInfo = get(DbStore);
  console.log("fieldName:", fieldName, ', value:', value);
  const newDbInfo = { ...dbInfo, [fieldName]: value };
  console.log("newDbInfo:", newDbInfo);
  DbStore.update(() => {
    return newDbInfo;
  });
}

// addUser
export const addUser = async (user: User) => {
  console.log('addUser()... user:', user);
  console.log('pocketbaseURL:', pocketbaseURL);
  const pb = new PocketBase(pocketbaseURL);

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
export const logoutUser = async () => {
  console.log('logoutUser()');
  console.log('pocketbaseURL:', pocketbaseURL);
  const pb = new PocketBase(pocketbaseURL);
  pb.authStore.clear();
  updateDbInfo('uid', '');
  updateDbInfo('jwt', '');
}
// loginUser
export const loginUser = async (user: User): UserInfo => {
  console.log('loginUser()... user:', user);
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
    updateDbInfo('uid', uid);
    updateDbInfo('jwt', jwt);

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
      id: '',
      token: '',
      isValid: false,
    };
  }
}

// getUsers
export const getUsers = async (): User[] => {
  console.log('getUsers()...');
  console.log('pocketbaseURL:', pocketbaseURL);
  const pb = new PocketBase(pocketbaseURL);

  try {
    // fetch a paginated records list
    /*const resultList = await pb.collection('users').getList(1, 50, {
      filter: 'created >= "2022-01-01 00:00:00" && someField1 != someField2',
    });*/

    // you can also fetch all records at once via getFullList
    const records = await pb.collection('users').getFullList(10,{
      sort: '-created',
    });
    console.log('records:', records)

    // or fetch only the first record that matches the specified filter
    /*const record = await pb.collection('users').getFirstListItem('someField="test"', {
      expand: 'relField1,relField2.subRelField',
    });*/
    return records.map(record => {
      return {
        id: record.id,
        username: record.username,
        email: record.email,
        password: record.password,
        passwordConfirmation: record.passwordConfirmation,
        name: record.name,
        avatar: record.avatar,
        description: '',
        region: '',
        level: 0,
        verified: 0
      }
    });
    // "logout" the last authenticated model
    //pb.authStore.clear();
  } catch (error) {
    console.log('error:', error);
    return [{
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
    }];
  }
}
// getUser
export const getUser = async (id: string): User => {
  console.log('getUser()... id:', id);
  console.log('pocketbaseURL:', pocketbaseURL);
  const pb = new PocketBase(pocketbaseURL);

  try {
    const record = await pb.collection('users').getOne(id, {
      expand: 'relField1,relField2.subRelField',
    });
    console.log('getUser() => record:', record);
    return {
      id: id,
      username: record.username,
      email: record.email,
      password: 'NA',
      passwordConfirmation: 'NA',
      name: record.name,
      avatar: record.avatar,
      description: '',
      region: '',
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

// updateUser
export const updateUser = async (user: User) => {
  console.log('updateUser()...');
  console.log('pocketbaseURL:', pocketbaseURL);
  const pb = new PocketBase(pocketbaseURL);

  const data = {
    "username": user.username,
    "email": user.email,
    "emailVisibility": true,
    "password": user.password,
    "passwordConfirm": user.passwordConfirmation,
    "name": user.name,
    "description": user.description,
  };
  console.log('id:', user.id, ', data:', data);
  try {
    const record = await pb.collection('users').update(user.id, data);
    console.log('record updated successful:', record);
  } catch (error) {
    console.log('error:', error);
  }
}

// deleteUser
export const deleteUser = async (user: User) => {
  console.log('deleteUser()...');
  console.log('pocketbaseURL:', pocketbaseURL);
  const pb = new PocketBase(pocketbaseURL);

  console.log('id:', user.id);
  try {
    await pb.collection('users').delete(user.id);
    console.log('record deleted successful');
  } catch (error) {
    console.log('error:', error);
  }
}