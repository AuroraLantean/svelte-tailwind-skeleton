<script lang="ts">
	import { goto } from '$app/navigation';
	import { capitalizeFirst } from '@store/lib';
	import { deleteUser, getDbInfo, getUser, logoutUser, updateUser } from '@store/users';
	import { onMount } from 'svelte';

	export let isToView = true;
	export let pagetype = 'profile';
	const userDefault = {
		id: '',
		username: '',
		email: '',
		password: '',
		passwordConfirmation: '',
		name: '',
		avatar: '',
		description: '',
		region: '',
		level: 0,
		verified: 0
	};
	export let user: User = userDefault;

	onMount(async () => {
		const dbInfo = getDbInfo();
		console.log('dbInfo:', dbInfo);
		if (dbInfo.jwt) {
			user = await getUser(dbInfo.uid);
		}
		console.log('after onMount(). user:', user);
	});

	const handleUpdateProfile = async (user: User) => {
		console.log('handleUpdateProfile... user:', user);
		isToView = false;
	};
	const handleUpdate = async (user: User) => {
		console.log('handleUpdate... user:', user);
		isToView = true;
    await updateUser(user);
	};
	const handleLogout = async () => {
		console.log('handleLogout');
		await logoutUser();
		goto('/auth/login');
	};
  const handlerDeleteUser = async (user: User) => {
		console.log('handlerDeleteUser... user:', user);
    await deleteUser(user) 
	};
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
    <h1 class="h1">{capitalizeFirst(pagetype)}</h1>
	</div>
</div>

<div class="card p-4 mx-auto w-96 space-y-4 mt-5">
	{#if isToView}
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">
			<span>Username: {user.username}</span>
		</label>
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">
			<span>Email: {user.email}</span>
		</label>
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">
			<span>Password: {user.password}</span>
		</label>
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">
			<span>Name: {user.name}</span>
		</label>
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">
			<span>Avatar: {user.avatar}</span>
		</label>
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">
			<span>Region: {user.region}</span>
		</label>
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">
			<span>Description: {user.description}</span>
		</label>
	{:else}
		<label class="label">
			<span>Username</span>
			<input
				class="input"
				type="text"
				placeholder="Enter name here..."
				bind:value={user.username}
			/>
		</label>
		<label class="label">
			<span>Email</span>
			<input class="input" type="text" placeholder="Enter email here..." bind:value={user.email} />
		</label>
		<label class="label">
			<span>Password</span>
			<input
				class="input"
				type="text"
				placeholder="Enter password here..."
				bind:value={user.password}
			/>
		</label>
		<label class="label">
			<span>Password Confirmation</span>
			<input
				class="input"
				type="text"
				placeholder="Enter password confirmation here..."
				bind:value={user.passwordConfirmation}
			/>
		</label>
		<label class="label">
			<span>Name</span>
			<input class="input" type="text" placeholder="Enter name here..." bind:value={user.name} />
		</label>
		<label class="label">
			<span>Avatar</span>
			<input
				class="input"
				type="text"
				placeholder="Enter avatar here..."
				bind:value={user.avatar}
			/>
		</label>
		<label class="label">
			<span>Region</span>
			<select class="select" bind:value={user.region}>
				<option value="Antarctica">Antarctica</option>
				<option value="EastAsia">East Asia</option>
				<option value="SouthAsia">South Asia</option>
				<option value="CentralAsia">Central Asia</option>
				<option value="MiddleEastAsia">Middle East Asia</option>
				<option value="Africa">Africa</option>
				<option value="NorthAmerica">North America</option>
				<option value="SouthAmerica">North America</option>
				<option value="Europe">Europe</option>
			</select>
		</label>
		<label class="label">
			<span>Description</span>
			<textarea
				class="textarea"
				rows="4"
				placeholder="Enter your description here..."
				bind:value={user.description}
			/>
		</label>
	{/if}

	<div class="container h-full mx-auto flex flex-row justify-between">
		{#if isToView}
			<button type="button" class="btn variant-filled-primary" on:click={() => handleUpdateProfile(user)}>
				Update Profile
			</button>
		{:else}
			<button type="button" class="btn variant-filled-primary" on:click={() => handleUpdate(user)}>
				Save
			</button>
		{/if}

		<button type="button" class="btn variant-ghost-error" on:click={() => handlerDeleteUser(user)}>
			Delete User
		</button>
		<button type="button" class="btn variant-ghost-error" on:click={() => handleLogout()}>
			Logout
		</button>
	</div>
</div>
