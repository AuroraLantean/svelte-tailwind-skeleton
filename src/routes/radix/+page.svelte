<script lang="ts">
	import { goto } from '$app/navigation';
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import {
		RadixDappToolkit,
		ManifestBuilder,
		Decimal,
		Bucket,
		Expression,
		Address
	} from '@radixdlt/radix-dapp-toolkit';

	const dAppId = 'account_tdx_c_1pyu3svm9a63wlv6qyjuns98qjsnus0pzan68mjq2hatqejq9fr';

	let packageAddress = '';
	let gumballSymbol = '';
	let gumAddress = 'none';
	let accountName = 'none';
	let staffBadge = 'none';
	let withdrawnAmt = '0';
	let price = '0';
	let receipt = '';
	let newPrice = 0;
  let ledger_state = 'none';
  let transaction = 'none';

	const rdt = RadixDappToolkit(
		{ dAppDefinitionAddress: dAppId, dAppName: 'GumballMachine' },
		(requestData) => {
			requestData({
				accounts: { quantifier: 'atLeast', quantity: 1 }
			}).map(({ data: { accounts } }) => {
				// add accounts to dApp application state
				console.log('account data: ', accounts);
				accountName = accounts[0].label;
				accountAddress = accounts[0].address;
				accountAddress = accounts[0].address;
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
					accountAddress = accounts[0].address;
					accountAddress = accounts[0].address;
				} else {
					console.log('accounts:', accounts);
				}
			}
		}
	);
	console.log(' Radix dApp Toolkit(rdt): ', rdt);

	// There are four classes exported in the Gateway-SDK These serve as a thin wrapper around the gateway API
	// API docs are available @ https://betanet-gateway.redoc.ly/
	// https://kisharnet-gateway.radixdlt.com/swagger/index.html
	import {
		TransactionApi,
		StateApi,
		StatusApi,
		StreamApi,
		Configuration
	} from '@radixdlt/babylon-gateway-api-sdk';

	// Instantiate Gateway SDK
	const transactionApi = new TransactionApi();
	const stateApi = new StateApi();
	const statusApi = new StatusApi();
	const streamApi = new StreamApi();

	// Global states
	let accountAddress: string; // User account address
	let componentAddress = 'component_tdx_c_1q03fknuu5g60rmu95xchgwzn7yaexexq5kclkqeesk3smdcnlk'; //GumballMachine component address
	let resourceAddress; // GUM resource address
	let xrdAddress = 'resource_tdx_c_1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq40v2wv';
	let admin_badge = 'resource_tdx_c_1q83fknuu5g60rmu95xchgwzn7yaexexq5kclkqeesk3s3v2a6d';

	// ************ Instantiate component and fetch component and resource addresses *************
	const instantiateComponent = async () => {
		let manifest = new ManifestBuilder()
			.callFunction(packageAddress, 'GumballMachine', 'instantiate_gumball_machine', [
				Decimal(1),
				`"${gumballSymbol}"`
			])
			.callMethod(accountAddress, 'deposit_batch', [Expression('ENTIRE_WORKTOP')])
			.build()
			.toString();
		console.log('Instantiate Manifest: ', manifest);
		// Send manifest to extension for signing
		const result = await rdt.sendTransaction({
			transactionManifest: manifest,
			version: 1
		});

		if (result.isErr()) throw result.error;

		console.log('Intantiate WalletSDK Result: ', result.value);

		// ************ Fetch the transaction status from the Gateway API ************
		let status = await transactionApi.transactionStatus({
			transactionStatusRequest: {
				intent_hash_hex: result.value.transactionIntentHash
			}
		});
		console.log('Instantiate TransactionApi transaction/status:', status);

		// ************ Fetch component address from gateway api and set componentAddress variable **************
		let commitReceipt = await transactionApi.transactionCommittedDetails({
			transactionCommittedDetailsRequest: {
				intent_hash_hex: result.value.transactionIntentHash
			}
		});
		console.log('Instantiate Committed Details Receipt', commitReceipt);

		// ****** Set componentAddress variable with gateway api commitReciept payload ******
		componentAddress = commitReceipt.transaction.referenced_global_entities![0];
		// ****** Set resourceAddress variable with gateway api commitReciept payload ******
		//admin_badge = commitReceipt.details.referenced_global_entities[1];
		//gumAddress = admin_badge;
	};

	// *********** Buy Gumball ***********
	const buyGumball = async () => {
		let manifest = new ManifestBuilder()
			.callMethod(accountAddress, 'withdraw', [Address(xrdAddress), Decimal(33)])
			.takeFromWorktop(xrdAddress, 'xrd_bucket')
			.callMethod(componentAddress, 'buy_gumball', [Bucket('xrd_bucket')])
			.callMethod(accountAddress, 'deposit_batch', [Expression('ENTIRE_WORKTOP')])
			.build()
			.toString();

		console.log('buy_gumball manifest: ', manifest);

		// Send manifest to extension for signing
		const result = await rdt.sendTransaction({
			transactionManifest: manifest,
			version: 1
		});

		if (result.isErr()) throw result.error;

		console.log('Buy Gumball sendTransaction Result: ', result);

		// Fetch the transaction status from the Gateway SDK
		let status = await transactionApi.transactionStatus({
			transactionStatusRequest: {
				intent_hash_hex: result.value.transactionIntentHash
			}
		});
		console.log('Buy Gumball TransactionAPI transaction/status: ', status);

		// fetch commit reciept from gateway api
		let commitReceipt = await transactionApi.transactionCommittedDetails({
			transactionCommittedDetailsRequest: {
				intent_hash_hex: result.value.transactionIntentHash
			}
		});
		console.log('Buy Gumball Committed Details Receipt', commitReceipt);

		// Show the receipt on the DOM
		//receipt = JSON.stringify(commitReceipt.detail.receipt, null, 2);
		ledger_state = JSON.stringify(commitReceipt.ledger_state, null, 2);
		transaction = JSON.stringify(commitReceipt.transaction, null, 2);
    console.log("ledger_state: " + ledger_state, ', transaction: ' + transaction)
	};

	// *********** Get Price ***********
	const getPrice = async () => {
		let manifest = new ManifestBuilder()
			.callMethod(componentAddress, 'get_price', [])
			.build()
			.toString();
		console.log('get price manifest', manifest);

		// Send manifest to extension for signing
		const result = await rdt.sendTransaction({
			transactionManifest: manifest,
			version: 1
		});

		if (result.isErr()) throw result.error;

		console.log('get_price sendTransaction Result: ', result);

		// Fetch the transaction status from the Gateway SDK
		let status = await transactionApi.transactionStatus({
			transactionStatusRequest: {
				intent_hash_hex: result.value.transactionIntentHash
			}
		});
		console.log('Get Price status', status);

		// fetch commit reciept from gateway api
		let commitReceipt = await transactionApi.transactionCommittedDetails({
			transactionCommittedDetailsRequest: {
				intent_hash_hex: result.value.transactionIntentHash
			}
		});
		console.log('get price commitReceipt', commitReceipt);

		// Show the receipt on the DOM
		//price = JSON.stringify(commitReceipt.details.receipt.output[1].data_json.value);
	};
	// *********** Set Price ***********
	const setPrice = async () => {
		let manifest = new ManifestBuilder()
			.callMethod(accountAddress, 'create_proof', [Address(admin_badge)])
			.callMethod(componentAddress, 'set_price', [Decimal(newPrice)])
			.build()
			.toString();
		console.log('set price manifest', manifest);

		// Send manifest to extension for signing
		const result = await rdt.sendTransaction({
			transactionManifest: manifest,
			version: 1
		});

		if (result.isErr()) throw result.error;

		console.log('Set Price sendTransaction Result: ', result);

		// Fetch the transaction status from the Gateway SDK
		let status = await transactionApi.transactionStatus({
			transactionStatusRequest: {
				intent_hash_hex: result.value.transactionIntentHash
			}
		});
		console.log('Set Price status', status);

		// fetch commit reciept from gateway api
		let commitReceipt = await transactionApi.transactionCommittedDetails({
			transactionCommittedDetailsRequest: {
				intent_hash_hex: result.value.transactionIntentHash
			}
		});
		console.log('Set price commitReceipt', commitReceipt);

		// Show the receipt on the DOM .data_struct.struct_data.data_json.fields[2].value
		/*price = JSON.stringify(
			commitReceipt.details.receipt.state_updates.updated_substates[0].substate_data.data_struct
				.struct_data.data_json.fields[2].value
		);*/
	};
	// *********** Withdraw Earnings ***********
	const withdrawEarnings = async () => {
		let manifest = new ManifestBuilder()
			.callMethod(accountAddress, 'create_proof', [Address(admin_badge)])
			.callMethod(componentAddress, 'withdraw_earnings', [])
			.callMethod(accountAddress, 'deposit_batch', [Expression('ENTIRE_WORKTOP')])
			.build()
			.toString();
		console.log('Withdraw Earnings manifest', manifest);

		// Send manifest to extension for signing
		const result = await rdt.sendTransaction({
			transactionManifest: manifest,
			version: 1
		});

		if (result.isErr()) throw result.error;

		console.log('Withdraw Earnings sendTransaction Result: ', result);

		// Fetch the transaction status from the Gateway SDK
		let status = await transactionApi.transactionStatus({
			transactionStatusRequest: {
				intent_hash_hex: result.value.transactionIntentHash
			}
		});
		console.log('Withdraw Earnings status', status);

		// fetch commit reciept from gateway api
		let commitReceipt = await transactionApi.transactionCommittedDetails({
			transactionCommittedDetailsRequest: {
				intent_hash_hex: result.value.transactionIntentHash
			}
		});
		console.log('Withdraw Earnings commitReceipt', commitReceipt);

		// Show the receipt on the DOM
		//withdrawnAmt = JSON.stringify(commitReceipt.details.receipt);
	};

	// *********** Mint NFT Staff Badge ***********
	const mintStaffBadge = async () => {
		let manifest = new ManifestBuilder()
			.callMethod(accountAddress, 'create_proof', [Address(admin_badge)])
			.callMethod(componentAddress, 'mint_staff_badge', [`"${'Number 2'}"`])
			.callMethod(accountAddress, 'deposit_batch', [Expression('ENTIRE_WORKTOP')])
			.build()
			.toString();
		console.log('mintStaffBadge manifest', manifest);

		// Send manifest to extension for signing
		const result = await rdt.sendTransaction({
			transactionManifest: manifest,
			version: 1
		});

		if (result.isErr()) throw result.error;

		console.log('mintStaffBadge sendTransaction Result: ', result);

		// Fetch the transaction status from the Gateway SDK
		let status = await transactionApi.transactionStatus({
			transactionStatusRequest: {
				intent_hash_hex: result.value.transactionIntentHash
			}
		});
		console.log('mintStaffBadge status', status);

		// fetch commit reciept from gateway api
		let commitReceipt = await transactionApi.transactionCommittedDetails({
			transactionCommittedDetailsRequest: {
				intent_hash_hex: result.value.transactionIntentHash
			}
		});
		console.log('mintStaffBadge commitReceipt', commitReceipt);

		// Show the receipt on the DOM
		//staffBadge = JSON.stringify(commitReceipt.details.receipt);
	};

	//------------------------==
	const t: ToastSettings = {
		message: 'Transaction submitted successfully!',
		background: 'variant-filled-success',
		timeout: 2000
	};

	function sendTxn(): void {
		console.log('sendTxn()');

		toastStore.trigger(t);
		goto('/marketplace');
	}
