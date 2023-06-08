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
	const t: ToastSettings = {
		message: 'Transaction submitted successfully!',
		background: 'variant-filled-success',
		timeout: 2000
	};

	const dAppId = 'account_tdx_c_1pyu3svm9a63wlv6qyjuns98qjsnus0pzan68mjq2hatqejq9fr';

	// Global states
	let userAccountAddr = ''; // User account address
	let packageAddress = '';
	let gumballSymbol = '';
	let accountName = 'none';
	let staffBadge = 'none';
	let withdrawnAmt = '0';
	let priceOutFromGetPrice = '';
	let priceOutFromSetPrice = '';
	let receipt = '';
	let setPriceInput = 0;
	let gumballBalance = '';
	let xrdBalance = '';

	//After deploying the package
	let packageAddressOut = 'package_tdx_c_1qqy67sxv4e2nvls059cutjn5rk8edcvh3a4da7zusgusmkeahk';
	let packageOwnerBadge = 'resource_tdx_c_1q27nneue67zpuxw6h96j3m86wdhxav8n8q6zymkpfuksxjlcz7';

	let compoAddr = 'component_tdx_c_1qwm335s7ve7ltfjzpz2z65cfufruwll4lr4cml7xgccq8dfadn'; //GumballMachine component address
	let tokenAddress = 'resource_tdx_c_1qyagrng5scvzjg7lz8cyfqhypew7qekja3zwww74g74qtpkjf0'; // GUM resource address

	let admin_badge = 'resource_tdx_c_1qxm335s7ve7ltfjzpz2z65cfufruwll4lr4cml7xgccqdvmngg';

	let isAfterLoadEvent = false;
	let rdt: any;
	console.log('isAfterLoadEvent: ' + isAfterLoadEvent);
	onMount(async () => {
		console.log('onMount');
		isAfterLoadEvent = true;
		console.log('isAfterLoadEvent: ' + isAfterLoadEvent);

		rdt = RadixDappToolkit(
			{ dAppDefinitionAddress: dAppId, dAppName: 'GumballMachine' },
			(requestData) => {
				requestData({
					accounts: { quantifier: 'atLeast', quantity: 1 }
				}).map(({ data: { accounts } }) => {
					// add accounts to dApp application state
					console.log('account data: ', accounts);
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
					console.log('onInit accounts: ', accounts);
					if (accounts && accounts.length > 0) {
						accountName = accounts[0].label;
						userAccountAddr = accounts[0].address;
					} else {
						console.log('error... accounts:', accounts);
					}
				}
			}
		);
		console.log(' Radix dApp Toolkit(rdt): ', rdt);

		//gumballBalance = await getTokenBalance(userAccountAddr, tokenAddress);
		//console.log('gumballBalance:', gumballBalance);
	});

  const instantiateCompo = async() => {
		console.log('instantiateCompo()');
    compoAddr = await instantiateComponent(packageAddress, userAccountAddr, 1);
  }
	const getBalances = async() => {
		console.log('getBalances()');
    gumballBalance = await getTokenBalance(userAccountAddr, tokenAddress);
    xrdBalance = await getXrdBalance(userAccountAddr);
  }
	const buyGumballHandler = async() => {
		console.log('buyGumballHandler()');
    const out = await buyGumball(rdt, userAccountAddr, compoAddr);
    receipt = JSON.stringify(out, null, 2);
    gumballBalance = await getTokenBalance(userAccountAddr, tokenAddress);
    xrdBalance = await getXrdBalance(userAccountAddr);
  }
	const getPriceHandler = async() => {
		console.log('getPriceHandler()');
    priceOutFromGetPrice = await getPrice(rdt, compoAddr);
    console.log("priceOutFromGetPrice:", priceOutFromGetPrice);
  }

  const sendTxn = async() => {
		console.log('sendTxn()');

		toastStore.trigger(t);
		goto('/marketplace');
	}
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

		<button
			type="button"
			class="btn btn-sm variant-filled-secondary"
			on:click={() => getBalances()}>Get Balances</button
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
		<button type="button" class="btn btn-sm variant-filled-error" on:click={setPrice}
			>Set Price</button
		>
		Price: {priceOutFromSetPrice}
	</p>

	<p>
		<button type="button" class="btn btn-sm variant-filled-error" on:click={withdrawEarnings}
			>Withdraw Earnings</button
		>
		Withdrawn Amount: {withdrawnAmt}
	</p>

	<p>
		<button type="button" class="btn btn-sm variant-filled-error" on:click={mintStaffBadge}
			>Mint Staff Badge</button
		>
		Badge Minted: {staffBadge}
	</p>
</div>
