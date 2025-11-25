import { put, head, list } from '@vercel/blob';
import { Guest, Table } from './types';

const BLOB_STORE_PREFIX = 'wedding-data';

export async function getGuests(): Promise<Guest[]> {
  try {
    if (process.env.NODE_ENV === 'development') {
      // En développement, utiliser le fichier local
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'data', 'guests.json');
      
      try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
      } catch (error) {
        // Si le fichier n'existe pas, créer un tableau vide
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, JSON.stringify([], null, 2));
        return [];
      }
    }

    // En production, utiliser Vercel Blob
    const blobUrl = `${BLOB_STORE_PREFIX}/guests.json`;
    const response = await fetch(`https://blob.vercel-storage.com/${blobUrl}`);
    
    if (!response.ok) {
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting guests:', error);
    return [];
  }
}

export async function saveGuests(guests: Guest[]): Promise<void> {
  try {
    const data = JSON.stringify(guests, null, 2);

    if (process.env.NODE_ENV === 'development') {
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'data', 'guests.json');
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, data);
      return;
    }

    // En production, utiliser Vercel Blob
    await put(`${BLOB_STORE_PREFIX}/guests.json`, data, {
      access: 'public',
      contentType: 'application/json',
    });
  } catch (error) {
    console.error('Error saving guests:', error);
    throw error;
  }
}

export async function getTables(): Promise<Table[]> {
  try {
    if (process.env.NODE_ENV === 'development') {
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'data', 'tables.json');
      
      try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
      } catch (error) {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, JSON.stringify([], null, 2));
        return [];
      }
    }

    const blobUrl = `${BLOB_STORE_PREFIX}/tables.json`;
    const response = await fetch(`https://blob.vercel-storage.com/${blobUrl}`);
    
    if (!response.ok) {
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting tables:', error);
    return [];
  }
}

export async function saveTables(tables: Table[]): Promise<void> {
  try {
    const data = JSON.stringify(tables, null, 2);

    if (process.env.NODE_ENV === 'development') {
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'data', 'tables.json');
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, data);
      return;
    }

    await put(`${BLOB_STORE_PREFIX}/tables.json`, data, {
      access: 'public',
      contentType: 'application/json',
    });
  } catch (error) {
    console.error('Error saving tables:', error);
    throw error;
  }
}

// Helpers pour mettre à jour le count des tables
export async function updateTableCounts(): Promise<void> {
  const [guests, tables] = await Promise.all([getGuests(), getTables()]);
  
  const tableCounts = guests.reduce((acc, guest) => {
    const totalPlaces = guest.places + guest.children;
    acc[guest.tableId] = (acc[guest.tableId] || 0) + totalPlaces;
    return acc;
  }, {} as Record<string, number>);

  const updatedTables = tables.map(table => ({
    ...table,
    currentCount: tableCounts[table.id] || 0
  }));

  await saveTables(updatedTables);
}
