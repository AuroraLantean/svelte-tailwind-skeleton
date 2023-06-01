<script lang="ts">
	import { localStorageStore } from '@skeletonlabs/skeleton'; // Backs up our data
	import type { Writable } from 'svelte/store'; // Handles our data

	let inputName = '';
	let inputPhoneNumber = '';

	interface Contact {
		name: string;
		phoneNumber: string;
	}

	const contactStore: Writable<Contact[]> = localStorageStore('contactStore', []);

	function addContact() {
		$contactStore = [
			{
				name: inputName,
				phoneNumber: inputPhoneNumber
			},
			...$contactStore
		];
	}
	function updateContact(index: number) {
		//const taskIdx = $contactStore.findIndex((item) => item.id === task.id);
		if (index > -1) {
      $contactStore[index] = {name: inputName,
					phoneNumber: inputPhoneNumber};
		}// 
	}

	function deleteContact(index: number) {
		$contactStore = $contactStore.filter((contact, contactIndex) => contactIndex !== index);
	}
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">ContactList</h1>
		<p>All your contacts in one persistent state!</p>

		<label class="label">
			<span>Name</span>
			<input class="input" type="text" placeholder="Name" bind:value={inputName} />
		</label>

		<label class="label">
			<span>Phone Number</span>
			<input class="input" type="text" placeholder="Phone Number" bind:value={inputPhoneNumber} />
		</label>

		<button type="button" class="btn variant-filled" on:click={addContact}>Add Contact</button>

		<hr />
		<h2 class="h2">Your Contacts</h2>
		{#each $contactStore as contact, index}
			<div class="card p-2">
				<h1>{contact.name}</h1>
				<h1>{contact.phoneNumber}</h1>
				<button
					type="button"
					class="btn btn-sm variant-filled-warning"
					on:click={() => updateContact(index)}>Update</button
				>
				<button
					type="button"
					class="btn btn-sm variant-filled-error"
					on:click={() => deleteContact(index)}>Delete</button
				>
			</div>
		{/each}
	</div>
</div>
