---
agent: agent
---
# Spécification complète – Application Next.js pour Gestion d’Invités de Mariage

Ce document décrit **toutes les fonctionnalités**, **l'architecture**, **l'organisation des fichiers**, ainsi que la **préparation au déploiement Vercel**, pour que GitHub Copilot puisse générer l'intégralité du projet.

> **Contraintes importantes :**
> - **Pas de base de données externe**.
> - **Données synchronisées en temps réel sur plusieurs téléphones** (3 hôtesses).
> - Utilisation **Next.js 14 App Router**, **Edge Runtime**, **Server Actions**, **Server Components**.
> - Stockage **via un fichier JSON dans /app/data** + **caching & revalidation**.
> - Mise en place d’un pseudo temps réel grâce à **Middleware + Revalidate Tag + Polling léger (2s)**.
> - Le site doit être optimisé pour mobile.

---

# 1. Fonctionnalités Principales

## ✔️ Page d’accueil (`/`)
- Affichage :
  - **Nom de l’événement**
  - **Date & lieu de réception**
  - **Champ de recherche (invité, famille, email, tel)**
- Lorsque l'hôtesse recherche :
  - Si le nom correspond → afficher la fiche de l’invité.
  - Si non trouvé → afficher *liste probable* (fuzzy search).
- Fiche invité :
  - Nom + prénom
  - Nombre de places allouées
  - Nombre d’enfants
  - Table associée : nom + numéro
  - Description de la table
  - **Bouton "Invité arrivé ✔️"**
  - Si déjà arrivé → afficher "Déjà validé" + heure
- Mise à jour instantanée sur les autres appareils : via revalidateTag.

---

## ✔️ Page Admin (`/admin`)
### Gestion des tables
- Création / édition / suppression.
- Une table contient :
  - Numéro
  - Nom
  - Description (optionnel)
  - Capacité **max 10 personnes**
  - Occupation actuelle (barre de progression automatique)

### Gestion des invités
- Ajouter / modifier / supprimer
- Associer un invité à une table (check capacité max)
- Rechercher un invité
- Filtrer :
  - Tous
  - Par table
  - Arrivés / non arrivés

### Export PDF
- Bouton "Exporter PDF" → PDF stylé "liste par table"
- Structure PDF :
  - Titre + date
  - Chaque table avec liste d’invités, enfants, arrivée ou non.
  - Logo du mariage (optionnel)

---

## ✔️ Données & Structure JSON
Deux fichiers :
- `data/guests.json`
- `data/tables.json`

Les deux sont modifiés via **Server Actions** et GitHub Copilot pourra générer les helpers.

### Exemple `tables.json`
```json
[
  {
    "id": "t1",
    "name": "Table des Mariés",
    "number": 1,
    "description": "Famille proche",
    "capacity": 10,
    "currentCount": 6
  }
]
```

### Exemple `guests.json`
```json
[
  {
    "id": "g1",
    "firstname": "Jean",
    "lastname": "Dupont",
    "places": 2,
    "children": 1,
    "tableId": "t1",
    "arrived": false,
    "arrivalTime": null
  }
]
```

---

# 2. Architecture du Projet Next.js
```
/app
  /admin
    page.tsx
    tables/
      page.tsx
      TableForm.tsx
    guests/
      page.tsx
      GuestForm.tsx
  /api
    /sync
      route.ts (invalidateTag pour temps réel)
  page.tsx (Accueil)
  search.tsx (composant recherche)
  guest-card.tsx
  layout.tsx
/data
  tables.json
  guests.json
/lib
  data.ts (helpers pour lire/écrire JSON)
  search.ts (fuzzy search)
  pdf.ts (générateur PDF)
/components
  ui/* (shadcn UI ou composants customs)
```

---

# 3. Temps réel sans base de données
> ⚡ Objectif : mise à jour instantanée entre 3 téléphones sans DB.

Solution :
- Les données sont stockées dans des fichiers JSON.
- Dès qu’une hôtesse modifie un invité → **Server Action** modifie le fichier JSON.
- Cette action appelle :
  ```ts
  revalidateTag("guests");
  revalidateTag("tables");
  ```
- Les pages du client utilisent :
  ```ts
  fetch("/api/sync", { next: { tags: ["guests"] } })
  ```
- Et un **polling léger (1–2s)** côté client pour rafraîchir.

---

# 4. Pages & Composants

## Page d’accueil (`/`)
Contient :
- Banner mariage
- SearchBox
- GuestCard (si trouvé)
- ListSimilarGuests (si fuzzy match)

## Page Admin
### `/admin` → Dashboard
- Nombre total d’invités
- Nombre d’arrivés
- Capacité totale / utilisée
- Boutons :
  - "Gérer les tables"
  - "Gérer les invités"
  - "Exporter PDF"

### `/admin/tables`
- Liste des tables
- Formulaire CRUD

### `/admin/guests`
- Liste complète
- Filtres + search
- Formulaire CRUD

---

# 5. Génération du PDF
- Utiliser `pdf-lib` ou `@react-pdf/renderer` (Copilot choisira)
- Structure élégante avec :
  - En-tête : noms des mariés + date
  - Liste par table
- Génération via route API `/admin/export/pdf`

---

# 6. Style & UX
- Typo élégante (Playfair Display, Inter)
- Design "wedding theme": couleurs pastel
- Responsive mobile first
- Des boutons grands et lisibles pour hôtesses
- Utilisation de shadcn/ui pour composants (Copilot sait les générer)

---

# 7. Déploiement Vercel
### À ajouter dans le projet :
- `vercel.json` minimal :
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Recommandations :
- Activer **Edge Runtime**
- Utiliser les **Server Actions** sans configuration
- Les fichiers JSON seront stockés dans `/data` → Vercel les traite comme fichier statique mais modifiable via Server Actions (Copilot gère le patch)

⚠️ Attention : en production Vercel, on doit utiliser le **Blob Store** pour rendre les JSON modifiables.
Copilot doit donc :
- Ajouter un utilitaire `lib/blob.ts` utilisant `@vercel/blob`
- Lire/écrire dedans au lieu de fichiers locaux.

---

# 8. Spécification pour GitHub Copilot (instructions directes)
Copilot doit :
1. Générer un projet complet Next.js 14 avec App Router.
2. Créer toutes les pages : `/`, `/admin`, `/admin/tables`, `/admin/guests`.
3. Implémenter :
   - Fuzzy search
   - CRUD tables
   - CRUD invités
   - mise à jour "invité arrivé"
4. Stocker données via **Vercel Blob**.
5. Implémenter revalidateTag + polling client.
6. Créer un export PDF.
7. Un design beau, sobre et élégant.
8. Fonctionnalités optimisées mobile.
9. Proposer une seed de données initiales.
10. Fournir scripts npm utiles :
   ```
   npm run dev
   npm run build
   npm run vercel:deploy
   ```

---

# 9. Bonus / Détails supplémentaires à intégrer
- Historique optionnel des arrivées (audit minimal)
- Protection `/admin` par mot de passe simple (middleware + prompt)
- Ajout d’un bouton "Annuler arrivée" si erreur
- Animation "pop" quand un invité est validé
- Auto-focus du champ de recherche
- Mode "liste par table" optimisé pour consultation
- Mode hors-ligne limité possible grâce au caching

---

### **Ce fichier est complet et prêt à être utilisé par Copilot pour générer tout le projet.**
