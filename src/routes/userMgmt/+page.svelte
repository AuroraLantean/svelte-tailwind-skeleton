<script lang="ts">
	import { Table } from '@skeletonlabs/skeleton';
	import type { TableSource } from '@skeletonlabs/skeleton';
	import { tableMapperValues } from '@skeletonlabs/skeleton';
	import { capitalizeFirst } from '@store/lib';
	import { addUser, deleteUser, getUsers, updateUser } from '@store/users.js';
	import { onMount } from 'svelte';

	export let pagetype = 'User Management';
  let users: User[] = [];//export let data;
  let tableSimple: TableSource;
  onMount(async()=>{
    users = await getUsers();
  })
	$: {
    tableSimple = {
		// A list of heading labels.
		head: ['id', 'username', 'email', 'name', 'avatar'],
		// The data visibly shown in your table body UI.
		body: tableMapperValues(users, ['id', 'username', 'email', 'name', 'avatar']),
		// Optional: The data returned when interactive is enabled and a row is clicked.
		meta: tableMapperValues(users, ['id', 'username', 'email', 'name', 'avatar']),
		// Optional: A list of footer labels.
		foot: ['Total', '', '<code class="code">5</code>']
	};
}
	const userDefault = {
		id: '',
		username: 'abudabi',
		email: 'abu@gmail.com',
		password: 'abudabi1234',
		passwordConfirmation: 'abudabi1234',
		name: 'abudabi',
		avatar: '',
		description: '',
		region: '',
		level: 0,
		verified: 0
	};
	export let user: User = userDefault;
	const resetUser = () => {
		user.username = '';
		user.email = '';
		user.password = '';
		user.passwordConfirmation = '';
		user.name = '';
		user.avatar = '';
		user.description = '';
		user.region = '';
		user.level = 0;
		user.verified = 0;
	};
	const handlerAddUser = async (user: User) => {
		console.log('handlerAddUser... user:', user);
		await addUser(user);
    users = await getUsers();
	};
	const handlerUpdateUser = async (user: User) => {
		console.log('handlerUpdateUser... user:', user);
    await updateUser(user);
    users = await getUsers();
	};
	const handlerDeleteUser = async (user: User) => {
		console.log('handlerDeleteUser... user:', user);
    await deleteUser(user);
    users = await getUsers();
	};
	const mySelectionHandler = (row: any) => {
		console.log('mySelectionHandler..., row:', row);
		console.log('data:', row.detail);
		user = {
			id: row.detail[0],
			username: row.detail[1],
			email: row.detail[2],
			password: '',
			passwordConfirmation: '',
			name: row.detail[3],
			avatar: row.detail[4],
			description: '',
			region: '',
			level: 0,
			verified: 0
		};
	};
</script>

<div class="container h-full flex">
	<div class="space-y-5">
    <h1 class="h1">{capitalizeFirst(pagetype)}</h1>
	</div>
</div>

<div class="card p-4 w-96 space-y-4 mt-5">
	<label class="label">
		<span>Username</span>
		<input class="input" type="text" placeholder="Enter name here..." bind:value={user.username} />
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
		<input class="input" type="text" placeholder="Enter avatar here..." bind:value={user.avatar} />
	</label>

	<div class="container h-full mx-auto flex flex-row justify-between">
		<button
			type="button"
			class="btn btn-sm variant-filled-primary"
			on:click={() => {
				handlerAddUser(user);
				resetUser();
			}}
		>
			Add User
		</button>
		<button
			type="button"
			class="btn btn-sm variant-filled-secondary"
			on:click={() => {
				handlerUpdateUser(user);
				resetUser();
			}}
		>
			Update User
		</button>
		<button
			type="button"
			class="btn btn-sm variant-filled-error"
			on:click={() => {
				handlerDeleteUser(user);
				resetUser();
			}}
		>
			Delete User
		</button>
		<button
			type="button"
			class="btn variant-ghost-error"
			on:click={() => {
				resetUser();
			}}
		>
			Clear
		</button>
	</div>
</div>

<div class="mt-5">
	<Table source={tableSimple} interactive={true} on:selected={mySelectionHandler} />
</div>
