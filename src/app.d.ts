// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  // interface Locals {}
  // interface PageData {}
  // interface Error {}
  // interface Platform {}
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

//-------------------==
interface ItemFormInput {
  stock: number,
  price: number,
  currency: string,
	title: string
	category: string
	description: string
}
interface ItemForm {
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
