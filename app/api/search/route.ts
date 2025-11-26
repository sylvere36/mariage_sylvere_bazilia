import { NextRequest, NextResponse } from 'next/server';
import { getGuests, getTables } from '@/lib/db';
import { searchGuests, findExactGuest } from '@/lib/search';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }

  const [guests, tables] = await Promise.all([getGuests(), getTables()]);

  // Chercher une correspondance exacte
  const exactMatch = findExactGuest(guests, query);

  if (exactMatch) {
    const table = tables.find(t => t.id === exactMatch.tableId);
    return NextResponse.json({ exactMatch, table });
  }

  // Sinon, recherche fuzzy
  const similar = searchGuests(guests, query);
  return NextResponse.json({ similar });
}
