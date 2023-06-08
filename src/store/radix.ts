import {
  //RadixDappToolkit
  ManifestBuilder,
  Decimal,
  Bucket,
  Expression,
  Address
} from '@radixdlt/radix-dapp-toolkit';
// There are four classes exported in the Gateway-SDK These serve as a thin wrapper around the gateway API
// API docs are available @ https://betanet-gateway.redoc.ly/
// https://kisharnet-gateway.radixdlt.com/swagger/index.html
import {
  TransactionApi,
  StateApi,
  //StatusApi,
  //StreamApi,
  //Configuration
} from '@radixdlt/babylon-gateway-api-sdk';

// Instantiate Gateway SDK
const transactionApi = new TransactionApi();
const stateApi = new StateApi();
//const statusApi = new StatusApi();
//const streamApi = new StreamApi();

const xrdAddress = 'resource_tdx_c_1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq40v2wv';

export const getTokenBalance = async (userAccountAddr: string, tokenAddress: string): Promise<string> => {
  console.log('getTokenBalance()...userAccountAddr:', userAccountAddr, ', tokenAddress:', tokenAddress);
  const response = await stateApi.entityFungibleResourceVaultPage({
    stateEntityFungibleResourceVaultsPageRequest: {
      address: userAccountAddr,
      resource_address: tokenAddress
    }
  });
  console.log('response:', response);
  if (response && response.items[0]) {
    return response.items[0].amount;
  }
  return 'undefined';
};
export const getXrdBalance = async (userAccountAddr: string): Promise<string> => {
  console.log('getTokenBalance()...userAccountAddr:', userAccountAddr, ', xrdAddress:', xrdAddress);
  const response = await stateApi.entityFungibleResourceVaultPage({
    stateEntityFungibleResourceVaultsPageRequest: {
      address: userAccountAddr,
      resource_address: xrdAddress
    }
  });
  console.log('response:', response);
  if (response && response.items[0]) {
    return response.items[0].amount;
  }
  return 'undefined';
};

// ************ Instantiate component and fetch component and resource addresses *************
export const instantiateComponent = async (packageAddress: string, userAccountAddr: string, initPrice: number):string => {
  const manifest = new ManifestBuilder()
    .callFunction(packageAddress, 'GumballMachine', 'instantiate_gumball_machine', [
      Decimal(initPrice),
      `"${gumballSymbol}"`
    ])
    .callMethod(userAccountAddr, 'deposit_batch', [Expression('ENTIRE_WORKTOP')])
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
  const status = await transactionApi.transactionStatus({
    transactionStatusRequest: {
      intent_hash_hex: result.value.transactionIntentHash
    }
  });
  console.log('Instantiate TransactionApi transaction/status:', status);

  // ************ Fetch component address from gateway api and set compoAddr variable **************
  const commitReceipt = await transactionApi.transactionCommittedDetails({
    transactionCommittedDetailsRequest: {
      intent_hash_hex: result.value.transactionIntentHash
    }
  });
  console.log('Instantiate Committed Details Receipt', commitReceipt);

  // ****** Set compoAddr variable with gateway api commitReciept payload ******
  compoAddr = commitReceipt.transaction.referenced_global_entities[0];
  // ****** Set tokenAddress variable with gateway api commitReciept payload ******
  //admin_badge = commitReceipt.details.referenced_global_entities[1];
  return compoAddr;
};

// *********** Buy Gumball ***********
export const buyGumball = async (rdt: any, userAccountAddr:string, compoAddr: string):string => {
  const manifest = new ManifestBuilder()
    .callMethod(userAccountAddr, 'withdraw', [Address(xrdAddress), Decimal(33)])
    .takeFromWorktop(xrdAddress, 'xrd_bucket')
    .callMethod(compoAddr, 'buy_gumball', [Bucket('xrd_bucket')])
    .callMethod(userAccountAddr, 'deposit_batch', [Expression('ENTIRE_WORKTOP')])
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
  const status = await transactionApi.transactionStatus({
    transactionStatusRequest: {
      intent_hash_hex: result.value.transactionIntentHash
    }
  });
  console.log('Buy Gumball TransactionAPI transaction/status: ', status);

  // fetch commit reciept from gateway api
  const commitReceipt = await transactionApi.transactionCommittedDetails({
    transactionCommittedDetailsRequest: {
      intent_hash_hex: result.value.transactionIntentHash
    }
  });
  console.log('Buy Gumball Committed Details Receipt', commitReceipt);

  //const ledger_state = JSON.stringify(commitReceipt.ledger_state, null, 2);
  //const transaction = JSON.stringify(commitReceipt.transaction, null, 2);
  //console.log('ledger_state: ' + ledger_state, ', transaction: ' + transaction);
  // Show the receipt on the DOM
  return commitReceipt.transaction;
};

