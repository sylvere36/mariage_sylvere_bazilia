# Application de Gestion d'Invités pour Mariage

Application Next.js 14 pour gérer les invités de mariage en temps réel sur plusieurs appareils.

## 🚀 Fonctionnalités

- ✨ **Page d'accueil** : Recherche d'invités avec fuzzy search
- 📱 **Optimisé mobile** : Interface responsive pour les hôtesses
- ✅ **Validation d'arrivée** : Marquer les invités comme arrivés en temps réel
- 🪑 **Gestion des tables** : CRUD complet avec capacité max 10 personnes
- 👥 **Gestion des invités** : Ajouter, modifier, supprimer avec assignation aux tables
- 📄 **Export PDF** : Génération de liste élégante des invités par table
- 🔐 **Protection admin** : Authentification par mot de passe
- ⚡ **Temps réel** : Synchronisation automatique entre appareils (polling 2s)

## 🛠️ Technologies

- **Next.js 14** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le style
- **Vercel Blob** pour le stockage des données
- **@react-pdf/renderer** pour l'export PDF
- **Fuse.js** pour la recherche fuzzy

## 📦 Installation

\`\`\`bash
npm install
cp .env.example .env.local
npm run dev
\`\`\`

Ouvrez [http://localhost:3000](http://localhost:3000)

## 🔑 Authentification

Mot de passe admin par défaut : \`admin123\`

## 🚀 Déploiement sur Vercel

1. Pushez le code sur GitHub
2. Importez le projet sur Vercel
3. Configurez la variable \`ADMIN_PASSWORD\`
4. Déployez !

## 📱 Utilisation

### Pour les hôtesses
1. Recherchez un invité
2. Cliquez sur "Invité arrivé ✓"

### Pour les administrateurs
1. Accédez à \`/admin/login\`
2. Gérez tables et invités
3. Exportez en PDF

## 👨‍💻 Développé avec ❤️ par @sylvere36
