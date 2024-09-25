type Params = {
  team: string
}
 
export async function GET(request: Request, context: { params: Params }) {
  try {
    //TODO: Add more specific route information 
    return Response.json({ success: true, data: "Hi! It looks like you've stumbled across our API! If you're trying to use or navigate the api, contact `contact@ryanlahlou.com` for details!" });
  } catch (error) {
    return Response.json({ success: false, error: error });
  }
}