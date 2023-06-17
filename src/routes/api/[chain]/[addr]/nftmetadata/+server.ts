import Moralis from 'moralis';
import { getChainObj } from '@store/lib';
import { json } from '@sveltejs/kit';

//https://docs.moralis.io/web3-data-api/evm/quickstart-nodejs
export async function GET({params, url}) {
  console.log('backendAPI @src/routes/api/[chain]/[addr]/nftmetadata');
  const { chain, addr } = params;
  const queryString = url.searchParams.toString();
  console.log('queryString: ' + queryString);
  console.log('addr:', addr, typeof addr, ', chain:', chain, typeof chain);
  const chainObj = getChainObj(chain);
  console.log('chainObj:', chainObj);

  // await Moralis.start({
  //   apiKey: PRIVATE_MORALIS,
  // });
  try {
    const nftsBalances = await Moralis.EvmApi.nft.getWalletNFTs({
      address: addr,
      chain: chainObj,
      limit: 10,
    });
      // Format the output to return name, amount and metadata
    const nfts = nftsBalances.result.map((nft) => ({
      name: nft.result.name,
      amount: nft.result.amount,
      metadata: nft.result.metadata,
    }));
    console.log('nftsBalances:', nftsBalances, ', nfts:', nfts, typeof nfts);//nfts is array of xyz
    return json(nfts);

  } catch (error) {
    console.log('Moralis Error:', error);
  }
};// json(arrayofobjects)
