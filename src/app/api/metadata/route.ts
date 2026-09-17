import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PanelHubBot/1.0)' },
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) throw new Error('Failed to fetch');

    const html = await res.text();
    
    // Simple regex parsing for <title> and <meta name="description">
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) || 
                      html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"[^>]*>/i);
                      
    const title = titleMatch ? titleMatch[1].trim() : '';
    const description = descMatch ? descMatch[1].trim() : '';

    return NextResponse.json({ title, description });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
}
