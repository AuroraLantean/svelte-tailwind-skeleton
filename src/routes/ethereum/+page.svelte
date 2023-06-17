<script lang="ts">
	import { onMount } from 'svelte';
	import { toastStore, type ToastSettings, ProgressRadial } from '@skeletonlabs/skeleton';
	import { EvmChain } from '@moralisweb3/common-evm-utils';
	import { getChainStr } from '@store/lib';
  import { PUBLIC_ADDR } from "$env/static/public";
  console.log("PUBLIC_ADDR:", PUBLIC_ADDR);
  
	let chainObj = EvmChain.ETHEREUM;
	let addr = PUBLIC_ADDR;
	let nativeBalance: any;
	let tokenBalances: any;
	let nftmetadata: any;
	//------------------------==
	// Global states
	export let pagetype = 'Ethereum Related Chains';
	let networkStatus = '';
	let contractAddr = '';
	let priceOut = '';
	let receipt = '';
	let setPriceInput = '1';
	let tokBal = '';
	let ethBal = '';
	const lg = console.log;
	let res: any;
	let t: ToastSettings;
	let data: any;
	let chainStr = '';
	let getNativeBalance_loading = false;
	let getBalances_loading = false;
	let getTokenbalances_loading = false;
	let getNftmetadata_loading = false;

	let buyToken_loading = false;
	let getPrice_loading = false;
	let setPrice_loading = false;

	let isAfterLoadEvent = false;
	lg('isAfterLoadEvent: ' + isAfterLoadEvent);
	const inputDefault = {
		userAddr: '',
		tokenAddr: '',
		toAddr: '',
		fromAddr: '',
		chainName: 'ethereum',
		amount1: 0,
		amount2: 0
	};
	export let input = inputDefault;
	const resetInput = () => {
		input.userAddr = '';
		input.tokenAddr = '';
		input.toAddr = '';
		input.fromAddr = '';
		input.chainName = '';
		input.amount1 = 0;
		input.amount2 = 0;
	};
	const handleGetData = async (input: TxnInput) => {
		console.log('handleGetData() ... input:', input);
		//await addUser(input);
		//goto('/auth/login');
	};
	onMount(async () => {
		lg('onMount');
		isAfterLoadEvent = true;
		lg('isAfterLoadEvent: ' + isAfterLoadEvent);
		chainStr = getChainStr(chainObj);
		lg('addr: ', addr, ', chainStr: ', chainStr);
		lg(chainStr === '0x1');
	});
	export const getToastErr = (err: string): ToastSettings => {
		return {
			message: 'Transaction failed. Error message: ' + err,
			background: 'variant-filled-error',
			timeout: 5000
		};
	};
	export const getToastOk = (): ToastSettings => {
		return {
			message: 'Transaction processed successfully!',
			background: 'variant-filled-success',
			timeout: 5000
		};
	};

	const getBalances = async () => {
		lg('getBalances()');
		getBalances_loading = true;
		await getNativeBalance();
		//await getTokenBals();
		getBalances_loading = false;
	};

	const getNativeBalance = async () => {
		lg('getNativeBalance()');
		getNativeBalance_loading = true;
		chainStr = getChainStr(chainObj);
		lg('addr:', addr, ', chainStr: ', chainStr);
		const res = await fetch(`/api/${chainStr}/${addr}/nativebalance`);
    lg('nativebalance res:', res);
		nativeBalance = await res.json();//string
		lg('nativeBalance:', nativeBalance, typeof nativeBalance);
		getNativeBalance_loading = false;
	};
	const getTokenbalances = async () => {
		lg('getTokenbalances()');
		getTokenbalances_loading = true;
		chainStr = getChainStr(chainObj);
		lg('addr:', addr, ', chainStr: ', chainStr);
		const res = await fetch(`/api/${chainStr}/${addr}/tokenbalances`);
		tokenBalances = await res.json();//array of xyz
		lg('tokenBalances:', tokenBalances, typeof tokenBalances);
		getTokenbalances_loading = false;
	};
	const getNftmetadata = async () => {
		lg('getNftmetadata()');
		getNftmetadata_loading = true;
		chainStr = getChainStr(chainObj);
		lg('addr:', addr, ', chainStr: ', chainStr);
		const res = await fetch(`/api/${chainStr}/${addr}/nftmetadata`);
		nftmetadata = await res.json();//array of xyz
		lg('nftmetadata:', nftmetadata, typeof nftmetadata);
		getNftmetadata_loading = false;
	};

	//Write Functions
	const buyGumballHandler = async () => {
		lg('buyGumballHandler()');
		buyToken_loading = true;
		//res = await buyGumball(rdt, userAddr, compoAddr);
		buyToken_loading = false;
		if (res.error) {
			t = getToastErr(JSON.stringify(res.error));
			toastStore.trigger(t);
			return true;
		}
		t = getToastOk();
		toastStore.trigger(t);

		receipt = JSON.stringify(res.txn, null, 2);
		//tokBal = await getTokenBalance(userAddr, tokenAddr);
		//ethBal = await getethBal(userAddr);
	}; //buyGumballHandler

	const getPriceHandler = async () => {
		lg('getPriceHandler()');
		getPrice_loading = true;
		//res = await getPrice(rdt, compoAddr);
		getPrice_loading = false;
		if (res.error) {
			t = getToastErr(JSON.stringify(res.error));
			toastStore.trigger(t);
			return true;
		}
		t = getToastOk();
		toastStore.trigger(t);

		priceOut = res.data;
		lg('priceOut:', priceOut);
	}; //GetPrice

	const setPriceHandler = async () => {
		lg('setPriceHandler()');
		setPrice_loading = true;
		//res = await setPrice(rdt, userAddr, compoAddr, admin_badge, setPriceInput);
		setPrice_loading = false;
		if (res.error) {
			t = getToastErr(JSON.stringify(res.error));
			toastStore.trigger(t);
			return true;
		}
		t = getToastOk();
		toastStore.trigger(t);

		//priceOut = res.data;
		//lg('priceOut:', priceOut);
	}; //setPriceHandler
