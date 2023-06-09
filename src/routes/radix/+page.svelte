<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
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
	let userAccountAddr = ''; // User account address
	let packageAddress = '';
	let gumballSymbol = '';
	let accountName = 'none';
	let staffBadge = 'none';
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
					} else {
						lg('error... accounts:', accounts);
					}
				}
			}
		);
		lg(' Radix dApp Toolkit(rdt): ', rdt);

		//gumballBalance = await getTokenBalance(userAccountAddr, tokenAddress);
		//lg('gumballBalance:', gumballBalance);
	});
	export const getToastErr = (err: string): ToastSettings => {
		return {
			message: 'Transaction failed. Error message: ' + err,
			background: 'variant-filled-error',
			timeout: 2000
		};
	};
	export const getToastOk = (): ToastSettings => {
		return {
			message: 'Transaction processed successfully!',
			background: 'variant-filled-success',
			timeout: 2000
		};
	};

	const instantiateCompo = async () => {
		lg('instantiateCompo()');
		res = await instantiateComponent(packageAddress, userAccountAddr, 1);
		if (res.error) {
			t = getToastErr(res.error);
			toastStore.trigger(t);
			return true;
		}
		t = getToastOk();
		toastStore.trigger(t);

		compoAddr = res.data;
	};

	const getBalances = async () => {
		lg('getBalances()');
		gumballBalance = await getTokenBalance(userAccountAddr, tokenAddress);
		xrdBalance = await getXrdBalance(userAccountAddr);
	};

	//Write Functions
	const buyGumballHandler = async () => {
		lg('buyGumballHandler()');
		res = await buyGumball(rdt, userAccountAddr, compoAddr);
		if (res.error) {
			t = getToastErr(res.error);
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
		res = await getPrice(rdt, compoAddr);
		if (res.error) {
			t = getToastErr(res.error);
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
		res = await setPrice(rdt, userAccountAddr, compoAddr, admin_badge, setPriceInput);
		if (res.error) {
			t = getToastErr(res.error);
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
		res = await withdrawEarnings(rdt, userAccountAddr, compoAddr, admin_badge);
		if (res.error) {
			t = getToastErr(res.error);
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
		res = await mintStaffBadge(rdt, userAccountAddr, compoAddr, admin_badge);
		if (res.error) {
			t = getToastErr(res.error);
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

<div class="card p-4 w-full text-token space-y-4">
	<h3 class="text-center py-2">Gumball Machine dApp</h3>

	{#if isAfterLoadEvent}
		<div class="connectBtn flex flex-row-reverse">
			<radix-connect-button />
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
		<button type="button" class="btn btn-sm variant-filled-primary" on:click={instantiateCompo}
			>Instantiate component</button
		>
	</p>

	<div class="container">
		<p>Component Address: {compoAddr}</p>
		<p>Token Address: {tokenAddress}</p>
		<p>admin_badge address: {admin_badge}</p>
	</div>

	<p>
		<button type="button" class="btn btn-sm variant-filled-error" on:click={buyGumballHandler}
			>Buy 1 GUM</button
		>

		<button type="button" class="btn btn-sm variant-filled-secondary" on:click={() => getBalances()}
			>Get Balances</button
		>
		Balance: {gumballBalance} Tokens, {xrdBalance} XRD
	</p>
	<div class="container">
		<p>
			Receipt:<br />
		</p>
		<pre class="pre">{receipt}
		</pre>
	</div>

	<p>
		<button type="button" class="btn btn-sm variant-filled-secondary" on:click={getPriceHandler}
			>Get Price</button
		>
		Price: {priceOutFromGetPrice}
	</p>

	<p>
		<input type="text" placeholder="New Price" bind:value={setPriceInput} />
		<button type="button" class="btn btn-sm variant-filled-error" on:click={setPriceHandler}
			>Set Price</button
		>
		Price: {priceOutFromSetPrice}
	</p>

	<p>
		<button type="button" class="btn btn-sm variant-filled-error" on:click={withdrawEarningsHandler}
			>Withdraw Earnings</button
		>
		Withdrawn Amount: {withdrawnAmt}
	</p>

	<p>
		<button type="button" class="btn btn-sm variant-filled-error" on:click={mintStaffBadgeHandler}
			>Mint Staff Badge</button
		>
		Badge Minted: {staffBadge}
	</p>
</div>
