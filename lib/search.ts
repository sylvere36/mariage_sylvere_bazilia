import Fuse from 'fuse.js';
import { Guest } from './types';

export function searchGuests(guests: Guest[], query: string): Guest[] {
  if (!query.trim()) {
    return [];
  }

  const fuse = new Fuse(guests, {
    keys: [
      { name: 'name', weight: 2 },
    ],
    threshold: 0.3,
    includeScore: true,
  });

  const results = fuse.search(query);
  return results.map(result => result.item);
}

export function findExactGuest(guests: Guest[], query: string): Guest | null {
  const normalizedQuery = query.toLowerCase().trim();
  
  return guests.find(guest => {
    const name = guest.name.toLowerCase();
    
    return name === normalizedQuery || name.includes(normalizedQuery);
  }) || null;
}
