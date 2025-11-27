import { NextResponse } from 'next/server';
import { updateTableCounts } from '@/lib/db';

export async function POST() {
  try {
    await updateTableCounts();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error refreshing counts:', error);
    return NextResponse.json({ error: 'Failed to refresh counts' }, { status: 500 });
  }
}