// *********** Get Price ***********
export const getPrice = async (rdt: any, compoAddr: string):string => {
  const manifest = new ManifestBuilder()
    .callMethod(compoAddr, 'get_price', [])
    .build()
    .toString();
  console.log('get_price manifest', manifest);

  // Send manifest to extension for signing
  const result = await rdt.sendTransaction({
    transactionManifest: manifest,
    version: 1
  });

  if (result.isErr()) throw result.error;

  console.log('get_price sendTransaction Result: ', result);

  // Fetch the transaction status from the Gateway SDK
  const status = await transactionApi.transactionStatus({
    transactionStatusRequest: {
      intent_hash_hex: result.value.transactionIntentHash
    }
  });
  console.log('get_price status', status);

  // fetch commit reciept from gateway api
  const commitReceipt = await transactionApi.transactionCommittedDetails({
    transactionCommittedDetailsRequest: {
      intent_hash_hex: result.value.transactionIntentHash
    }
  });
  console.log('get_price commitReceipt', commitReceipt);

  // Show the receipt on the DOM
  priceOutFromGetPrice = JSON.stringify(commitReceipt.details.receipt.output[1].data_json.value);
  return priceOutFromGetPrice;
};
// *********** Set Price ***********
export const setPrice = async () => {
  const manifest = new ManifestBuilder()
    .callMethod(userAccountAddr, 'create_proof', [Address(admin_badge)])
    .callMethod(compoAddr, 'set_price', [Decimal(setPriceInput)])
    .build()
    .toString();
  console.log('set_price manifest', manifest);

  // Send manifest to extension for signing
  const result = await rdt.sendTransaction({
    transactionManifest: manifest,
    version: 1
  });

  if (result.isErr()) throw result.error;

  console.log('set_price sendTransaction Result: ', result);

  // Fetch the transaction status from the Gateway SDK
  const status = await transactionApi.transactionStatus({
    transactionStatusRequest: {
      intent_hash_hex: result.value.transactionIntentHash
    }
  });
  console.log('set_price status', status);

  // fetch commit reciept from gateway api
  const commitReceipt = await transactionApi.transactionCommittedDetails({
    transactionCommittedDetailsRequest: {
      intent_hash_hex: result.value.transactionIntentHash
    }
  });
  console.log('set_price commitReceipt', commitReceipt);

  // Show the receipt on the DOM .data_struct.struct_data.data_json.fields[2].value
  /*priceOutFromSetPrice = JSON.stringify(
    commitReceipt.details.receipt.state_updates.updated_substates[0].substate_data.data_struct
      .struct_data.data_json.fields[2].value
  );*/
};
// *********** Withdraw Earnings ***********
export const withdrawEarnings = async () => {
  const manifest = new ManifestBuilder()
    .callMethod(userAccountAddr, 'create_proof', [Address(admin_badge)])
    .callMethod(compoAddr, 'withdraw_earnings', [])
    .callMethod(userAccountAddr, 'deposit_batch', [Expression('ENTIRE_WORKTOP')])
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
  const status = await transactionApi.transactionStatus({
    transactionStatusRequest: {
      intent_hash_hex: result.value.transactionIntentHash
    }
  });
  console.log('Withdraw Earnings status', status);

  // fetch commit reciept from gateway api
  const commitReceipt = await transactionApi.transactionCommittedDetails({
    transactionCommittedDetailsRequest: {
      intent_hash_hex: result.value.transactionIntentHash
    }
  });
  console.log('Withdraw Earnings commitReceipt', commitReceipt);

  // Show the receipt on the DOM
  //withdrawnAmt = JSON.stringify(commitReceipt.details.receipt);
};

// *********** Mint NFT Staff Badge ***********
export const mintStaffBadge = async () => {
  const manifest = new ManifestBuilder()
    .callMethod(userAccountAddr, 'create_proof', [Address(admin_badge)])
    .callMethod(compoAddr, 'mint_staff_badge', [`"${'Number 2'}"`])
    .callMethod(userAccountAddr, 'deposit_batch', [Expression('ENTIRE_WORKTOP')])
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
  const status = await transactionApi.transactionStatus({
    transactionStatusRequest: {
      intent_hash_hex: result.value.transactionIntentHash
    }
  });
  console.log('mintStaffBadge status', status);

  // fetch commit reciept from gateway api
  const commitReceipt = await transactionApi.transactionCommittedDetails({
    transactionCommittedDetailsRequest: {
      intent_hash_hex: result.value.transactionIntentHash
    }
  });
  console.log('mintStaffBadge commitReceipt', commitReceipt);

  // Show the receipt on the DOM
  //staffBadge = JSON.stringify(commitReceipt.details.receipt);
};