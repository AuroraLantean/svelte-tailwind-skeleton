<script lang="ts">
	import {
		modalStore,
		type ModalSettings,
		type ModalComponent,
		type ToastSettings,
		toastStore
	} from '@skeletonlabs/skeleton';
	import ItemCard from './ItemCard.svelte';
	import { ItemStore, addItem } from '../../store/items';
	//import type { PageData } from './$types';
	import ModalAddItem from '../../components/ModalAddItem.svelte';

	export let data;//: PageData;
  //$: ( { items } = data ); 
  const { items } = data;
	//console.log("data.items:", data.items)
	ItemStore.set(items);
	// ItemStore -> a local writable that allows us to store  items
	// create / delete items
	// favorite items
	// +page.ts to initially load in some example items (mocking a database request)

	const modalComponent: ModalComponent = {
		// Pass a reference to your custom component
		ref: ModalAddItem,
		// Add the component properties as key/value pairs
		props: {}
		// Provide a template literal for the default component slot
		//slot: '<p>Skeleton</p>'
	};

	function modalHandler(): void {
		const modalSettings: ModalSettings = {
			type: 'component',
			component: modalComponent,
			title: 'Add Item',
			body: 'Are you sure you want to add this item?',
			response: (r: any) => {
				if (r) {
					console.log('modal is confirmed: ' + JSON.stringify(r));
					addItem(r);
					toastStore.trigger(t);
					return;
				}
				console.log('modal is rejected: ' + r);
			}
		};
		modalStore.trigger(modalSettings);
	}
	const t: ToastSettings = {
		message: 'New Item added successfully!',
		background: 'variant-filled-success',
		timeout: 2000
	};
</script>

<div class="container h-full mx-auto gap-8 flex flex-col">
	<div class="flex items-center justify-between">
		<div class="text-center py-6">
			<h2>Items for sale</h2>
		</div>
		<button type="button" class="btn variant-filled-primary" on:click={() => modalHandler()}>
			Add Item Modal
		</button>
		<a href="/newItem" class="btn variant-filled-primary"> Add Item Page </a>
	</div>
</div>

<div class="flex justify-center">
	<div class="grid grid-cols-2 gap-4 min-w-full md:min-w-[750px]">
		{#each $ItemStore as item, index}
			<ItemCard {item} />
		{/each}
	</div>
</div>
