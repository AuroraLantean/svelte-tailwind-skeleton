import { PUBLIC_URI, PUBLIC_VAR, PUBLIC_POCKETBASE} from "$env/static/public";

  //ran only at the frontend
export function load() {
  //import the public variables from above first  
  console.log("routes/+page.ts/load()...");
  console.log("PUBLIC env:", PUBLIC_URI, PUBLIC_VAR);
  //console.log("PUBLIC env:", PUBLIC_POCKETBASE);
}