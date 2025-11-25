import { NextResponse } from 'next/server';
import { getGuests, getTables } from '@/lib/blob';

export async function GET() {
  const [guests, tables] = await Promise.all([getGuests(), getTables()]);
  
  return NextResponse.json({ guests, tables, timestamp: Date.now() });
}
