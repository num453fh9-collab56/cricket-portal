import { NextResponse } from 'next/server';
import { fetchLiveMatches } from '@/lib/cricapi';

export async function GET() {
  try {
    const matches = await fetchLiveMatches();
    return NextResponse.json(matches);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}
