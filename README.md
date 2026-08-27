# 🎂 Pâtisserie Royale

Site e-commerce de haute pâtisserie artisanale. Commandez vos gâteaux d'anniversaire, pièces montées de mariage, cupcakes et créations sur-mesure.

## Stack technique

- **Framework** : [Next.js 14](https://nextjs.org/) (App Router)
- **Base de données** : [Supabase](https://supabase.com/) (optionnel — mode local disponible)
- **Styles** : [Tailwind CSS](https://tailwindcss.com/)
- **État** : [Zustand](https://zustand-demo.pmnd.rs/)
- **Déploiement** : [Vercel](https://vercel.com/)

## Démarrage en local

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env.local
# Éditez .env.local avec vos vraies valeurs

# 3. Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Variables d'environnement

Copiez `.env.example` en `.env.local` et renseignez les valeurs :

| Variable | Description | Obligatoire |
|----------|-------------|:-----------:|
| `ADMIN_DEFAULT_EMAIL` | Email de connexion administrateur | ✅ |
| `ADMIN_DEFAULT_PASSWORD` | Mot de passe administrateur (min. 10 cars, maj, min, chiffre, spécial) | ✅ |
| `ADMIN_JWT_SECRET` | Clé secrète pour signer les sessions (min. 32 caractères aléatoires) | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | URL de votre projet Supabase | Si Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique anonyme Supabase | Si Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service Supabase (côté serveur uniquement) | Si Supabase |
| `ADMIN_2FA_CODE` | Code 2FA optionnel | Non |

> ⚠️ Ne committez **jamais** `.env.local` ou tout fichier contenant de vraies clés dans Git.

## Déploiement sur Vercel

1. Poussez le projet sur GitHub
2. Importez le dépôt sur [vercel.com](https://vercel.com)
3. Dans **Settings → Environment Variables**, ajoutez toutes les variables ci-dessus
4. Cliquez **Deploy**

## Accès administrateur

- URL : `/admin/login`
- Identifiants : configurés via les variables d'environnement `ADMIN_DEFAULT_EMAIL` et `ADMIN_DEFAULT_PASSWORD`

## Pages disponibles

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil |
| `/catalogue` | Catalogue complet avec filtres |
| `/produit/[id]` | Fiche produit détaillée |
| `/panier` | Panier et commande |
| `/sur-mesure` | Formulaire gâteau personnalisé |
| `/suivi-commande` | Suivi de commande par numéro |
| `/contact` | Page de contact |
| `/admin` | Back-office (protégé) |
| `/admin/login` | Connexion administrateur |

## Scripts

```bash
npm run dev        # Serveur de développement
npm run build      # Build de production
npm run start      # Démarrer en production
npm run lint       # Vérifier le code
```
