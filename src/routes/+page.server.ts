import { env } from "$env/dynamic/private";
import { PRIVATE_URI, PRIVATE_VAR, PRIVATE_MORALIS } from "$env/static/private";

export function load() {
  console.log("Load(). dynamic env.PRIVATE:", env.PRIVATE_URI, env.PRIVATE_VAR);
  console.log("Load(). static PRIVATE:", PRIVATE_URI, PRIVATE_VAR, PRIVATE_MORALIS);
}