</script>

<div class="card p-4 w-full text-token space-y-4">
	<h3 class="text-center py-2">Gumball Machine dApp</h3>

	<div class="connectBtn flex flex-row-reverse">
		<radix-connect-button />
	</div>

	<div class="container">
		<p>Account Name: {accountName}</p>
		<p>Account Address: {accountAddress}</p>
	</div>

	<h2>Instantiate Gumball Machine</h2>
	<input type="text" placeholder="Package address" bind:value={packageAddress} />
	<input type="text" placeholder="Gumball Symbol" bind:value={gumballSymbol} />
	<p>
		<button type="button" class="btn btn-sm variant-filled-primary" on:click={instantiateComponent}
			>Instantiate component</button
		>
	</p>

	<div class="container">
		<p>Component Address:</p>
		<p>admin_badge address:</p>
	</div>

	<p>
		<button type="button" class="btn btn-sm variant-filled-error" on:click={buyGumball}
			>Buy 1 GUM</button
		>
	</p>
	<div class="container">
		<p>
			Receipt:<br />
		</p>
		<pre class="pre">{receipt}
		</pre>
	</div>
	<p>
		<button type="button" class="btn btn-sm variant-filled-secondary" on:click={getPrice}
			>Get Price</button
		>
	</p>

	<p>
		<input type="text" placeholder="New Price" bind:value={newPrice} />
		<button type="button" class="btn btn-sm variant-filled-error" on:click={setPrice}
			>Set Price</button
		>
		Price: {price}
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
