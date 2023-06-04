import { PUBLIC_URI, PUBLIC_VAR} from "$env/static/public";

export function load() {

  console.log("Loading: PUBLIC env:", PUBLIC_URI, PUBLIC_VAR);
  //ran only at the frontend
}