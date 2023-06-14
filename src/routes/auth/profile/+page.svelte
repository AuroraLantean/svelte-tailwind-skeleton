<script lang="ts">
	import { goto } from "$app/navigation";
	import { getDbInfo, getUser, logoutUser } from "@store/users";
	import { onMount } from "svelte";

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
  onMount(async()=>{
    const dbInfo = getDbInfo();
    console.log('dbInfo:', dbInfo);
    user = await getUser(dbInfo.uid);
    console.log('after onMount(). user:', user)
  })

	const handleUpdate = async (user: User) => {
		console.log('handleUpdate... user:', user);
	};
	const handleLogout = async () => {
		console.log('handleLogout');
    await logoutUser();
    goto('/auth/login');
	};
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">{pagetype.charAt(0).toUpperCase() + pagetype.slice(1)}</h1>
	</div>
</div>

<div class="card p-4 mx-auto w-96 space-y-4 mt-5">
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

  <div class="container h-full mx-auto flex flex-row justify-between">
    <button type="button" class="btn variant-filled-primary" on:click={() => handleUpdate(user)}>
      Update
    </button>
    <button type="button" class="btn variant-ghost-error" on:click={() => handleLogout()}>
      Logout
    </button>
  </div>
</div>
