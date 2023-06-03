<script lang="ts">
	import { addItem, editItem } from '../../store/items';

  const itemDefault = {
		title: '',
		category: 'car',
		description: '',
		favorite: false,
		editing: false,
		checked: false
	};
	export let item: ItemForm = itemDefault;
	export let index: number = 0;
	export let isNew: boolean = true;
  const resetItem = () => { 
    item.title = "";
    item.description = "";
  }
</script>

<div class="card p-4 w-full text-token space-y-4">
	<label class="label">
		<span>Item Title</span>
		<input
			class="input"
			type="text"
			placeholder="Enter title here..."
			bind:value={item.title}
		/>
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

	{#if isNew}
		<button
			type="button"
			class="btn btn-sm variant-filled-primary"
			on:click={() => {
        addItem(item); resetItem();}}
		>
			Add Item
		</button>
	{:else}
		<button
			type="button"
			class="btn btn-sm variant-filled-primary"
			on:click={() => editItem(index, item)}
		>
			Save
		</button>
	{/if}
</div>
