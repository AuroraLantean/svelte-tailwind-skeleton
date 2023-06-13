<script lang="ts">
  const userDefault = {
    id : '',
		name: '',
    email: '',
    description: '',
    region: '',
    level: 0,
		verified: 0
	};
	export let user: User = userDefault;
  const resetUser = () => { 
    user.name = "";
    user.email = "";
  }
  const loginUser = (user: User) => {
    console.log(user)
  }
</script>

<div class="card p-4 mx-auto w-96 space-y-4">
  <header class="card-header text-center font-extrabold">Login</header>
	<label class="label">
		<span>Username</span>
		<input
			class="input"
			type="text"
			placeholder="Enter name here..."
			bind:value={user.name}
		/>
	</label>
	<label class="label">
		<span>Email</span>
		<input
			class="input"
			type="text"
			placeholder="Enter email here..."
			bind:value={user.email}
		/>
	</label>

  <button
  type="button"
  class="btn btn-sm variant-filled-primary"
  on:click={() => {
    loginUser(user); resetUser();}}
>
  Login
</button>
</div>
