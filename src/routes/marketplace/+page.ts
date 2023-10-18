//import type { PageLoad } from "./$types";

export const load = async ({ fetch }) => {
  console.log("Marketplace load()")
  const fetchItems = async () => {
    const itemRes = await fetch('https://dummyjson.com/products?limit=10');// ?api_key=${process.env.API_KEY}
    const itemResData = await itemRes.json();
    console.log('itemResData', itemResData);
    return itemResData.products.map((item: any) => {
      return {
        ...item, currency: "USD", favorite: false, editing: false, checked: false
      }
    });
  }
  /*const fetchUsers =async() => {
    const usersData = await fetch('https://dummyjson.com/users?limit=10');
    const userData = await usersData.json();
    console.log('userData:', userData);
    return userData.users;
  }*/

  return {
    items: fetchItems(),
    //users: fetchUsers(),
  }//parallel fetch!
};// satisfies PageLoad; //to become PageData in +page.svelte