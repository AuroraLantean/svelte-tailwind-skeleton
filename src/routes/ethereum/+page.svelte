<script lang="ts">
	import { onMount } from 'svelte';
	import { toastStore, type ToastSettings, ProgressRadial } from '@skeletonlabs/skeleton';
	import { PUBLIC_ADDR } from '$env/static/public';
	import { ethersInit, getBalanceEth, erc20BalanceOf, erc20Transfer, erc20Approve, erc20Allowance, erc721Transfer, erc721BalanceOf } from '@store/ethers';
	import { capitalizeFirst, getChainObj } from '@store/lib';
  import goldcoin from "@contracts/goldcoin.json";
  import dragonNft from "@contracts/erc721Dragon.json";

	const lg = console.log;
	lg('PUBLIC_ADDR:', PUBLIC_ADDR, ', goldcoin addr:', goldcoin.address, ', dragonNft addr:', dragonNft.address );

  let ethBalance = '';
  let tokenBalance = '';
  let nftBalance = '';
  let txnHash_transfer20 = '';
  let txnHash_transfer721 = '';
  let txnHash_approve20 = '';
  let tokenAllowance = '';
	let nativeBalance: any = '';
	let tokenBalances: any = '';
	let nftmetadata: any = '';
	let items: any[] = [];
	let chainDetected = '';
	let addrDetected = '';
	let receipt = '';
	//------------------------==
	export let pagetype = 'Ethereum Related Chains';
  export let ctrtName = 'goldcoin';
	let res: any;
	let t: ToastSettings;
	let data: any;
	let ethBalance_loading = false;
	let hErc20BalanceOf_loading = false;
	let tokenAllowance_loading = false;
	let getNativeBalance_loading = false;
	let getTokenbalances_loading = false;
	let getNftmetadata_loading = false;
	let hErc20Transfer_loading = false;
	let hErc20Approve_loading = false;
	let hErc721Transfer_loading = false;
	let hErc721BalanceOf_loading = false;
	let sendPost_loading = false;

	let isOnMount = false;
	lg('isOnMount:', isOnMount);
	const inputDefault = {
		chainName: 'sepolia',
		ctrtAddr: '',
		addr1: '',
		addr2: PUBLIC_ADDR,
		amount1: '',
		amount2: ''
	};
	export let input = inputDefault;
	const resetInput = () => {
		input.chainName = '';
		input.ctrtAddr = '';
		input.addr1 = '';
		input.addr2 = '';
		input.amount1 = '';
		input.amount2 = '';
	};
	onMount(async () => {
		lg('onMount');
		isOnMount = true;
		lg('isOnMount:', isOnMount);
    chainDetected = capitalizeFirst('unknown');

    const out = await ethersInit();
    if (out.err) {
      t = getToastErr(JSON.stringify(out.err));
			toastStore.trigger(t);
			return true;
		}
    if (out.warn) {
      t = getToastWarn(JSON.stringify(out.warn));
			toastStore.trigger(t);
			return true;
		}
		t = getToastOk('web3 initialized successfully!');
		toastStore.trigger(t);

    addrDetected = out.account;
    input.addr1 = addrDetected;
		lg('input.addr1: ', input.addr1, ', input.addr2: ', input.addr2);
    const [chainObj, chainStr] = getChainObj(out.chainId);
    lg('chainObj:', chainObj, ', chainStr:', chainStr);
    chainDetected = capitalizeFirst(chainStr);
  });
  $: {
    input.ctrtAddr = getCtrtAddr(ctrtName);
  }
  export const getCtrtAddr = (ctrtName: string): string => {
    let ctrtAddr = '';
    switch (ctrtName) {
      case 'goldcoin':
        ctrtAddr = goldcoin.address;
        break;
      case 'erc721Dragon':
        ctrtAddr = dragonNft.address;
        break;
    }
    lg('getCtrtAddr()... ctrtAddr', ctrtAddr);
    return ctrtAddr;
	};

  export const getToastErr = (err: string): ToastSettings => {
		return {
			message: 'Transaction failed. Error message: ' + err,
			background: 'variant-filled-error',
			timeout: 5000
		};
	};
	export const getToastOk = (mesg: string = 'Transaction processed successfully!'): ToastSettings => {
		return {
			message: 'Success. '+ mesg,
			background: 'variant-filled-success',
			timeout: 5000
		};
	};
	export const getToastWarn = (mesg: string = ''): ToastSettings => {
		return {
			message: 'Warn: '+ mesg,
			background: 'variant-filled-warning',
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
		const out = await res.json(); //array of xyz
    lg('out:', out)
    nftmetadata = JSON.stringify(out);
		lg('nftmetadata:', nftmetadata, typeof nftmetadata);
		getNftmetadata_loading = false;
	};

  const hErc20Transfer = async (input: TxnInput) => {
		lg('hErc20Transfer() ... input:', input);
		hErc20Transfer_loading = true;
		const out = await erc20Transfer(input);
    if (out.err) {
      t = getToastErr(JSON.stringify(out.err));
			toastStore.trigger(t);
      hErc20Transfer_loading = false;
			return true;
		}
		t = getToastOk('');
		toastStore.trigger(t);
    txnHash_transfer20 = out.txnHash;
		hErc20Transfer_loading = false;
	};
	const hErc20Approve = async (input: TxnInput) => {
		lg('hErc20Approve() ... input:', input);
		hErc20Approve_loading = true;
		const out = await erc20Approve(input);
    if (out.err) {
      t = getToastErr(JSON.stringify(out.err));
			toastStore.trigger(t);
      hErc20Approve_loading = false;
			return true;
		}
		t = getToastOk('');
		toastStore.trigger(t);
		txnHash_approve20 = out.txnHash;
		hErc20Approve_loading = false;
	};
  const hErc721Transfer = async (input: TxnInput) => {
		lg('hErc721Transfer() ... input:', input);
		hErc721Transfer_loading = true;
		const out = await erc721Transfer(input);
    if (out.err) {
      t = getToastErr(JSON.stringify(out.err));
			toastStore.trigger(t);
      hErc721Transfer_loading = false;
			return true;
		}
		t = getToastOk('');
		toastStore.trigger(t);
		txnHash_transfer721 = out.txnHash;
		hErc721Transfer_loading = false;
	};
	const handleEthBalance = async (input: TxnInput) => {
		lg('handleEthBalance() ... input:', input);
    ethBalance_loading = true;
    const out = await getBalanceEth(input.addr1);
    if (out.err) {
      t = getToastErr(JSON.stringify(out.err));
			toastStore.trigger(t);
      ethBalance_loading = false;
			return true;
		}
		t = getToastOk('balance: '+ out.str);
		toastStore.trigger(t);
    ethBalance = out.str;
    ethBalance_loading = false;
	};
	const hErc20BalanceOf = async (input: TxnInput) => {
		lg('hErc20BalanceOf() ... input:', input);
    hErc20BalanceOf_loading = true;
    const out = await erc20BalanceOf(input);
    if (out.err) {
      t = getToastErr(JSON.stringify(out.err));
			toastStore.trigger(t);
      hErc20BalanceOf_loading = false;
			return true;
		}
		t = getToastOk('balance: '+ out.str);
		toastStore.trigger(t);
    tokenBalance = out.str;
    lg('tokenBalance:', tokenBalance);
    hErc20BalanceOf_loading = false;
	};
	const hErc721BalanceOf = async (input: TxnInput) => {
		lg('hErc721BalanceOf() ... input:', input);
    hErc721BalanceOf_loading = true;
    const out = await erc721BalanceOf(input);
    if (out.err) {
      t = getToastErr(JSON.stringify(out.err));
			toastStore.trigger(t);
      hErc721BalanceOf_loading = false;
			return true;
		}
		t = getToastOk('balance: '+ out.str);
		toastStore.trigger(t);
    nftBalance = out.str;
    lg('nftBalance:', nftBalance);
    hErc721BalanceOf_loading = false;
	};
	const hErc20Allowance = async (input: TxnInput) => {
		lg('hErc20Allowance() ... input:', input);
    tokenAllowance_loading = true;
    const out = await erc20Allowance(input);
    if (out.err) {
      t = getToastErr(JSON.stringify(out.err));
			toastStore.trigger(t);
      tokenAllowance_loading = false;
			return true;
		}
		t = getToastOk('allowance: '+ out.str);
		toastStore.trigger(t);
    tokenAllowance = out.str;
    lg('tokenAllowance:', tokenAllowance);
    tokenAllowance_loading = false;
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
		<span>Contract</span>
		<select class="select" bind:value={ctrtName}>
			<option value="goldcoin">ERC20 Gold Coin</option>
			<option value="erc721Dragon">ERC721 Dragon NFT</option>
		</select>
    <span>Contract Addr:</span>
    <input class="input" title="Contract Addr" type="text" bind:value={input.ctrtAddr} />
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
		<span>Amount1 in Ether(1e18 Wei) // TokenId</span>
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
			ETH Balance: {ethBalance} in Ether(1e18 Wei)
		</div>
	</div>
	<div class="flex flex-row">
		{#if hErc20BalanceOf_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-14"
			/>
		{:else}
			<button type="button" class="btn variant-filled-primary" on:click={() => hErc20BalanceOf(input)}
				>Get Token Balance</button
			>
		{/if}
		<div class="mt-2 ml-2">
			Token Balance: {tokenBalance} in Ether(1e18 Wei)
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
			<button type="button" class="btn variant-filled-primary" on:click={() => hErc20Allowance(input)}
				>Get Token Allowance</button
			>
		{/if}
		<div class="mt-2 ml-2">
			Token Allowance: {tokenAllowance} in Ether(1e18 Wei)
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
			Native Balance: {nativeBalance} in Ether(1e18 Wei)
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
			Token Balances: {tokenBalances} in Ether(1e18 Wei)
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
		{#if hErc20Transfer_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-16"
			/>
		{:else}
			<button type="button" class="btn variant-filled-error" on:click={() => hErc20Transfer(input)}
				>Transfer ERC20 Tokens</button
			>
		{/if}
    <div class="mt-2 ml-2">
			Txn Hash: {txnHash_transfer20}
		</div>
	</div>

	<div class="flex flex-row">
		{#if hErc20Approve_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-14"
			/>
		{:else}
			<button type="button" class="btn variant-filled-error" on:click={() => hErc20Approve(input)}
				>Approve ERC20 Allowance</button
			>
		{/if}
    <div class="mt-2 ml-2">
			Txn Hash: {txnHash_approve20}
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
		{#if hErc721BalanceOf_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-14"
			/>
		{:else}
			<button type="button" class="btn variant-filled-primary" on:click={() => hErc721BalanceOf(input)}
				>Get NFT Balance</button
			>
		{/if}
		<div class="mt-2 ml-2">
			NFT Balance: {nftBalance}
		</div>
	</div>
  <div class="flex flex-row">
		{#if hErc721Transfer_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-16"
			/>
		{:else}
			<button type="button" class="btn variant-filled-error" on:click={() => hErc721Transfer(input)}
				>Transfer 1 ERC721 NFT</button
			>
		{/if}
    <div class="mt-2 ml-2">
			Txn Hash: {txnHash_transfer721}
		</div>
	</div>
</div>
