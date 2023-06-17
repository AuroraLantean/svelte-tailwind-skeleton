import Moralis from 'moralis';
import { getChainObj } from '@store/lib';
import { json } from '@sveltejs/kit';

//https://docs.moralis.io/web3-data-api/evm/quickstart-nodejs
export async function GET({params, url}) {
  console.log('backendAPI @src/routes/api/[chain]/[addr]/nativebalance');
  const { chain, addr } = params;
  const queryString = url.searchParams.toString();
  console.log('queryString: ' + queryString);
  console.log('addr:', addr, typeof addr, ', chain:', chain, typeof chain);
  const chainObj = getChainObj(chain);
  console.log('chainObj:', chainObj);

  //console.log('PRIVATE_MORALIS:', PRIVATE_MORALIS);
  // await Moralis.start({
  //   apiKey: PRIVATE_MORALIS,
  // });
  try {
    const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
      address: addr,
      chain: chainObj
    });
    const native = nativeBalance.result.balance.ether;
    console.log('native balance:', nativeBalance, ', native:', native, typeof native);//native is string
    return json(native);

  } catch (error) {
    console.log('Moralis Error:', error);
  }

};// json(arrayofobjects)