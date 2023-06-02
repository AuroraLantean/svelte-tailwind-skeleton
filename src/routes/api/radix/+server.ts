import type { RequestHandler } from "./$types";

const SECRET_KEY = "";

// localhost:5173/success

// POST /radix data: items
// return -> url created by Stripe for our user to use

export const POST: RequestHandler = async ({request}) => {
    console.log("server api@/api/radix")
    // items: [ { id: "1", quantity: 6 }, { id: "2", quantity: 3 } ]
    const data = await request.json();
    const items = data.items;
    console.log(items);

    const url_out = 'http://localhost:5173/success';

    return new Response(
        JSON.stringify({ url: url_out }), // frontend will get this url to redirect
        {
            status: 200,
            headers: { 'content-type': 'application/json'}
        }
    )
}