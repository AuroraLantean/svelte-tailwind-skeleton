// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  // interface Locals {}
  // interface PageData {}
  // interface Error {}
  // interface Platform {}
}

declare class TxnInput {
  userAddr: string
  tokenAddr: string
  toAddr: string
  fromAddr: string
  chainName: string
  amount1: number
  amount2: number
}
declare class Contact {
  id: string
  name: string
  email: string
  company: string
  job: string
}
declare class BcResult {
  error: string
  data: any
  txn: any
}
declare class Product {
  id: string    // Stripe ID
  name: string  // "Coffee"
  price: number // 5
}

declare class CartItem {
  id: string
  stock: number
}
//-------------------== User
interface DbInfo {
  url: string,
  uid: string,
	jwt: string,
}
interface UserInfo {
  id: string,
	token: string,
  isValid: boolean,
}
interface User {
  id: string,
	username: string,
  email: string,
  password: string,
  passwordConfirmation: string,
  name: string,
  avatar: string,
  description: string,
  region: string,
  level: number,
  verified: number,
}
//-------------------== Item
interface ItemForm {
  stock: number,
  price: number,
  currency: string,
	title: string
	category: string
	description: string
}
interface Item {
  id: string,
  stock: number,
  price: number,
  currency: string,
  title: string
  category: string
  description: string
  favorite: boolean,
  editing: boolean,
  checked: boolean,
  // userCreated : User, createdOn: string
}
