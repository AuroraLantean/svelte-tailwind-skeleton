export const load = ({fetch, params}) => {
  console.log('product page... params:', params);

  const fetchItem =async (id:string) => {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    const data = await res.json();
    return data;
  }

  return {
    item : fetchItem(params.itemId)
  }
}