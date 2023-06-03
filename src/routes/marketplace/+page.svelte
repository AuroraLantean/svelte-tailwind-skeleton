<script lang="ts">
	import ItemFormCard from "./ItemCard.svelte";
	import { ItemStore, addItem } from "../../store/items";
	import type { PageData } from "./$types";
	import InputForm from "./InputForm.svelte";
	export let data: PageData;
	
	// createItem(input : ItemFormInput)
	ItemStore.set(data.items);
	// ItemStore -> a local writable that allows us to store  items
	// create / delete items
	// favorite items
	// +page.ts to initially load in some example items (mocking a database request)

</script>


<div class="flex justify-center">
	<div class="grid grid-cols-1 gap-4 min-w-full md:min-w-[750px]">
		<h3 class="text-center py-6">Make A New Item For Sale</h3>
    <InputForm />
		<div class="text-center py-6">
			<h2>Items for sale</h2>
		</div>
		{#each $ItemStore as item, index}
			<ItemFormCard {item} {index} /> 
		{/each}
	</div>
</div>
