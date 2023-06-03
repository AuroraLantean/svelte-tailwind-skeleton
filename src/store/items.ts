import { writable, get } from "svelte/store";

// ItemStore
// Item
// Title, Item, Language, Favorite
export const ItemStore = writable<ItemForm[]>([]); // [itemForm1,itemForm2,etc.]

// addItem
export const addItem = (input: ItemFormInput) => {
  const items = get(ItemStore);
  ItemStore.update(() => { // ItemForm[]
    return [{
      ...input, favorite: false,
      editing: false, checked: false
    }, ...items]
  });
}


// editItem
export const editItem = (index: number, input: ItemForm) => {
  console.log("editItem(), index: ", index, ", input: ", input)
  const items = get(ItemStore);

  const newItems = items.map((item, ItemIndex) => {
    if (ItemIndex === index) {
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
export const deleteItem = (index: number) => { // if you have a db, delete by ID?
  const items = get(ItemStore);
  items.splice(index, 1); 
  ItemStore.update(() => { // ItemForm[]
    return items;
  });
}

// toggleFavorite
export const toggleFavorite = (index: number) => {
  const items = get(ItemStore);

  ItemStore.update(() => { 
    return items.map((item, ItemIndex) => {
      if (ItemIndex === index) {
        return { ...item, favorite: !item.favorite }
      }
      return item;
    });
  });
}

export const setEditing = (index: number, isEditing: boolean) => {
  const items = get(ItemStore);
  ItemStore.update(() => {
    return items.map((item, ItemIndex) => {
      if (ItemIndex === index) {
        return { ...item, editing: isEditing }
      }
      return item;
    });
  });
}