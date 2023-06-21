<script lang="ts">
	import { goto } from '$app/navigation';
	import { capitalizeFirst } from '@store/lib';
	import { loginUser, updateDbInfo } from '@store/users';

	export let pagetype = 'login';
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
	};
	const userDefault = {
    id : '',
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
	};*/
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
	const handlerLogin = async (user: User) => {
		console.log('handlerLogin... user:', user);
		const userInfo = await loginUser(user);
		updateDbInfo('jwt', userInfo.token);
		resetUser();
		goto('/auth/profile');
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
		<input class="input" type="email" placeholder="Enter email here..." bind:value={user.email} />
	</label>
	<label class="label">
		<span>Password</span>
		<input
			class="input"
			type="password"
			placeholder="Enter password here..."
			bind:value={user.password}
		/>
	</label>

	<div class="container h-full mx-auto flex flex-row justify-between">
		<button type="button" class="btn variant-filled-primary" on:click={() => handlerLogin(user)}>
			Login
		</button>
		<a class="btn variant-ghost-error" href="/auth/register">Go to Register User</a>
	</div>
</div>
