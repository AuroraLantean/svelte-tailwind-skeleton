// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  // interface Locals {}
  // interface PageData {}
  // interface Error {}
  // interface Platform {}
}

declare class Product {
  id: string    // Stripe ID
  name: string  // "Coffee"
  price: number // 5
}

declare class CartItem {
  id: string
  quantity: number
}

//-------------------==
interface ItemFormInput {
  quantity: number,
  price: number,
  currency: string,
	title: string
	category: string
	description: string
}
interface ItemForm {
  id: string,
  quantity: number,
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
