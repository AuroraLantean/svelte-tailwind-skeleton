import { writable, get } from "svelte/store";

// ItemStore
// Item
// Title, Item, Language, Favorite
export const ItemStore = writable<Item[]>([]); // [itemForm1,itemForm2,etc.]

// addItem
export const addItem = (input: ItemForm) => {
  const items = get(ItemStore);
  const uuid = crypto.randomUUID();//only on localhost or https
  console.log("uuid: " + uuid);
  ItemStore.update(() => { // Item[]
    return [{
      ...input, id: uuid, favorite: false,
      editing: false, checked: false
    }, ...items]
  });
}
// buyItem
export const buyItem = (id: string) => {
  const items = get(ItemStore);
  console.log("buyItem. id:", id)

  const newItems = items.map((item) => {
    if(item.stock === 0) return item;
    if (item.id === id) {
      return { ...item, stock: item.stock -1 }
    }
    return item;
  });
  //console.log("newItems: ", newItems)
  ItemStore.update(() => { 
    return newItems
  })
}


// editItem
export const editItem = (input: Item) => {
  //console.log("editItem(), input: ", input)
  const items = get(ItemStore);

  const newItems = items.map((item) => {
    if (item.id === input.id) {
      return { ...input, editing: !item.editing }
    }
    return item;
  });
  //console.log("newItems: ", newItems)
  ItemStore.update(() => { 
    return newItems
  })
}

// deleteItem
export const deleteItem = (id: string) => {
  const items = get(ItemStore);
  const newItems = items.reduce((result: Item[], item) => {
    if (item.id !== id) {
      result.push(item);
    }
    return result;
  }, []);
  //items.splice(index, 1); 
  //console.log("newItems: ", newItems)
  ItemStore.update(() => { 
    return newItems
  })
}

// toggleFavorite
export const toggleFavorite = (id: string) => {
  const items = get(ItemStore);

  ItemStore.update(() => { 
    return items.map((item) => {
      if (item.id === id) {
        return { ...item, favorite: !item.favorite }
      }
      return item;
    });
  });
}
