import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Tester la connexion
    await prisma.$connect();
    
    // Vérifier si les tables existent
    const tablesCount = await prisma.table.count();
    const guestsCount = await prisma.guest.count();
    
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully',
      data: {
        tables: tablesCount,
        guests: guestsCount,
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
