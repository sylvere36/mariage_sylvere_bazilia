import { sql } from '@vercel/postgres';
import { Guest, Table } from './types';

// Initialisation des tables
export async function initDatabase() {
  try {
    // Créer la table tables
    await sql`
      CREATE TABLE IF NOT EXISTS tables (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        number INTEGER NOT NULL,
        description TEXT,
        capacity INTEGER NOT NULL,
        current_count INTEGER DEFAULT 0
      )
    `;

    // Créer la table guests
    await sql`
      CREATE TABLE IF NOT EXISTS guests (
        id VARCHAR(50) PRIMARY KEY,
        firstname VARCHAR(100) NOT NULL,
        lastname VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        places INTEGER NOT NULL,
        children INTEGER DEFAULT 0,
        table_id VARCHAR(50) REFERENCES tables(id),
        arrived BOOLEAN DEFAULT FALSE,
        arrival_time TIMESTAMP
      )
    `;

    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// GUESTS
export async function getGuests(): Promise<Guest[]> {
  try {
    const { rows } = await sql`SELECT * FROM guests ORDER BY lastname, firstname`;
    
    return rows.map(row => ({
      id: row.id,
      firstname: row.firstname,
      lastname: row.lastname,
      email: row.email || undefined,
      phone: row.phone || undefined,
      places: row.places,
      children: row.children,
      tableId: row.table_id,
      arrived: row.arrived,
      arrivalTime: row.arrival_time?.toISOString() || null,
    }));
  } catch (error) {
    console.error('Error getting guests:', error);
    return [];
  }
}

export async function saveGuest(guest: Guest): Promise<void> {
  const arrivalTime = guest.arrivalTime ? new Date(guest.arrivalTime).toISOString() : null;
  
  await sql`
    INSERT INTO guests (id, firstname, lastname, email, phone, places, children, table_id, arrived, arrival_time)
    VALUES (${guest.id}, ${guest.firstname}, ${guest.lastname}, ${guest.email || null}, 
            ${guest.phone || null}, ${guest.places}, ${guest.children}, ${guest.tableId}, 
            ${guest.arrived}, ${arrivalTime})
    ON CONFLICT (id) 
    DO UPDATE SET
      firstname = EXCLUDED.firstname,
      lastname = EXCLUDED.lastname,
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      places = EXCLUDED.places,
      children = EXCLUDED.children,
      table_id = EXCLUDED.table_id,
      arrived = EXCLUDED.arrived,
      arrival_time = EXCLUDED.arrival_time
  `;
}

export async function deleteGuest(guestId: string): Promise<void> {
  await sql`DELETE FROM guests WHERE id = ${guestId}`;
}

// TABLES
export async function getTables(): Promise<Table[]> {
  try {
    const { rows } = await sql`SELECT * FROM tables ORDER BY number`;
    
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      number: row.number,
      description: row.description,
      capacity: row.capacity,
      currentCount: row.current_count,
    }));
  } catch (error) {
    console.error('Error getting tables:', error);
    return [];
  }
}

export async function saveTable(table: Table): Promise<void> {
  await sql`
    INSERT INTO tables (id, name, number, description, capacity, current_count)
    VALUES (${table.id}, ${table.name}, ${table.number}, ${table.description}, 
            ${table.capacity}, ${table.currentCount})
    ON CONFLICT (id)
    DO UPDATE SET
      name = EXCLUDED.name,
      number = EXCLUDED.number,
      description = EXCLUDED.description,
      capacity = EXCLUDED.capacity,
      current_count = EXCLUDED.current_count
  `;
}

export async function deleteTable(tableId: string): Promise<void> {
  await sql`DELETE FROM tables WHERE id = ${tableId}`;
}

export async function updateTableCounts(): Promise<void> {
  try {
    // Mettre à jour le count de toutes les tables
    await sql`
      UPDATE tables t
      SET current_count = COALESCE(
        (SELECT SUM(places + children) 
         FROM guests 
         WHERE table_id = t.id),
        0
      )
    `;
  } catch (error) {
    console.error('Error updating table counts:', error);
  }
}
