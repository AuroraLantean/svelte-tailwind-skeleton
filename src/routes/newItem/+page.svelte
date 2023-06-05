<script lang="ts">
	import { goto } from '$app/navigation';
	import { InputChip, toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { addItem } from '../../store/items';

	let tags: string[] = [];
	const itemDefault = {
    id: '',
    quantity: 0,
		title: '',
		category: 'car',
		description: '',
		favorite: false,
		editing: false,
		checked: false
	};
	export let item: ItemForm = itemDefault;

	const resetItem = () => {
		item.title = '';
		item.description = '';
	};

	const t: ToastSettings = {
		message: 'New Item added successfully!',
		background: 'variant-filled-success',
		timeout: 2000
	};

	function addItemHandler(): void {
    console.log("addItemHandler()... item:", item)
    addItem(item);
    resetItem();
		tags = [];
		toastStore.trigger(t);
		goto('/marketplace');
	}
</script>


<div class="card p-4 w-full text-token space-y-4">
	<label class="label">
    <h3 class="text-center py-6">Make A New Item For Sale</h3>
		<span>Item Title</span>
		<input class="input" type="text" placeholder="Enter title here..." bind:value={item.title} />
	</label>
	<label class="label">
		<span>Category</span>
		<select class="select" bind:value={item.category}>
			<option value="car">Car</option>
			<option value="yacht">Yacht</option>
			<option value="airplane">Airplane</option>
			<option value="spaceship">Spaceship</option>
		</select>
	</label>
	<label class="label">
		<span>Description</span>
		<textarea
			class="textarea"
			rows="4"
			placeholder="Enter your description here..."
			bind:value={item.description}
		/>
	</label>
	<InputChip bind:value={tags} name="tags" placeholder="Tags..." />
	<button
		type="button"
		class="btn btn-sm variant-filled-primary"
		on:click={() => addItemHandler()}
	>
		Add Item
	</button>
</div>
