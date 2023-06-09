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
const lg = console.log;

export const getTokenBalance = async (userAccountAddr: string, tokenAddress: string): Promise<string> => {
  lg('getTokenBalance()...userAccountAddr:', userAccountAddr, ', tokenAddress:', tokenAddress);
  const response = await stateApi.entityFungibleResourceVaultPage({
    stateEntityFungibleResourceVaultsPageRequest: {
      address: userAccountAddr,
      resource_address: tokenAddress
    }
  });
  lg('response:', response);
  if (response && response.items[0]) {
    return response.items[0].amount;
  }
  return 'undefined';
};

export const getXrdBalance = async (userAccountAddr: string): Promise<string> => {
  lg('getTokenBalance()...userAccountAddr:', userAccountAddr, ', xrdAddress:', xrdAddress);

  const response = await stateApi.entityFungibleResourceVaultPage({
    stateEntityFungibleResourceVaultsPageRequest: {
      address: userAccountAddr,
      resource_address: xrdAddress
    }
  });
  lg('response:', response);
  if (response && response.items[0]) {
    return response.items[0].amount;
  }
  return 'undefined';
};

// ************ Instantiate component and fetch component and resource addresses *************
export const instantiateComponent = async (packageAddress: string, userAccountAddr: string, initPrice: number):BcResult => {
  const manifest = new ManifestBuilder()
    .callFunction(packageAddress, 'GumballMachine', 'instantiate_gumball_machine', [
      Decimal(initPrice),
      `"${gumballSymbol}"`
    ])
    .callMethod(userAccountAddr, 'deposit_batch', [Expression('ENTIRE_WORKTOP')])
    .build()
    .toString();
  lg('Instantiate Manifest: ', manifest);
  // Send manifest to extension for signing
  const result = await rdt.sendTransaction({
    transactionManifest: manifest,
    version: 1
  });
  if (result.isErr()) return {
    error: result.error, data: "", txn: ""
  }

  lg('Intantiate Result: ', result.value);
  const intentHashHex = result.value.transactionIntentHash;
  lg('intentHashHex:', intentHashHex);
  // ************ Fetch the transaction status from the Gateway API ************
  const status = await transactionApi.transactionStatus({
    transactionStatusRequest: {
      intent_hash_hex: intentHashHex
    }
  });
  lg('Instantiate TransactionApi transaction/status:', status);

  // ************ Fetch component address from gateway api and set compoAddr variable **************
  const commitReceipt = await transactionApi.transactionCommittedDetails({
    transactionCommittedDetailsRequest: {
      intent_hash_hex: intentHashHex
    }
  });
  lg('Instantiate Committed Details Receipt', commitReceipt);

  // ****** Set compoAddr variable with gateway api commitReciept payload ******
  const compoAddr = commitReceipt.transaction.referenced_global_entities[0];
  // ****** Set tokenAddress variable with gateway api commitReciept payload ******
  //admin_badge = commitReceipt.details.referenced_global_entities[1];
  const out = compoAddr;
  lg('compoAddr:', out, typeof out);// JSON.stringify();
  return { error: '', data: out }
};

// *********** buyGumball ***********
export const buyGumball = async (rdt, userAccountAddr:string, compoAddr: string):BcResult => {
  const manifest = new ManifestBuilder()
    .callMethod(userAccountAddr, 'withdraw', [Address(xrdAddress), Decimal(33)])
    .takeFromWorktop(xrdAddress, 'xrd_bucket')
    .callMethod(compoAddr, 'buy_gumball', [Bucket('xrd_bucket')])
    .callMethod(userAccountAddr, 'deposit_batch', [Expression('ENTIRE_WORKTOP')])
    .build()
    .toString();

  lg('buyGumball manifest: ', manifest);

  // Send manifest to extension for signing
  const result = await rdt.sendTransaction({
    transactionManifest: manifest,
    version: 1
  });
  if (result.isErr()) return {
    error: result.error, data: "", txn: ""
  }

  lg('buyGumball sendTransaction Result: ', result);
  const intentHashHex = result.value.transactionIntentHash;
  lg('intentHashHex:', intentHashHex);

  // Fetch the transaction status from the Gateway SDK
  const status = await transactionApi.transactionStatus({
    transactionStatusRequest: {
      intent_hash_hex: intentHashHex
    }
  });
  lg('buyGumball TransactionAPI transaction status: ', status);

  // fetch commit reciept from gateway api
  const commitReceipt = await transactionApi.transactionCommittedDetails({
    transactionCommittedDetailsRequest: {
      intent_hash_hex: intentHashHex
    }
  });
  lg('buyGumball Committed Details Receipt', commitReceipt);
  const txnOut = commitReceipt.transaction;
  lg('txnOut', txnOut);// JSON.stringify();
  return { error: '', data: '', txn: txnOut };
};//buyGumball

// *********** Get Price ***********
export const getPrice = async (rdt, compoAddr: string):BcResult => {
  const manifest = new ManifestBuilder()
    .callMethod(compoAddr, 'get_price', [])
    .build()
    .toString();
  lg('get_price manifest', manifest);

  // Send manifest to extension for signing
  const result = await rdt.sendTransaction({
    transactionManifest: manifest,
    version: 1
  });
  if (result.isErr()) return {
    error: result.error, data: "", txn: ""
  }

  lg('get_price sendTransaction Result: ', result);
  const intentHashHex = result.value.transactionIntentHash;
  lg('intentHashHex:', intentHashHex);
  // Fetch the transaction status from the Gateway SDK
  const status = await transactionApi.transactionStatus({
    transactionStatusRequest: {
      intent_hash_hex: intentHashHex
    }
  });
  lg('get_price status', status);

  // fetch commit reciept from gateway api
  const commitReceipt = await transactionApi.transactionCommittedDetails({
    transactionCommittedDetailsRequest: {
      intent_hash_hex: intentHashHex
    }
  });
  lg('get_price commitReceipt', commitReceipt);
   //https://radix-rcnet-v1-gateway.redoc.ly/#operation/TransactionSubmit
  const txnOut = commitReceipt.transaction;
  const out = commitReceipt.details.receipt.output[1].data_json.value;// JSON.stringify(out);
  lg('Price:', out, typeof out);
  return { error: '', data: out, txn: txnOut };
};//GetPrice

