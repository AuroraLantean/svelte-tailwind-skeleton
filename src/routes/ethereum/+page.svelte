<script lang="ts">
	import { onMount } from 'svelte';
	import { toastStore, type ToastSettings, ProgressRadial } from '@skeletonlabs/skeleton';
	import { PUBLIC_ADDR } from '$env/static/public';
	import { ethersInit, getBalanceEth, getTokenBalance } from '@store/ethers';
	import { capitalizeFirst, getChainObj } from '@store/lib';
	const lg = console.log;
	lg('PUBLIC_ADDR:', PUBLIC_ADDR);

  let ethBalance = '';
  let tokenBalance = '';
  let tokenAllowance = '';
	let nativeBalance: any = '';
	let tokenBalances: any = '';
	let nftmetadata: any = '';
	let items: any[] = [];
	//------------------------==
	// Global states
	export let pagetype = 'Ethereum Related Chains';
	let chainDetected = '';
	let addrDetected = '';
	let transferResult = '';
	let approveResult = '';
	let receipt = '';
	let setPriceInput = '1';
	let res: any;
	let t: ToastSettings;
	let data: any;
	let ethBalance_loading = false;
	let tokenBalance_loading = false;
	let tokenAllowance_loading = false;
	let getNativeBalance_loading = false;
	let getTokenbalances_loading = false;
	let getNftmetadata_loading = false;
	let handleTransfer_loading = false;
	let handleApprove_loading = false;
	let sendPost_loading = false;

	let isOnMount = false;
	lg('isOnMount:', isOnMount);
	const inputDefault = {
		chainName: 'sepolia',
		addr1: PUBLIC_ADDR,
		addr2: '',
		tokenAddr: '',
		amount1: '',
		amount2: ''
	};
	export let input = inputDefault;
	const resetInput = () => {
		input.chainName = '';
		input.addr1 = '';
		input.addr2 = '';
		input.tokenAddr = '';
		input.amount1 = '';
		input.amount2 = '';
	};
	onMount(async () => {
		lg('onMount');
		isOnMount = true;
		lg('isOnMount:', isOnMount);
		lg('input.addr1: ', input.addr1);
    const out = await ethersInit();
    addrDetected = out[1];
    const [chainObj, chainStr] = getChainObj(out[0]);
    lg('chainObj:', chainObj, ', chainStr:', chainStr);
    chainDetected = capitalizeFirst(chainStr);
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

	const getNativeBalcM = async () => {
		lg('getNativeBalcM()');
		getNativeBalance_loading = true;
		lg('addr:', input.addr1, ', chainName:', input.chainName);
		const res = await fetch(`/api/${input.chainName}/${input.addr1}/nativebalance`);
		lg('nativebalance res:', res);
		nativeBalance = await res.json(); //string
		lg('nativeBalance:', nativeBalance, typeof nativeBalance);
		getNativeBalance_loading = false;
	};
	const getTokbalcsM = async () => {
		lg('getTokbalcsM()');
		getTokenbalances_loading = true;
		lg('addr:', input.addr1, ', chainName:', input.chainName);
		const res = await fetch(`/api/${input.chainName}/${input.addr1}/tokenbalances`);
		tokenBalances = await res.json(); //array of xyz
		lg('tokenBalances:', tokenBalances, typeof tokenBalances);
		getTokenbalances_loading = false;
	};
	const getNftmetadataM = async () => {
		lg('getNftmetadataM()');
		getNftmetadata_loading = true;
		lg('addr:', input.addr1, ', chainName:', input.chainName);
		const res = await fetch(`/api/${input.chainName}/${input.addr1}/nftmetadata`);
		nftmetadata = await res.json(); //array of xyz
		lg('nftmetadata:', nftmetadata, typeof nftmetadata);
		getNftmetadata_loading = false;
	};

  const handleTransfer = async (input: TxnInput) => {
		lg('handleTransfer() ... input:', input);
		handleTransfer_loading = true;
		if (res.error) {
			t = getToastErr(JSON.stringify(res.error));
			toastStore.trigger(t);
			return true;
		}
		t = getToastOk();
		toastStore.trigger(t);
		receipt = JSON.stringify(res.txn, null, 2);
		handleTransfer_loading = false;

	};
	const handleApprove = async (input: TxnInput) => {
		lg('handleApprove() ... input:', input);
	};
	const handleEthBalance = async (input: TxnInput) => {
		lg('handleEthBalance() ... input:', input);
    ethBalance_loading = true;
    const balns = await getBalanceEth(input.addr1);
    lg('balances:', balns);
    ethBalance = balns[0];
    ethBalance_loading = false;
	};
	const handleTokenBalance = async (input: TxnInput) => {
		lg('handleTokenBalance() ... input:', input);
    tokenBalance_loading = true;
    tokenBalance = await getTokenBalance(input.addr1);
    lg('tokenBalance:', tokenBalance);
    tokenBalance_loading = false;

	};
	const handleAllowance = async (input: TxnInput) => {
		lg('handleAllowance() ... input:', input);
	};

	const sendPost = async () => {
		lg('sendPost()...');
		sendPost_loading = true;
		const amount = '10';
		const res = await fetch('/apiEndpoint', {
			method: 'POST',
			body: JSON.stringify({ amount }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const { id } = await res.json();
		items = [
			...items,
			{
				id,
				amount
			}
		];
		sendPost_loading = false;
		// if (res.error) {
		// 	t = getToastErr(JSON.stringify(res.error));
		// 	toastStore.trigger(t);
		// 	return true;
		// }
		t = getToastOk();
		toastStore.trigger(t);
	}; //sendPost
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">{capitalizeFirst(pagetype)}</h1>
	</div>
</div>

<div class="card mt-4 p-4 w-full text-token space-y-4">
	{#if isOnMount}
		<div class="flex flex-col">
			<div class="mt-2">Detected Chain: {chainDetected}</div>
			<div class="mt-2">Detected Address: {addrDetected}</div>
		</div>
	{/if}
</div>

<div class="card p-4 mx-auto w-96 space-y-4 mt-3">
	<label class="label">
		<span>Network</span>
		<select class="select" bind:value={input.chainName}>
			<option value="ethereum">Ethereum Mainnet</option>
			<option value="sepolia">Sepolia</option>
			<option value="goerli">Goerli</option>
			<option value="polygon">Polygon</option>
			<option value="mumbai">Mumbai</option>
			<option value="bsc">BSC</option>
			<option value="bsc_testnet">BSC_Testnet</option>
			<option value="avalanche">Avalanche</option>
			<option value="fantom">Fantom</option>
			<option value="cronos">Cronos</option>
			<option value="palm">Palm</option>
			<option value="arbitrum">Arbitrum</option>
		</select>
	</label>
	<label class="label">
		<span>Address1</span>
		<input
			class="input"
			type="text"
			placeholder="Enter address1 here..."
			bind:value={input.addr1}
		/>
	</label>
	<label class="label">
		<span>Address2</span>
		<input
			class="input"
			type="text"
			placeholder="Enter address2 here..."
			bind:value={input.addr2}
		/>
	</label>
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
		<span>Amount1</span>
		<input
			class="input"
			type="text"
			placeholder="Enter amount1 here..."
			bind:value={input.amount1}
		/>
	</label>
</div>

<div class="card mt-4 p-4 w-full text-token space-y-4">
	<div class="flex flex-row">
		{#if ethBalance_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-14"
			/>
		{:else}
			<button type="button" class="btn variant-filled-primary" on:click={() => handleEthBalance(input)}
				>Get ETH Balance</button
			>
		{/if}
		<div class="mt-2 ml-2">
			ETH Balance: {ethBalance}
		</div>
	</div>
	<div class="flex flex-row">
		{#if tokenBalance_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-14"
			/>
		{:else}
			<button type="button" class="btn variant-filled-primary" on:click={() => handleTokenBalance(input)}
				>Get Token Balance</button
			>
		{/if}
		<div class="mt-2 ml-2">
			Token Balance: {tokenBalance}
		</div>
	</div>

	<div class="flex flex-row">
		{#if tokenAllowance_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-14"
			/>
		{:else}
			<button type="button" class="btn variant-filled-primary" on:click={() => handleAllowance(input)}
				>Get Token Allowance</button
			>
		{/if}
		<div class="mt-2 ml-2">
			Token Allowance: {tokenAllowance}
		</div>
	</div>

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
			<button type="button" class="btn variant-filled-secondary" on:click={() => getNativeBalcM()}
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
			<button type="button" class="btn variant-filled-secondary" on:click={() => getTokbalcsM()}
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
			<button type="button" class="btn variant-filled-secondary" on:click={() => getNftmetadataM()}
				>Get NFT Metadata</button
			>
		{/if}
		<div class="mt-2 ml-2">
			NFT Metadata: {nftmetadata}
		</div>
	</div>

	<div class="flex flex-row">
		{#if handleTransfer_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-16"
			/>
		{:else}
			<button type="button" class="btn variant-filled-error" on:click={() => handleTransfer(input)}
				>Transfer Token</button
			>
		{/if}
    <div class="mt-2 ml-2">
			{transferResult}
		</div>
	</div>

	<div class="container">
		<p>
			Receipt:<br />
		</p>
		<pre class="pre">{receipt}
		</pre>
	</div>

	<div class="flex flex-row">
		{#if handleApprove_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-14"
			/>
		{:else}
			<button type="button" class="btn variant-filled-error" on:click={() => handleApprove(input)}
				>Approve Allowance</button
			>
		{/if}
		<div class="mt-2 ml-2">
			{approveResult}
		</div>
	</div>

</div>
