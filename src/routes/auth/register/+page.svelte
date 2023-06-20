<script lang="ts">
	import { goto } from '$app/navigation';
	import { capitalizeFirst } from '@store/lib';
	import { addUser } from '@store/users';

	export let pagetype = 'register new user';
	/*const userDefault = {
		id: '',
		username: 'johndoe',
		email: 'johndoe@gmail.com',
		password: 'johndoe123',
		passwordConfirmation: 'johndoe123',
		name: 'John',
		avatar: '',
		description: '',
		region: 'Antarctica',
		level: 0,
		verified: 0
	};*/
	const userDefault = {
		id: '',
		username: 'janedoe',
		email: 'janedoe@gmail.com',
		password: 'janedoe123',
		passwordConfirmation: 'janedoe123',
		name: 'Jane',
    avatar: '',
		description: '',
		region: 'Antarctica',
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
	const handlerRegister = async (user: User) => {
		console.log('handlerRegister() ... user:', user);
		await addUser(user);
		goto('/auth/login');
	};
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
    <h1 class="h1">{capitalizeFirst(pagetype)}</h1>
	</div>
</div>

<div class="card p-4 mx-auto w-96 space-y-4 mt-5">
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
		<span>Profile Description</span>
		<textarea
			class="textarea"
			rows="4"
			placeholder="Enter your description here..."
			bind:value={user.description}
		/>
	</label>

	<div class="container h-full mx-auto flex flex-row justify-between">
		<button
			type="button"
			class="btn btn-sm variant-filled-primary"
			on:click={() => {
				handlerRegister(user);
				resetUser();
			}}
		>
			Register
		</button>
		<a class="btn variant-ghost-error" href="/auth/login">Go to Login</a>
	</div>
</div>
