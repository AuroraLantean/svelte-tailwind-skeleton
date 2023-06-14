<script lang="ts">
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
	};
	export let user: User = userDefault;

  const updateUser = (user: User) => {
    console.log(user)
  }
</script>

<div class="card p-4 mx-auto w-96 space-y-4">
  <header class="card-header text-center font-extrabold">Update User</header>
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
		<input
			class="input"
			type="text"
			placeholder="Enter email here..."
			bind:value={user.email}
		/>
	</label>
	<label class="label">
		<span>Region</span>
		<select class="select" bind:value={user.region}>
			<option value="East Asia">East Asia</option>
			<option value="South Asia">South Asia</option>
			<option value="Central Asia">Central Asia</option>
			<option value="Middle East Asia">Middle East Asia</option>
			<option value="Africa">Africa</option>
			<option value="North America">North America</option>
			<option value="South America">North America</option>
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

  <button
  type="button"
  class="btn btn-sm variant-filled-primary"
  on:click={() => {
    updateUser(user)}}
>
  Update
</button>
</div>
