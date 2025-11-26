import { prisma } from './prisma';
import { Guest, Table } from './types';

// GUESTS
export async function getGuests(): Promise<Guest[]> {
  try {
    const guests = await prisma.guest.findMany({
      orderBy: { name: 'asc' },
    });
    
    return guests.map(guest => ({
      id: guest.id,
      name: guest.name,
      places: guest.places,
      children: guest.children,
      tableId: guest.tableId,
      arrived: guest.arrived,
      arrivalTime: guest.arrivalTime?.toISOString() || null,
    }));
  } catch (error) {
    console.error('Error getting guests:', error);
    return [];
  }
}

export async function saveGuest(guest: Guest): Promise<void> {
  await prisma.guest.upsert({
    where: { id: guest.id },
    update: {
      name: guest.name,
      places: guest.places,
      children: guest.children,
      tableId: guest.tableId,
      arrived: guest.arrived,
      arrivalTime: guest.arrivalTime ? new Date(guest.arrivalTime) : null,
    },
    create: {
      id: guest.id,
      name: guest.name,
      places: guest.places,
      children: guest.children,
      tableId: guest.tableId,
      arrived: guest.arrived,
      arrivalTime: guest.arrivalTime ? new Date(guest.arrivalTime) : null,
    },
  });
}

export async function deleteGuest(guestId: string): Promise<void> {
  await prisma.guest.delete({
    where: { id: guestId },
  });
}

// TABLES
export async function getTables(): Promise<Table[]> {
  try {
    const tables = await prisma.table.findMany({
      orderBy: { number: 'asc' },
    });
    
    return tables.map(table => ({
      id: table.id,
      name: table.name,
      number: table.number,
      description: table.description || '',
      capacity: table.capacity,
      currentCount: table.currentCount,
    }));
  } catch (error) {
    console.error('Error getting tables:', error);
    return [];
  }
}

export async function saveTable(table: Table): Promise<void> {
  await prisma.table.upsert({
    where: { id: table.id },
    update: {
      name: table.name,
      number: table.number,
      description: table.description,
      capacity: table.capacity,
      currentCount: table.currentCount,
    },
    create: {
      id: table.id,
      name: table.name,
      number: table.number,
      description: table.description,
      capacity: table.capacity,
      currentCount: table.currentCount,
    },
  });
}

export async function deleteTable(tableId: string): Promise<void> {
  await prisma.table.delete({
    where: { id: tableId },
  });
}

export async function updateTableCounts(): Promise<void> {
  try {
    const tables = await prisma.table.findMany();
    
    for (const table of tables) {
      const guests = await prisma.guest.findMany({
        where: { tableId: table.id },
      });
      
      const count = guests.reduce((sum, guest) => sum + guest.places + guest.children, 0);
      
      await prisma.table.update({
        where: { id: table.id },
        data: { currentCount: count },
      });
    }
  } catch (error) {
    console.error('Error updating table counts:', error);
  }
}

