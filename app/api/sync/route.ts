import { NextResponse } from 'next/server';
import { getGuests, getTables } from '@/lib/db';

export async function GET() {
  const [guests, tables] = await Promise.all([getGuests(), getTables()]);
  
  return NextResponse.json({ guests, tables, timestamp: Date.now() });
}
