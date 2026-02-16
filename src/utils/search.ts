// utils/search.ts
export async function searchPayload(query: string) {
    const res = await fetch(`${process.env.PAYLOAD_PUBLIC_URL}/api/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) {
      throw new Error('Search request failed');
    }
    return res.json();
  }