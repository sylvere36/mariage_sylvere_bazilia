'use server';

import { revalidatePath } from 'next/cache';
import { getGuests, saveGuests, getTables, saveTables, updateTableCounts } from '@/lib/blob';
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
  const guestIndex = guests.findIndex(g => g.id === guestId);
  
  if (guestIndex === -1) {
    throw new Error('Guest not found');
  }

  guests[guestIndex] = {
    ...guests[guestIndex],
    arrived: true,
    arrivalTime: new Date().toISOString(),
  };

  await saveGuests(guests);
  await revalidateAll();
}

export async function cancelGuestArrival(guestId: string) {
  const guests = await getGuests();
  const guestIndex = guests.findIndex(g => g.id === guestId);
  
  if (guestIndex === -1) {
    throw new Error('Guest not found');
  }

  guests[guestIndex] = {
    ...guests[guestIndex],
    arrived: false,
    arrivalTime: null,
  };

  await saveGuests(guests);
  await revalidateAll();
}

export async function createGuest(guest: Omit<Guest, 'id'>) {
  const guests = await getGuests();
  const tables = await getTables();
  
  // Vérifier la capacité de la table
  const table = tables.find(t => t.id === guest.tableId);
  if (!table) {
    throw new Error('Table not found');
  }
  
  const totalPlaces = guest.places + guest.children;
  if (table.currentCount + totalPlaces > table.capacity) {
    throw new Error('Table capacity exceeded');
  }

  const newGuest: Guest = {
    ...guest,
    id: `g${Date.now()}`,
  };

  guests.push(newGuest);
  await saveGuests(guests);
  await updateTableCounts();
  
  await revalidateAll();
}

export async function updateGuest(guestId: string, updates: Partial<Guest>) {
  const guests = await getGuests();
  const guestIndex = guests.findIndex(g => g.id === guestId);
  
  if (guestIndex === -1) {
    throw new Error('Guest not found');
  }

  // Si on change de table, vérifier la capacité
  if (updates.tableId && updates.tableId !== guests[guestIndex].tableId) {
    const tables = await getTables();
    const newTable = tables.find(t => t.id === updates.tableId);
    
    if (!newTable) {
      throw new Error('Table not found');
    }
    
    const totalPlaces = (updates.places ?? guests[guestIndex].places) + 
                       (updates.children ?? guests[guestIndex].children);
    
    // Calculer la nouvelle occupation
    const currentTableGuests = guests.filter(g => g.id !== guestId && g.tableId === updates.tableId);
    const currentOccupation = currentTableGuests.reduce((sum, g) => sum + g.places + g.children, 0);
    
    if (currentOccupation + totalPlaces > newTable.capacity) {
      throw new Error('Table capacity exceeded');
    }
  }

  guests[guestIndex] = {
    ...guests[guestIndex],
    ...updates,
  };

  await saveGuests(guests);
  await updateTableCounts();
  
  await revalidateAll();
}

export async function deleteGuest(guestId: string) {
  const guests = await getGuests();
  const filteredGuests = guests.filter(g => g.id !== guestId);
  
  await saveGuests(filteredGuests);
  await updateTableCounts();
  
  await revalidateAll();
}

export async function createTable(table: Omit<Table, 'id' | 'currentCount'>) {
  const tables = await getTables();
  
  const newTable: Table = {
    ...table,
    id: `t${Date.now()}`,
    currentCount: 0,
  };

  tables.push(newTable);
  await saveTables(tables);
  
  await revalidateAll();
}

export async function updateTable(tableId: string, updates: Partial<Table>) {
  const tables = await getTables();
  const tableIndex = tables.findIndex(t => t.id === tableId);
  
  if (tableIndex === -1) {
    throw new Error('Table not found');
  }

  tables[tableIndex] = {
    ...tables[tableIndex],
    ...updates,
  };

  await saveTables(tables);
  await revalidateAll();
}

export async function deleteTable(tableId: string) {
  const guests = await getGuests();
  const tables = await getTables();
  
  // Vérifier qu'aucun invité n'est assigné à cette table
  const hasGuests = guests.some(g => g.tableId === tableId);
  if (hasGuests) {
    throw new Error('Cannot delete table with assigned guests');
  }

  const filteredTables = tables.filter(t => t.id !== tableId);
  await saveTables(filteredTables);
  
  await revalidateAll();
}
