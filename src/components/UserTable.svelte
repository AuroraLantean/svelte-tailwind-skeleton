<script lang="ts">
	export let users: User[] = [];
</script>

<div class="overflow-x-auto w-full mt-6">
	<table class="table w-full">
		<!-- head -->
		<thead>
			<tr>
				<th>
					<label>
						<input type="checkbox" class="checkbox" />
					</label>
				</th>
				<th>Name</th>
				<th>Username</th>
				<th>Email</th>
				<th />
			</tr>
		</thead>
		<tbody>
			{#each users as user}
				<tr>
					<th>
						<label>
							<input type="checkbox" class="checkbox" />
						</label>
					</th>
					<td>
						<div class="flex items-center space-x-3">
							<div class="avatar">
								<div class="mask mask-squircle w-12 h-12">
									<img src="https://i.pravatar.cc/150?u={user.name}" alt={user.name} />
								</div>
							</div>
							<div>
								<div class="font-bold">{user.name}</div>
							</div>
						</div>
					</td>
					<td>
						{user.username}
						<br />
						<span class="badge badge-ghost badge-sm">{user.avatar}</span>
					</td>
					<td>{user.email}</td>
					<th>
						<div>
							<input type="hidden" name="id" hidden value={user.id} />
							<button class="btn btn-error text-white btn-xs">Delete</button>
						</div>
					</th>
				</tr>
			{/each}
		</tbody>
		<!-- foot -->
		<tfoot>
			<tr>
				<th />
				<th>Name</th>
				<th>Username</th>
				<th>Email</th>
				<th />
			</tr>
		</tfoot>
	</table>
</div>
