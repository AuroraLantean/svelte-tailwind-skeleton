<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { toastStore, type ToastSettings, ProgressRadial } from '@skeletonlabs/skeleton';
	import { RadixDappToolkit } from '@radixdlt/radix-dapp-toolkit';
	import {
		buyGumball,
		getPrice,
		getTokenBalance,
		getXrdBalance,
		instantiateComponent,
		mintStaffBadge,
		setPrice,
		withdrawEarnings
	} from '../../store/radix';

	//------------------------==
	const dAppId = 'account_tdx_c_1pyu3svm9a63wlv6qyjuns98qjsnus0pzan68mjq2hatqejq9fr';

	// Global states
	let radixStatus = '';
	let accountName = '';
	let userAccountAddr = '';
	let packageAddress = '';
	let gumballSymbol = '';
	let staffBadge = '';
	let withdrawnAmt = '';
	let priceOutFromGetPrice = '';
	let priceOutFromSetPrice = '';
	let receipt = '';
	let setPriceInput = '1';
	let gumballBalance = '';
	let xrdBalance = '';
	const lg = console.log;
	let res: BcResult;
	let feePaid = '';
	let t: ToastSettings;
	let data: any;
	let instantiateCompo_loading = false;
	let getBalances_loading = false;
	let buyGumball_loading = false;
	let getPrice_loading = false;
	let setPrice_loading = false;
	let withdrawEarnings_loading = false;
	let mintStaffBadge_loading = false;
	//After deploying the package
	let packageAddressOut = 'package_tdx_c_1qqy67sxv4e2nvls059cutjn5rk8edcvh3a4da7zusgusmkeahk';
	let packageOwnerBadge = 'resource_tdx_c_1q27nneue67zpuxw6h96j3m86wdhxav8n8q6zymkpfuksxjlcz7';

	let compoAddr = 'component_tdx_c_1qwm335s7ve7ltfjzpz2z65cfufruwll4lr4cml7xgccq8dfadn'; //GumballMachine component address
	let tokenAddress = 'resource_tdx_c_1qyagrng5scvzjg7lz8cyfqhypew7qekja3zwww74g74qtpkjf0'; // GUM resource address

	let admin_badge = 'resource_tdx_c_1qxm335s7ve7ltfjzpz2z65cfufruwll4lr4cml7xgccqdvmngg';

	let isAfterLoadEvent = false;
	let rdt: any;
	lg('isAfterLoadEvent: ' + isAfterLoadEvent);
	onMount(async () => {
		lg('onMount');
		isAfterLoadEvent = true;
		lg('isAfterLoadEvent: ' + isAfterLoadEvent);

		rdt = RadixDappToolkit(
			{ dAppDefinitionAddress: dAppId, dAppName: 'GumballMachine' },
			(requestData) => {
				requestData({
					accounts: { quantifier: 'atLeast', quantity: 1 }
				}).map(({ data: { accounts } }) => {
					// add accounts to dApp application state
					lg('account data: ', accounts);
					accountName = accounts[0].label;
					userAccountAddr = accounts[0].address;
				});
			},
			{
				networkId: 12, // 12 is for RCnet 01 for Mainnet
				onDisconnect: () => {
					// clear your application state
				},
				onInit: ({ accounts }) => {
					// set your initial application state
					lg('onInit accounts: ', accounts);
					if (accounts && accounts.length > 0) {
						accountName = accounts[0].label;
						userAccountAddr = accounts[0].address;
						if (accountName && userAccountAddr) {
							radixStatus = 'onInit successful with valid account';
						}
					} else {
						lg('error... accounts:', accounts);
            radixStatus = 'onInit failed. Please install RadixButton and click on the Connect button';
					}
				}
			}
		);
		lg(' Radix dApp Toolkit(rdt): ', rdt);
		if (rdt) {
			radixStatus = 'initialized with unknown accounts';
      lg('radixStatus: '+ radixStatus);
		}

		//gumballBalance = await getTokenBalance(userAccountAddr, tokenAddress);
		//lg('gumballBalance:', gumballBalance);
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

	const instantiateCompo = async () => {
		lg('instantiateCompo()');
		instantiateCompo_loading = true;
		res = await instantiateComponent(packageAddress, userAccountAddr, 1);
		instantiateCompo_loading = false;
		if (res.error) {
			t = getToastErr(JSON.stringify(res.error));
			toastStore.trigger(t);
			return true;
		}
		t = getToastOk();
		toastStore.trigger(t);

		compoAddr = res.data;
	};

	const getBalances = async () => {
		lg('getBalances()');
		getBalances_loading = true;
		gumballBalance = await getTokenBalance(userAccountAddr, tokenAddress);
		xrdBalance = await getXrdBalance(userAccountAddr);
		getBalances_loading = false;
	};

	//Write Functions
	const buyGumballHandler = async () => {
		lg('buyGumballHandler()');
		buyGumball_loading = true;
		res = await buyGumball(rdt, userAccountAddr, compoAddr);
		buyGumball_loading = false;
		if (res.error) {
			t = getToastErr(JSON.stringify(res.error));
			toastStore.trigger(t);
			return true;
		}
		t = getToastOk();
		toastStore.trigger(t);

		receipt = JSON.stringify(res.txn, null, 2);
		gumballBalance = await getTokenBalance(userAccountAddr, tokenAddress);
		xrdBalance = await getXrdBalance(userAccountAddr);
	}; //buyGumballHandler

	const getPriceHandler = async () => {
		lg('getPriceHandler()');
		getPrice_loading = true;
		res = await getPrice(rdt, compoAddr);
		getPrice_loading = false;
		if (res.error) {
			t = getToastErr(JSON.stringify(res.error));
			toastStore.trigger(t);
			return true;
		}
		t = getToastOk();
		toastStore.trigger(t);

		priceOutFromGetPrice = res.data;
		lg('priceOutFromGetPrice:', priceOutFromGetPrice);
	}; //GetPrice

	const setPriceHandler = async () => {
		lg('setPriceHandler()');
		setPrice_loading = true;
		res = await setPrice(rdt, userAccountAddr, compoAddr, admin_badge, setPriceInput);
		setPrice_loading = false;
		if (res.error) {
			t = getToastErr(JSON.stringify(res.error));
			toastStore.trigger(t);
			return true;
		}
		t = getToastOk();
		toastStore.trigger(t);

		priceOutFromSetPrice = res.data;
		lg('priceOutFromSetPrice:', priceOutFromSetPrice);
	}; //setPriceHandler

	const withdrawEarningsHandler = async () => {
		lg('withdrawEarningsHandler()');
		withdrawEarnings_loading = true;
		res = await withdrawEarnings(rdt, userAccountAddr, compoAddr, admin_badge);
		withdrawEarnings_loading = false;
		if (res.error) {
			t = getToastErr(JSON.stringify(res.error));
			toastStore.trigger(t);
			return true;
		}
		t = getToastOk();
		toastStore.trigger(t);

		receipt = res.data;
		lg('receipt:', receipt);
	};

	const mintStaffBadgeHandler = async () => {
		lg('mintStaffBadgeHandler()');
		mintStaffBadge_loading = true;
		res = await mintStaffBadge(rdt, userAccountAddr, compoAddr, admin_badge);
		mintStaffBadge_loading = false;
		if (res.error) {
			t = getToastErr(JSON.stringify(res.error));
			toastStore.trigger(t);
			return true;
		}
		t = getToastOk();
		toastStore.trigger(t);

		receipt = res.data;
		lg('receipt:', receipt);
	};

	const sendTxn = async () => {
		lg('sendTxn()');
		t = {
			message: 'Transaction submitted successfully!',
			background: 'variant-filled-success',
			timeout: 2000
		};
		toastStore.trigger(t);
		goto('/marketplace');
	};
</script>

<!-- HTML Elements -->
<div class="card p-4 w-full text-token space-y-4">
	<h3 class="text-center py-2">Gumball Machine dApp</h3>

	{#if isAfterLoadEvent}
		<div class="flex flex-row justify-between">
			<div class="connectBtn">
				<radix-connect-button />
			</div>
			<div class="mt-2">Radix Network: {radixStatus}</div>
		</div>
	{/if}

	<div class="container">
		<p>Account Name: {accountName}</p>
		<p>Account Address: {userAccountAddr}</p>
	</div>

	<h2>Instantiate Gumball Machine</h2>
	<input type="text" placeholder="Package address" bind:value={packageAddress} />
	<input type="text" placeholder="Gumball Symbol" bind:value={gumballSymbol} />
	<p>
		{#if instantiateCompo_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-14"
			/>
		{:else}
			<button type="button" class="btn btn-sm variant-filled-primary" on:click={instantiateCompo}
				>Instantiate component</button
			>
		{/if}
	</p>

	<div class="container">
		<p>Component Address: {compoAddr}</p>
		<p>Token Address: {tokenAddress}</p>
		<p>admin_badge address: {admin_badge}</p>
	</div>

	<div class="flex flex-row">
		{#if getBalances_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-14"
			/>
		{:else}
			<button type="button" class="btn variant-filled-secondary" on:click={() => getBalances()}
				>Get Balances</button
			>
		{/if}
		<div class="mt-2">
			Balance: {gumballBalance} Tokens, {xrdBalance} XRD
		</div>
	</div>

	<div class="flex flex-row">
		{#if buyGumball_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-16"
			/>
		{:else}
			<button type="button" class="btn variant-filled-error" on:click={buyGumballHandler}
				>Buy 1 Gum Token</button
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
			Price from GetPrice: {priceOutFromGetPrice}
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
		<div class="mt-2">
			Price from SetPrice: {priceOutFromSetPrice}
		</div>
	</div>

	<div class="flex flex-row">
		{#if withdrawEarnings_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-14"
			/>
		{:else}
			<button
				type="button"
				class="btn btn-sm variant-filled-error"
				on:click={withdrawEarningsHandler}>Withdraw Earnings</button
			>
		{/if}
		<div class="mt-1">
			Withdrawn Amount: {withdrawnAmt}
		</div>
	</div>

	<div class="flex flex-row">
		{#if mintStaffBadge_loading}
			<ProgressRadial
				...
				stroke={220}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				width="w-14"
			/>
		{:else}
			<button type="button" class="btn btn-sm variant-filled-error" on:click={mintStaffBadgeHandler}
				>Mint Staff Badge</button
			>
		{/if}
		<div class="mt-1">
			Badge Minted: {staffBadge}
		</div>
	</div>
</div>
