// Using Node.js runtime for Composio SDK compatibility
// export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const limit = searchParams.get("limit") || "20";

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

    const url = new URL("https://backend.composio.dev/api/v3/toolkits");
    if (category) url.searchParams.append("category", category);
    url.searchParams.append("limit", limit);
    url.searchParams.append("sort_by", "usage");

    const response = await fetch(url.toString(), {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      await response.text().catch(() => "Unknown error");
      return new Response(
        JSON.stringify({ error: "Failed to fetch toolkits" }),
        {
          status: response.status,
          headers: { "content-type": "application/json" },
        },
      );
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
