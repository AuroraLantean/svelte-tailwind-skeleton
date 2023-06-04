<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	// Stores
	import { modalStore } from '@skeletonlabs/skeleton';

	// Form Data
	const formData = {
		title: '',
		category: 'car',
		description: ''
	};

	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		if ($modalStore[0].response) {
      console.log("onFormSubmit response")
      $modalStore[0].response(formData);
    }
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<!-- Enable for debugging: -->
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Title</span>
				<input class="input" type="text" bind:value={formData.title} placeholder="Enter title..." />
			</label>
      <label class="label">
        <span>Category</span>
        <select class="select" bind:value={formData.category}>
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
          bind:value={formData.description}
        />
      </label>
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit Form</button>
    </footer>
	</div>
{/if}