import Moralis from 'moralis';
import { PRIVATE_MORALIS } from "$env/static/private";

console.log('inside hooks.server.ts ...');

await Moralis.start({
  apiKey: PRIVATE_MORALIS,
});
