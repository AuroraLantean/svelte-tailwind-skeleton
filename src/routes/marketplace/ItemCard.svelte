<script lang="ts">
	import { CodeBlock } from '@skeletonlabs/skeleton';
  import { toastStore, type ModalSettings, modalStore } from '@skeletonlabs/skeleton';
	import { buyItem, deleteItem, editItem, toggleFavorite } from '../../store/items';
	import InputForm from './InputForm.svelte';

	export let item: ItemForm = {
    id: '',
    quantity: 0,
		title: '',
		category: '',
		description: '',
		favorite: false,
		editing: false,
		checked: false
	};

  function deleteItemHandler(id: string): void {
		const confirmDelete: ModalSettings = {
			type: 'confirm',
			title: 'Delete Item',
			body: 'Are you sure you want to delete this item?',
			response: (r: boolean) => {
				if (r) {
          deleteItem(id)
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
					class="btn btn-sm variant-filled-tertiary"
					on:click={() => buyItem(item.id)}
				>
					Buy Now
				</button>
				<button
					type="button"
					class="btn btn-sm variant-filled-secondary"
					on:click={() => toggleFavorite(item.id)}
				>
					{item.favorite ? 'Unfavorite' : 'Favorite'}
				</button>
				<button
					type="button"
					class="btn btn-sm variant-filled-warning"
					on:click={() => editItem(item)}
				>
					{item.editing ? 'Save' : 'Edit'}
				</button>
				<button
					type="button"
					class="btn btn-sm variant-filled-error"
					on:click={() => deleteItemHandler(item.id)}
				>
					X
				</button>
			</div>

	</header>
	
  <section class="p-4">
		{#if item.editing}
      <InputForm {item} isNew={false}/>
		{:else}
      <CodeBlock language={item.category} code={item.description} />
    {/if}

	</section>
</div>
