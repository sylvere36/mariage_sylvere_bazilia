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
    threshold: 0.5, // Encore plus tolérant
    ignoreLocation: true, // Chercher dans toute la chaîne
    distance: 100, // Augmenter la distance de recherche
    minMatchCharLength: 2, // Minimum 2 caractères pour matcher
    includeScore: true,
    useExtendedSearch: false,
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
  
  // D'abord chercher une correspondance exacte complète
  const exactMatch = guests.find(guest => {
    const name = normalizeString(guest.name);
    return name === normalizedQuery;
  });
  
  if (exactMatch) return exactMatch;
  
  // Ensuite chercher si la requête est contenue dans le nom (minimum 4 caractères)
  if (normalizedQuery.length >= 4) {
    const partialMatch = guests.find(guest => {
      const name = normalizeString(guest.name);
      return name.includes(normalizedQuery);
    });
    
    if (partialMatch) return partialMatch;
  }
  
  return null;
}
