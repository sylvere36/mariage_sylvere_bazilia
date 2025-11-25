import Fuse from 'fuse.js';
import { Guest } from './types';

export function searchGuests(guests: Guest[], query: string): Guest[] {
  if (!query.trim()) {
    return [];
  }

  const fuse = new Fuse(guests, {
    keys: [
      { name: 'firstname', weight: 2 },
      { name: 'lastname', weight: 2 },
      { name: 'email', weight: 1 },
      { name: 'phone', weight: 1 },
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
    const fullName = `${guest.firstname} ${guest.lastname}`.toLowerCase();
    const reverseName = `${guest.lastname} ${guest.firstname}`.toLowerCase();
    const email = guest.email?.toLowerCase() || '';
    const phone = guest.phone || '';
    
    return fullName === normalizedQuery || 
           reverseName === normalizedQuery ||
           email === normalizedQuery ||
           phone === normalizedQuery;
  }) || null;
}
