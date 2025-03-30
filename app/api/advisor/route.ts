export async function POST(req: Request) {
    const { prompt } = await req.json();
  
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        model: 'mistral',
        prompt,
        stream: false
      }),
      headers: { 'Content-Type': 'application/json' }
    });
  
    const data = await res.json();
    return Response.json({ result: data.response });
  }
  