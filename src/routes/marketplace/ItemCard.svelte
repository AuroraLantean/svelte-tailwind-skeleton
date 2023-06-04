<script lang="ts">
	import { CodeBlock } from '@skeletonlabs/skeleton';
  import { toastStore, type ModalSettings, modalStore } from '@skeletonlabs/skeleton';
	import { deleteItem, editItem, toggleFavorite } from '../../store/items';
	import InputForm from './InputForm.svelte';

	export let item: ItemForm = {
		title: '',
		category: '',
		description: '',
		favorite: false,
		editing: false,
		checked: false
	};

	export let index: number;

  function deleteItemHandler(index: number): void {
		const confirmDelete: ModalSettings = {
			type: 'confirm',
			title: 'Delete Item',
			body: 'Are you sure you want to delete this item?',
			response: (r: boolean) => {
				if (r) {
          deleteItem(index)
					toastStore.trigger({
						message: 'Item deleted successfully',
						background: 'variant-filled-success'
					});
					return;
				}
				toastStore.trigger({
					message: 'Item not deleted',
					background: 'variant-ghost-error'
				});
			}
		};
		modalStore.trigger(confirmDelete);
	}
</script>

<div class="card">
	<header class="card-header">
		{#if item.editing}
      To Be Edited Below...
		{:else}
			{item.title}
    {/if}
      <div class="float-right">
				<button
					type="button"
					class="btn btn-sm variant-filled-secondary"
					on:click={() => toggleFavorite(index)}
				>
					{item.favorite ? 'Unfavorite' : 'Favorite'}
				</button>
				<button
					type="button"
					class="btn btn-sm variant-filled-warning"
					on:click={() => editItem(index, item)}
				>
					{item.editing ? 'Save' : 'Edit'}
				</button>
				<button
					type="button"
					class="btn btn-sm variant-filled-error"
					on:click={() => deleteItemHandler(index)}
				>
					X
				</button>
			</div>

	</header>
	
  <section class="p-4">
		{#if item.editing}
      <InputForm {item} {index} isNew={false}/>
		{:else}
      <CodeBlock language={item.category} code={item.description} />
    {/if}

	</section>
</div>
