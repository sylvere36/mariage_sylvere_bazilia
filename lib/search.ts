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

  // Recherche par sous-chaîne d'abord (plus rapide et plus intuitif)
  const substringMatches = guests.filter(guest => {
    const name = normalizeString(guest.name);
    return name.includes(normalizedQuery);
  });

  // Si on trouve des résultats exacts, les retourner
  if (substringMatches.length > 0) {
    return substringMatches;
  }

  // Sinon, utiliser fuzzy search pour les fautes de frappe
  const fuse = new Fuse(guests, {
    keys: [
      { name: 'name', weight: 2 },
    ],
    threshold: 0.5,
    ignoreLocation: true,
    distance: 100,
    minMatchCharLength: 2,
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
  
  // Chercher une correspondance exacte complète
  const exactMatch = guests.find(guest => {
    const name = normalizeString(guest.name);
    return name === normalizedQuery;
  });
  
  if (exactMatch) return exactMatch;
  
  // Si un seul invité contient la requête, le considérer comme match exact
  const matches = guests.filter(guest => {
    const name = normalizeString(guest.name);
    return name.includes(normalizedQuery);
  });
  
  // Retourner le match seulement s'il est unique
  return matches.length === 1 ? matches[0] : null;
}
