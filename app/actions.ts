'use server';

import { revalidatePath } from 'next/cache';
import { getGuests, saveGuest, deleteGuest as dbDeleteGuest, getTables, saveTable, deleteTable as dbDeleteTable, updateTableCounts } from '@/lib/db';
import { Guest, Table } from '@/lib/types';

async function revalidateAll() {
  try {
    revalidatePath('/', 'layout');
  } catch (error) {
    console.error('Revalidation error:', error);
    // Ne pas bloquer l'opération si la revalidation échoue
  }
}

export async function markGuestArrived(guestId: string) {
  const guests = await getGuests();
  const guest = guests.find(g => g.id === guestId);
  
  if (!guest) {
    throw new Error('Guest not found');
  }

  await saveGuest({
    ...guest,
    arrived: true,
    arrivalTime: new Date().toISOString(),
  });

  await revalidateAll();
}

export async function cancelGuestArrival(guestId: string) {
  const guests = await getGuests();
  const guest = guests.find(g => g.id === guestId);
  
  if (!guest) {
    throw new Error('Guest not found');
  }

  await saveGuest({
    ...guest,
    arrived: false,
    arrivalTime: null,
  });

  await revalidateAll();
}

export async function createGuest(guest: Omit<Guest, 'id'>) {
  const tables = await getTables();
  
  // Vérifier la capacité de la table
  const table = tables.find(t => t.id === guest.tableId);
  if (!table) {
    throw new Error('Table not found');
  }
  
  // Les enfants ne comptent pas dans la capacité (salle à part)
  if (table.currentCount + guest.places > table.capacity) {
    throw new Error('Table capacity exceeded');
  }

  const newGuest: Guest = {
    ...guest,
    id: `g${Date.now()}`,
  };

  await saveGuest(newGuest);
  await updateTableCounts();
  
  await revalidateAll();
}

export async function updateGuest(guestId: string, updates: Partial<Guest>) {
  const guests = await getGuests();
  const guest = guests.find(g => g.id === guestId);
  
  if (!guest) {
    throw new Error('Guest not found');
  }

  // Si on change de table, vérifier la capacité
  if (updates.tableId && updates.tableId !== guest.tableId) {
    const tables = await getTables();
    const newTable = tables.find(t => t.id === updates.tableId);
    
    if (!newTable) {
      throw new Error('Table not found');
    }
    
    // Les enfants ne comptent pas dans la capacité (salle à part)
    const adultPlaces = updates.places ?? guest.places;
    
    // Calculer la nouvelle occupation (sans les enfants)
    const currentTableGuests = guests.filter(g => g.id !== guestId && g.tableId === updates.tableId);
    const currentOccupation = currentTableGuests.reduce((sum, g) => sum + g.places, 0);
    
    if (currentOccupation + adultPlaces > newTable.capacity) {
      throw new Error('Table capacity exceeded');
    }
  }

  await saveGuest({
    ...guest,
    ...updates,
  });
  await updateTableCounts();
  
  await revalidateAll();
}

export async function deleteGuest(guestId: string) {
  await dbDeleteGuest(guestId);
  await updateTableCounts();
  
  await revalidateAll();
}

export async function createTable(table: Omit<Table, 'id' | 'currentCount'>) {
  const newTable: Table = {
    ...table,
    id: `t${Date.now()}`,
    currentCount: 0,
  };

  await saveTable(newTable);
  
  await revalidateAll();
}

export async function updateTable(tableId: string, updates: Partial<Table>) {
  const tables = await getTables();
  const table = tables.find(t => t.id === tableId);
  
  if (!table) {
    throw new Error('Table not found');
  }

  await saveTable({
    ...table,
    ...updates,
  });
  await revalidateAll();
}

export async function deleteTable(tableId: string) {
  const guests = await getGuests();
  
  // Vérifier qu'aucun invité n'est assigné à cette table
  const hasGuests = guests.some(g => g.tableId === tableId);
  if (hasGuests) {
    throw new Error('Cannot delete table with assigned guests');
  }

  await dbDeleteTable(tableId);
  
  await revalidateAll();
}