</script>

<!-- HTML Elements -->

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">{pagetype.charAt(0).toUpperCase() + pagetype.slice(1)}</h1>
	</div>
</div>

<div class="card mt-4 p-4 w-full text-token space-y-4">
	{#if isAfterLoadEvent}
		<div class="flex flex-col">
			<div class="mt-2">Network: {networkStatus}</div>
			<div class="mt-2">User Address: {input.userAddr}</div>
		</div>
	{/if}
</div>


<div class="card p-4 mx-auto w-96 space-y-4 mt-3">
	<label class="label">
		<span>Token Address</span>
		<input
			class="input"
			type="text"
			placeholder="Enter token address here..."
			bind:value={input.tokenAddr}
		/>
	</label>
	<label class="label">
		<span>To Address</span>
		<input
			class="input"
			type="text"
			placeholder="Enter to address here..."
			bind:value={input.tokenAddr}
		/>
	</label>
	<label class="label">
		<span>Amount1</span>
		<input
			class="input"
			type="text"
			placeholder="Enter amount1 here..."
			bind:value={input.amount1}
		/>
	</label>
	<label class="label">
		<span>Chain Name</span>
		<select class="select" bind:value={input.chainName}>
			<option value="ethereum">Ethereum Mainnet</option>
			<option value="sepolia">Sepolia</option>
			<option value="polygon">Polygon</option>
		</select>
	</label>

	<div class="container h-full mx-auto flex flex-row justify-between">
		<button
			type="button"
			class="btn variant-filled-primary"
			on:click={() => {
				handleGetData(input);
				resetInput();
			}}
		>
			Send Transaction
		</button>

		<button
			type="button"
			class="btn variant-ghost-error"
			on:click={() => {
				resetInput();
			}}
		>
			Cancel
		</button>
	</div>
</div>


<div class="card mt-4 p-4 w-full text-token space-y-4">
	<div class="flex flex-row">
		{#if getNativeBalance_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-14"
			/>
		{:else}
			<button type="button" class="btn variant-filled-secondary" on:click={() => getNativeBalance()}
				>Get Native Balance</button
			>
		{/if}
		<div class="mt-2 ml-2">
			Native Balance: {nativeBalance}
		</div>
	</div>

	<div class="flex flex-row">
		{#if getTokenbalances_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-14"
			/>
		{:else}
			<button type="button" class="btn variant-filled-secondary" on:click={() => getTokenbalances()}
				>Get Token Balances</button
			>
		{/if}
		<div class="mt-2 ml-2">
			Token Balances: {tokenBalances}
		</div>
	</div>

	<div class="flex flex-row">
		{#if getNftmetadata_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-14"
			/>
		{:else}
			<button type="button" class="btn variant-filled-secondary" on:click={() => getNftmetadata()}
				>Get NFT Metadata</button
			>
		{/if}
		<div class="mt-2 ml-2">
			NFT Metadata: {nftmetadata}
		</div>
	</div>

	<div class="flex flex-row">
		{#if buyToken_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-16"
			/>
		{:else}
			<button type="button" class="btn variant-filled-error" on:click={buyGumballHandler}
				>Buy 1 Token</button
			>
		{/if}
	</div>

	<div class="container">
		<p>
			Receipt:<br />
		</p>
		<pre class="pre">{receipt}
		</pre>
	</div>

	<div class="flex flex-row">
		{#if getPrice_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-14"
			/>
		{:else}
			<button type="button" class="btn variant-filled-secondary" on:click={getPriceHandler}
				>Get Price</button
			>
		{/if}
		<div class="mt-2">
			Price from GetPrice: {priceOut}
		</div>
	</div>

	<div class="flex flex-row">
		<input type="text" placeholder="New Price" bind:value={setPriceInput} />
		{#if setPrice_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-14"
			/>
		{:else}
			<button type="button" class="btn variant-filled-error" on:click={setPriceHandler}
				>Set Price</button
			>
		{/if}
		<div class="mt-2">Price from SetPrice: Not returned</div>
	</div>
</div>