import Fuse from 'fuse.js';
import { Guest } from './types';

// Normaliser une chaîne : enlever accents, convertir en minuscules, enlever espaces multiples
function normalizeString(str: string): string {
  return str
    .normalize('NFD') // Décomposer les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' '); // Remplacer les espaces multiples par un seul
}

export function searchGuests(guests: Guest[], query: string): Guest[] {
  if (!query.trim()) {
    return [];
  }

  const normalizedQuery = normalizeString(query);

  const fuse = new Fuse(guests, {
    keys: [
      { name: 'name', weight: 2 },
    ],
    threshold: 0.4, // Plus tolérant pour les fautes de frappe
    ignoreLocation: true, // Chercher dans toute la chaîne
    includeScore: true,
    getFn: (obj, path) => {
      const value = obj[path[0] as keyof Guest];
      return typeof value === 'string' ? normalizeString(value) : '';
    },
  });

  const results = fuse.search(normalizedQuery);
  return results.map(result => result.item);
}

export function findExactGuest(guests: Guest[], query: string): Guest | null {
  const normalizedQuery = normalizeString(query);
  
  return guests.find(guest => {
    const name = normalizeString(guest.name);
    
    return name === normalizedQuery || name.includes(normalizedQuery);
  }) || null;
}