// *********** Set Price ***********
export const setPrice = async (rdt, userAccountAddr: string, compoAddr: string, admin_badge: string, setPriceInput: string):BcResult => {
  const manifest = new ManifestBuilder()
    .callMethod(userAccountAddr, 'create_proof', [Address(admin_badge)])
    .callMethod(compoAddr, 'set_price', [Decimal(setPriceInput)])
    .build()
    .toString();
  lg('set_price manifest', manifest);

  // Send manifest to extension for signing
  const result = await rdt.sendTransaction({
    transactionManifest: manifest,
    version: 1
  });
  if (result.isErr()) return {
    error: result.error, data: "", txn: ""
  }

  lg('set_price sendTransaction Result: ', result);
  const intentHashHex = result.value.transactionIntentHash;
  lg('intentHashHex:', intentHashHex);
  // Fetch the transaction status from the Gateway SDK
  const status = await transactionApi.transactionStatus({
    transactionStatusRequest: {
      intent_hash_hex: intentHashHex
    }
  });
  lg('set_price status', status);

  // fetch commit reciept from gateway api
  const commitReceipt = await transactionApi.transactionCommittedDetails({
    transactionCommittedDetailsRequest: {
      intent_hash_hex: intentHashHex
    }
  });
  lg('set_price commitReceipt', commitReceipt);
  
  const txnOut = commitReceipt.transaction;
  const out = commitReceipt.details.receipt.state_updates.updated_substates[0].substate_data.data_struct
  .struct_data.data_json.fields[2].value;
  lg('newPrice:', out, typeof out);// JSON.stringify();
  return { error: '', data: out, txn: txnOut };
};//setPrice

// *********** Withdraw Earnings ***********
export const withdrawEarnings = async (rdt, userAccountAddr: string, compoAddr: string, admin_badge: string):BcResult => {
  const manifest = new ManifestBuilder()
    .callMethod(userAccountAddr, 'create_proof', [Address(admin_badge)])
    .callMethod(compoAddr, 'withdraw_earnings', [])
    .callMethod(userAccountAddr, 'deposit_batch', [Expression('ENTIRE_WORKTOP')])
    .build()
    .toString();
  lg('Withdraw Earnings manifest', manifest);

  // Send manifest to extension for signing
  const result = await rdt.sendTransaction({
    transactionManifest: manifest,
    version: 1
  });
  if (result.isErr()) return {
    error: result.error, data: "", txn: ""
  }

  lg('Withdraw Earnings sendTransaction Result: ', result);
  const intentHashHex = result.value.transactionIntentHash;
  lg('intentHashHex:', intentHashHex);
  // Fetch the transaction status from the Gateway SDK
  const status = await transactionApi.transactionStatus({
    transactionStatusRequest: {
      intent_hash_hex: intentHashHex
    }
  });
  lg('Withdraw Earnings status', status);

  // fetch commit reciept from gateway api
  const commitReceipt = await transactionApi.transactionCommittedDetails({
    transactionCommittedDetailsRequest: {
      intent_hash_hex: intentHashHex
    }
  });
  lg('Withdraw Earnings commitReceipt', commitReceipt);
  
  const txnOut = commitReceipt.transaction;
  const out = commitReceipt.details.receipt;
  lg('receipt:', out, typeof out);// JSON.stringify();
  return { error: '', data: out, txn: txnOut };

};//withdrawEarnings

// *********** Mint NFT Staff Badge ***********
export const mintStaffBadge = async (rdt, userAccountAddr: string, compoAddr: string, admin_badge: string):BcResult => {
  const manifest = new ManifestBuilder()
    .callMethod(userAccountAddr, 'create_proof', [Address(admin_badge)])
    .callMethod(compoAddr, 'mint_staff_badge', [`"${'Number 2'}"`])
    .callMethod(userAccountAddr, 'deposit_batch', [Expression('ENTIRE_WORKTOP')])
    .build()
    .toString();
  lg('mintStaffBadge manifest', manifest);

  // Send manifest to extension for signing
  const result = await rdt.sendTransaction({
    transactionManifest: manifest,
    version: 1
  });
  if (result.isErr()) return {
    error: result.error, data: "", txn: ""
  }

  lg('mintStaffBadge sendTransaction Result: ', result);
  const intentHashHex = result.value.transactionIntentHash;
  lg('intentHashHex:', intentHashHex);
  // Fetch the transaction status from the Gateway SDK
  const status = await transactionApi.transactionStatus({
    transactionStatusRequest: {
      intent_hash_hex: intentHashHex
    }
  });
  lg('mintStaffBadge status', status);

  // fetch commit reciept from gateway api
  const commitReceipt = await transactionApi.transactionCommittedDetails({
    transactionCommittedDetailsRequest: {
      intent_hash_hex: intentHashHex
    }
  });
  lg('mintStaffBadge commitReceipt', commitReceipt);
  
  const txnOut = commitReceipt.transaction;
  const out = commitReceipt.details.receipt;
  lg('staffBadge:', out, typeof out);// JSON.stringify();
  return { error: '', data: out, txn: txnOut };
};//mintStaffBadge