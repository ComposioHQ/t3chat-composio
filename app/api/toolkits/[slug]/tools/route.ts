// Using Node.js runtime for Composio SDK compatibility
// export const runtime = "edge";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const apiKey = process.env.COMPOSIO_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "COMPOSIO_API_KEY not configured" }),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        },
      );
    }

    const url = new URL("https://backend.composio.dev/api/v3/tools");
    url.searchParams.append("toolkit_slug", slug);

    const response = await fetch(url.toString(), {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      await response.text().catch(() => "Unknown error");
      return new Response(JSON.stringify({ error: "Failed to fetch tools" }), {
        status: response.status,
        headers: { "content-type": "application/json" },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
