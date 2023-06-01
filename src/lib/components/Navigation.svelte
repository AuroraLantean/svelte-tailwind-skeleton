<script lang="ts">
	import { drawerStore } from '@skeletonlabs/skeleton';

	function drawerClose(): void {
		drawerStore.close();
	}
</script>

<nav class="list-nav p-4">
	<ul>
		<li><a href="/" on:click={drawerClose}>Note List</a></li>
		<li><a href="/new" on:click={drawerClose}>New note</a></li>
		<li><a href="/contactlist" on:click={drawerClose}>ContactList</a></li>
		<li><a href="/?test=3" on:click={drawerClose}>Other Page 3</a></li>
	</ul>
</nav>
