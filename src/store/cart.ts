// React Context
import { writable, get } from "svelte/store";

export const cartItems = writable<CartItem[]>([]);
// [ { id: "1", stock: 4 }, { id: "2", stock: 1 } ] 

// add to cart (add one)
export const addToCart = (id: string) => {
    // cartItems is a writable, not a value
    // get(cartItems) ->  [ { id: "1", stock: 6 }, { id: "2", stock: 1 }, { id: "3", stock: 1} ] 
    const items = get(cartItems);
    const itemPosition = items.findIndex(
        (item) => { return item.id == id} // does the current item have an id of "1"?
    )

    if(itemPosition !== -1) {
        // Item is already in cart, add to the stock of that item
        cartItems.update(() => {
            // items: [ { id: "1", stock: 6 }, { id: "2", stock: 3 } ]
            // updatedItems: [{ id: "1", stock: 7 }, { id: "2", stock: 3 } ]
            const updatedItems = items.map( (item) => {
                if(item.id === id) {
                    return { ...item, stock: item.stock + 1 };
                }
                return item;
            });

            return updatedItems;
        });
    } else {
        // Item is not in the cart at all, so add the object to the cart
        cartItems.update(() => {
            return [ ...items, { id: id, stock: 1} ]
        });
    }
}

// remove from cart (remove one) -> change the value of the writable
export const removeFromCart = (id: string) => {
    const items = get(cartItems);
    const itemPosition = items.findIndex(
        (item) => { return item.id == id} // does the current item have an id of "1"?
    )

    // [ {id: "1", stock: 1} ]
    if(items[itemPosition]?.stock - 1 === 0) {
        items.splice(itemPosition, 1);
    }
    // [ ]

    cartItems.update(() => {
        // items: [ { id: "1", stock: 6 }, { id: "2", stock: 3 } ]
        // updatedItems: [{ id: "1", stock: 5 }, { id: "2", stock: 3 } ]
        const updatedItems = items.map( (item) => {
            if(item.id === id) {
                return { ...item, stock: item.stock - 1 };
            }
            return item;
        });

        return updatedItems;
    });
}
