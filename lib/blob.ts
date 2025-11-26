import { put, list } from '@vercel/blob';
import { Guest, Table } from './types';

const BLOB_STORE_PREFIX = 'wedding-data';

async function getBlobData<T>(filename: string): Promise<T[]> {
  try {
    // Lister tous les blobs et trouver celui qui correspond
    const { blobs } = await list({ prefix: `${BLOB_STORE_PREFIX}/${filename}` });
    
    if (blobs.length === 0) {
      console.log(`No blob found for ${filename}, returning empty array`);
      return [];
    }
    
    // Récupérer le premier blob (le plus récent)
    const blob = blobs[0];
    const response = await fetch(blob.url);
    
    if (!response.ok) {
      console.error(`Failed to fetch blob ${filename}:`, response.status);
      return [];
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error getting blob ${filename}:`, error);
    return [];
  }
}

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
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not configured, using empty array');
      return [];
    }

    return await getBlobData<Guest>('guests.json');
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
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('BLOB_READ_WRITE_TOKEN not configured. Please add Vercel Blob Store.');
    }

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

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not configured, using empty array');
      return [];
    }

    return await getBlobData<Table>('tables.json');
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

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('BLOB_READ_WRITE_TOKEN not configured. Please add Vercel Blob Store.');
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
  try {
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
  } catch (error) {
    console.error('Error updating table counts:', error);
    // Ne pas propager l'erreur pour ne pas bloquer l'opération principale
  }
}
