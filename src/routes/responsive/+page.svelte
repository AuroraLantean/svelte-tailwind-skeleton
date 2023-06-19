<script lang="ts">
	//export let pagetype = 'User Management';
	const handlerXyz = async () => {
		console.log('handlerXyz... ');
	};
</script>

<div class="bg-gradient-to-br from-slate-50 to-stone-300 max-w-6xl mx-auto">

	<div class="flex flex-wrap gap-2">
		<div
			class="basis-full md:basis-[30%] flex bg-cover bg-center flex-1 h-[300px] bg-[url('/src/images/categories/shoes2.jpg')]"
		>
			<div class="m-auto bg-black p-3 text-white font-bold text-4xl uppercase rounded-xl">
				Shoes
			</div>
		</div>
		<div
			class="basis-full md:basis-[30%] flex bg-cover bg-center flex-1 h-[300px] bg-[url('/src/images/categories/hats.jpg')]"
		>
			<div class="m-auto bg-black p-3 text-white font-bold text-4xl uppercase rounded-xl">Hats</div>
		</div>
		<div
			class="basis-full md:basis-[30%] flex bg-cover bg-center flex-1 h-[300px] bg-[url('/src/images/categories/tshirts.jpg')]"
		>
			<div class="m-auto bg-black p-3 text-white font-bold text-4xl uppercase rounded-xl">
				T-Shirts
			</div>
		</div>
		<div
			class="basis-full md:basis-[30%] flex bg-cover bg-center flex-1 h-[300px] bg-[url('/src/images/categories/sunglasses.jpg')]"
		>
			<div class="m-auto bg-black p-3 text-white font-bold text-4xl uppercase rounded-xl">
				Sunglasses
			</div>
		</div>
	</div>

  <h2 class="text-center text-3xl py-6 font-bold mb-4">Featured products</h2>
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-8 gap-2">
		<div class="p-2 bg-white rounded-md">
      <div
			class="bg-cover h-52 bg-[url('/src/images/products/p1.jpg')]"
		></div>
			<div class="text-center mt-2 mb-2">
				<strong class="font-bold">Plain white t-shirt</strong>
				<p class="text-slate-500">A plain white t-shirt perfect for summer</p>
				<p class="text-lg font-bold italic mt-2 mb-2">from $9.99</p>
				<button
          type="button"
					class="hover:bg-purple-600 transition-all hover:scale-110 rounded-md p-2 bg-stone-900 text-white font-bold text-lg cursor-pointer btn variant-filled-primary"
          on:click={() => handlerXyz()}
				>
					View item
				</button>
			</div>
		</div>
		<div class="p-2 bg-white rounded-md">
			<img src="/src/images/products/p2.jpg" class="h-52 w-full object-cover" alt="product-p2" />
			<div class="text-center mt-2 mb-2">
				<strong class="font-bold">White "out case" t-shirt</strong>
				<p class="text-slate-500">A plain white t-shirt perfect for summer</p>
				<p class="text-lg font-bold italic mt-2 mb-2">from $9.99</p>
				<button
          type="button"
					class="hover:bg-purple-600 transition-all hover:scale-110 rounded-md p-2 bg-stone-900 text-white font-bold text-lg cursor-pointer btn variant-filled-primary"
          on:click={() => handlerXyz()}
				>
					View item
				</button>
			</div>
		</div>
		<div class="p-2 bg-white rounded-md">
			<img src="/src/images/products/p3.jpg" class="h-52 w-full object-cover" alt="product-p3" />
			<div class="text-center mt-2 mb-2">
				<strong class="font-bold">Red "not today" t-shirt</strong>
				<p class="text-slate-500">A plain white t-shirt perfect for summer</p>
				<p class="text-lg font-bold italic mt-2 mb-2">from $9.99</p>
				<button
          type="button"
					class="hover:bg-purple-600 transition-all hover:scale-110 rounded-md p-2 bg-stone-900 text-white font-bold text-lg cursor-pointer btn variant-filled-primary"
          on:click={() => handlerXyz()}
				>
					View item
				</button>
			</div>
		</div>
		<div class="p-2 bg-white rounded-md">
			<img src="/src/images/products/p4.jpg" class="h-52 w-full object-cover" alt="product-p4" />
			<div class="text-center mt-2 mb-2">
				<strong class="font-bold">Black bones t-shirt</strong>
				<p class="text-slate-500">A plain white t-shirt perfect for summer</p>
				<p class="text-lg font-bold italic mt-2 mb-2">from $9.99</p>
				<button
          type="button"
					class="hover:bg-purple-600 transition-all hover:scale-110 rounded-md p-2 bg-stone-900 text-white font-bold text-lg cursor-pointer btn variant-filled-primary"
          on:click={() => handlerXyz()}
				>
					View item
				</button>
			</div>
		</div>
		<div class="p-2 bg-white rounded-md">
			<img src="/src/images/products/p5.jpg" class="h-52 w-full object-cover" alt="product-p5" />
			<div class="text-center mt-2 mb-2">
				<strong class="font-bold">Plain white t-shirt</strong>
				<p class="text-slate-500">A plain white t-shirt perfect for summer</p>
				<p class="text-lg font-bold italic mt-2 mb-2">from $9.99</p>
				<button
          type="button"
					class="hover:bg-purple-600 transition-all hover:scale-110 rounded-md p-2 bg-stone-900 text-white font-bold text-lg cursor-pointer btn variant-filled-primary"
          on:click={() => handlerXyz()}
				>
					View item
				</button>
			</div>
		</div>
		<div class="p-2 bg-white rounded-md">
			<img src="/src/images/products/p6.jpg" class="h-52 w-full object-cover" alt="product-p6" />
			<div class="text-center mt-2 mb-2">
				<strong class="font-bold">Grey baseball cap</strong>
				<p class="text-slate-500">A plain white t-shirt perfect for summer</p>
				<p class="text-lg font-bold italic mt-2 mb-2">from $9.99</p>
				<button
          type="button"
					class="hover:bg-purple-600 transition-all hover:scale-110 rounded-md p-2 bg-stone-900 text-white font-bold text-lg cursor-pointer btn variant-filled-primary"
          on:click={() => handlerXyz()}
				>
					View item
				</button>
			</div>
		</div>
		<div class="p-2 bg-white rounded-md">
			<img src="/src/images/products/p7.jpg" class="h-52 w-full object-cover" alt="product-p7" />
			<div class="text-center mt-2 mb-2">
				<strong class="font-bold">White dreamer t-shirt</strong>
				<p class="text-slate-500">A plain white t-shirt perfect for summer</p>
				<p class="text-lg font-bold italic mt-2 mb-2">from $9.99</p>
				<button
          type="button"
					class="hover:bg-purple-600 transition-all hover:scale-110 rounded-md p-2 bg-stone-900 text-white font-bold text-lg cursor-pointer btn variant-filled-primary"
          on:click={() => handlerXyz()}
				>
					View item
				</button>
			</div>
		</div>
		<div class="p-2 bg-white rounded-md">
			<img src="/src/images/products/p8.jpg" class="h-52 w-full object-cover" alt="product-p8" />
			<div class="text-center mt-2 mb-2">
				<strong class="font-bold">Gold rim sunglasses</strong>
				<p class="text-slate-500">A plain white t-shirt perfect for summer</p>
				<p class="text-lg font-bold italic mt-2 mb-2">from $9.99</p>
				<button
          type="button"
					class="hover:bg-purple-600 transition-all hover:scale-110 rounded-md p-2 bg-stone-900 text-white font-bold text-lg cursor-pointer btn variant-filled-primary"
          on:click={() => handlerXyz()}
				>
					View item
				</button>
			</div>
		</div>
	</div>
</div>
