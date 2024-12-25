export async function GET({params, request}) {
    return new Response(
      JSON.stringify({
        status: 'OK',
        timestamp: Date.now()
      })
    )
  }