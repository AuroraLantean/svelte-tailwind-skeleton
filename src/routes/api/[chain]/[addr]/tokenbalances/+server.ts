import Moralis from 'moralis';
import { getChainObj } from '@store/lib';
import { json } from '@sveltejs/kit';

//https://docs.moralis.io/web3-data-api/evm/quickstart-nodejs
export async function GET({ params, url }) {
  console.log('backendAPI @src/routes/api/[chain]/[addr]/tokenBalances');
  const { chain, addr } = params;
  const queryString = url.searchParams.toString();
  console.log('queryString: ' + queryString);
  console.log('addr:', addr, typeof addr, ', chain:', chain, typeof chain);
  const [chainObj, chainStr] = getChainObj(chain);
  console.log('chainObj:', chainObj, ', chainStr:', chainStr);

  // await Moralis.start({
  //   apiKey: PRIVATE_MORALIS,
  // });
  try {
    const tokenBalances = await Moralis.EvmApi.token.getWalletTokenBalances({
      address: addr,
      chain: chainObj
    });
    // Format the balances to a readable output with the .display() method
    const tokens = tokenBalances.result.map((token) => token.display());
    console.log('tokenBalances:', tokenBalances, ', tokens:', tokens, typeof tokens);//tokens is array of xyz
    return json(tokens);

  } catch (error) {
    console.log('Moralis Error:', error);
  }
};// json(arrayofobjects)