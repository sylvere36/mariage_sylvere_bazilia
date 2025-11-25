import { NextResponse } from 'next/server';
import { getGuests, getTables } from '@/lib/blob';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [guests, tables] = await Promise.all([getGuests(), getTables()]);

  const guest = guests.find(g => g.id === id);

  if (!guest) {
    return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
  }

  const table = tables.find(t => t.id === guest.tableId);

  return NextResponse.json({ guest, table });
}
