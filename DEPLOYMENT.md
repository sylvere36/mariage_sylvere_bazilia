# Guide de Déploiement

## 🚀 Déploiement sur Vercel

### Étape 1 : Préparer le Repository

1. Initialisez un repo Git si pas encore fait :
```bash
git init
git add .
git commit -m "Initial commit: Wedding guest management app"
```

2. Créez un repo sur GitHub et poussez le code :
```bash
git remote add origin https://github.com/votre-username/mariage.git
git branch -M main
git push -u origin main
```

### Étape 2 : Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Import Project"
3. Sélectionnez votre repository GitHub
4. Configurez les variables d'environnement :
   - `ADMIN_PASSWORD` : choisissez un mot de passe sécurisé

### Étape 3 : Configurer Vercel Blob

Vercel Blob est automatiquement configuré. Aucune action supplémentaire nécessaire.

### Étape 4 : Tester

1. Une fois déployé, accédez à votre URL Vercel
2. Testez la recherche d'invités sur la page d'accueil
3. Connectez-vous à `/admin/login` avec votre mot de passe
4. Vérifiez toutes les fonctionnalités

## 📱 Configuration pour les Hôtesses

### Option 1 : Partager l'URL
Envoyez simplement l'URL de votre site aux hôtesses :
```
https://votre-app.vercel.app
```

### Option 2 : Créer un raccourci mobile

**Sur iPhone :**
1. Ouvrir Safari et aller sur le site
2. Appuyer sur l'icône de partage
3. Sélectionner "Sur l'écran d'accueil"
4. L'application s'affiche comme une app native !

**Sur Android :**
1. Ouvrir Chrome et aller sur le site
2. Appuyer sur les 3 points (menu)
3. Sélectionner "Ajouter à l'écran d'accueil"

## 🔐 Sécurité

### Changer le mot de passe admin

1. Sur Vercel Dashboard, allez dans votre projet
2. Cliquez sur "Settings" > "Environment Variables"
3. Modifiez `ADMIN_PASSWORD`
4. Redéployez l'application

### Sauvegarder les données

Les données sont stockées sur Vercel Blob. Pour une sauvegarde :
1. Exportez le PDF depuis `/admin/export`
2. Ou téléchargez les fichiers JSON via l'API :
   - `https://votre-app.vercel.app/api/sync`

## 🐛 Dépannage

### Les modifications ne se synchronisent pas
- Vérifiez votre connexion internet
- Rafraîchissez la page (pull to refresh sur mobile)
- Le polling se fait toutes les 2 secondes

### Erreur "Table capacity exceeded"
- Une table ne peut contenir que 10 personnes maximum
- Vérifiez l'occupation de la table dans `/admin/tables`

### Impossible de se connecter à l'admin
- Vérifiez que `ADMIN_PASSWORD` est bien configuré sur Vercel
- Essayez en navigation privée
- Videz le cache du navigateur

## 📊 Monitoring

Vercel fournit automatiquement :
- Analytics des visiteurs
- Logs d'erreurs
- Performance monitoring

Accédez-y depuis votre Dashboard Vercel.

## 🔄 Mises à jour

Pour mettre à jour l'application :

```bash
git add .
git commit -m "Description des changements"
git push
```

Vercel redéploiera automatiquement !

## ✅ Checklist finale

Avant l'événement :

- [ ] Application déployée et accessible
- [ ] Toutes les tables créées
- [ ] Tous les invités ajoutés et assignés aux tables
- [ ] Mot de passe admin sécurisé
- [ ] URLs partagées avec les hôtesses
- [ ] Raccourcis mobile installés sur les téléphones
- [ ] Test de la synchronisation entre plusieurs appareils
- [ ] Export PDF généré comme référence

Bon mariage ! 💍✨
