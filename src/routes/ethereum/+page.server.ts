import Moralis from 'moralis';
import { PRIVATE_MORALIS } from "$env/static/private";

export async function load() {
  console.log('ethereum/load()');
  await Moralis.start({
    apiKey: PRIVATE_MORALIS,
  });
  return {
    status: 'ok'
  }
}
