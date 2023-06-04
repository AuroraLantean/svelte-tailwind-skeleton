<script lang="ts">
	import { drawerStore } from '@skeletonlabs/skeleton';

	function drawerClose(): void {
		drawerStore.close();
	}
</script>

<nav class="list-nav p-4">
	<ul>
		<li><a href="/" on:click={drawerClose}>Note List</a></li>
		<li><a href="/newNote" on:click={drawerClose}>New note</a></li>
		<li><a href="/contactlist" on:click={drawerClose}>Contact List</a></li>
		<li><a href="/ecommerce" on:click={drawerClose}>E-Commerce</a></li>
		<li><a href="/marketplace" on:click={drawerClose}>Marketplace</a></li>
		<li><a href="/newItem" on:click={drawerClose}>New Item</a></li>
		<li><a href="/fail" on:click={drawerClose}>Payment failed</a></li>
		<li><a href="/success" on:click={drawerClose}>Payment Succeeded</a></li>
	</ul>
</nav>
