import { env } from "$env/dynamic/private";
import { PRIVATE_URI, PRIVATE_VAR } from "$env/static/private";

//ran at both the frontend and
export function load() {
  console.log("Loading. dynamic env.PRIVATE:", env.PRIVATE_URI, env.PRIVATE_VAR);
  console.log("Loading. static PRIVATE:", PRIVATE_URI, PRIVATE_VAR);
}