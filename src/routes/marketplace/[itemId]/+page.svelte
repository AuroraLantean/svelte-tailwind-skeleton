<script>
  export let data;//data passed from page.ts/js must be an object!
  console.log('data:', data);
  const { item } = data;
</script>

<h1>{item.title}</h1>
<p>{item.description}</p>
<p>{item.price.toFixed(2)}USD</p>

<p>images: {item.images.length}</p>
<img src={item.images[0]} alt="Italian Trulli">