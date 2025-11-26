import { NextResponse } from 'next/server';
import { getGuests, getTables } from '@/lib/db';
import { generateGuestListPDF } from '@/lib/pdf';

export async function GET() {
  try {
    const [guests, tables] = await Promise.all([getGuests(), getTables()]);
    
    const pdfBlob = await generateGuestListPDF(tables, guests);
    
    return new NextResponse(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="liste-invites-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
