# LVMH Careers CLI

**Documentation Confluence ici** → [Confluence Docs](https://mohamedtahiri.atlassian.net/wiki/external/MGFlN2M1OWJjMGI4NGJmMDgxYmNlMjMxODM0NWEwNTQ)

**English documentation here** → [README.md](README.md)

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.3-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-green.svg)
![License](https://img.shields.io/badge/license-ISC-yellow.svg)
[![npm version](https://img.shields.io/npm/v/lvmh-careers-cli.svg?logo=npm)](https://www.npmjs.com/package/lvmh-careers-cli)

Une interface en ligne de commande (CLI) pour rechercher et gérer les offres d'emploi de la plateforme LVMH Careers.

</div>

---

## 📋 Table des matières

- [1. Présentation Fonctionnelle](#1-présentation-fonctionnelle)
  - [1.1 Lancement rapide](#11-lancement-rapide)
  - [1.2 Vue d'ensemble](#12-vue-densemble)
  - [1.3 Fonctionnalités principales](#13-fonctionnalités-principales)
  - [1.4 Commandes disponibles](#14-commandes-disponibles)
- [2. Documentation Technique](#2-documentation-technique)
  - [2.1 Prérequis](#21-prérequis)
  - [2.2 Installation](#22-installation)
  - [2.3 Architecture du projet](#23-architecture-du-projet)
  - [2.4 Stack technique](#24-stack-technique)
  - [2.5 Scripts disponibles](#25-scripts-disponibles)
  - [2.6 Configuration](#26-configuration)
  - [2.7 CI/CD](#27-cicd)

---

## 1. Présentation Fonctionnelle

### 1.1 Lancement rapide

Installez le CLI globalement :

```bash
npm install -g lvmh-careers-cli
```

Puis lancez la commande suivante :

```bash
lvmh-careers search
```

### 1.2 Vue d'ensemble

LVMH Careers CLI est un outil en ligne de commande permettant d'explorer les opportunités de carrière du groupe LVMH directement depuis votre terminal. L'application offre une interface interactive et intuitive pour rechercher, consulter et sauvegarder vos offres d'emploi favorites.

### 1.3 Fonctionnalités principales

#### 🔍 Recherche d'offres

- Recherche par mots-clés dans les offres d'emploi LVMH
- Navigation paginée des résultats
- Affichage détaillé des offres (titre, société, localisation, contrat, date de publication)
- Ouverture directe des offres dans le navigateur
- Export des résultats en JSON
- Copie des URL d'offres dans le presse-papiers

#### ⭐ Gestion des favoris

- Sauvegarde des offres favorites localement
- Consultation des offres sauvegardées hors-ligne
- Navigation dans vos offres favorites
- Support de formats de stockage JSON et XML

#### 💾 Requêtes sauvegardées

- Enregistrement de vos recherches personnalisées
- Exécution rapide de recherches récurrentes
- Gestion de vos requêtes favorites

#### 🌍 Support multilingue

- Interface disponible en Français (fr-fr) et Anglais (en-us)
- Recherche dans les offres selon la locale configurée

#### ⚙️ Configuration personnalisable

- Assistant de configuration interactive
- Personnalisation du nombre de résultats par page
- Choix du format de stockage (JSON/XML)
- Reconfiguration à tout moment

### 1.4 Commandes disponibles

#### `lvmh-careers init`

Initialise ou reconfigure les paramètres du CLI.

**Options configurables :**

- Langue d'interface (fr-fr / en-us)
- Nombre de résultats par page
- Format de stockage des favoris (JSON / XML)

```bash
lvmh-careers init
```

#### `lvmh-careers search`

Recherche des offres d'emploi sur la plateforme LVMH Careers.

**Options :**

- `-q, --query <query>` : Terme de recherche
- `-n, --number <number>` : Nombre de résultats par page
- `-p, --page <page>` : Numéro de page
- `-r, --raw` : Afficher les résultats en JSON brut

**Exemples :**

```bash
# Recherche interactive
lvmh-careers search

# Recherche avec terme spécifique
lvmh-careers search -q "développeur"

# Export JSON des résultats
lvmh-careers search -q "marketing" -n 20 -r
```

**Actions disponibles lors de la navigation :**

- Consulter une offre en détail
- Ouvrir l'offre dans le navigateur
- Ajouter aux favoris
- Copier l'URL
- Sauvegarder la recherche
- Navigation (page suivante/précédente)

#### `lvmh-careers offers`

Affiche et navigue dans vos offres favorites sauvegardées.

```bash
lvmh-careers offers
```

**Fonctionnalités :**

- Consultation hors-ligne des offres sauvegardées
- Navigation paginée
- Accès aux détails complets
- Retrait des favoris

#### `lvmh-careers queries`

Affiche et exécute vos requêtes de recherche sauvegardées.

```bash
lvmh-careers queries
```

**Fonctionnalités :**

- Liste de toutes vos recherches sauvegardées
- Exécution immédiate d'une recherche favorite
- Navigation interactive des résultats

#### `lvmh-careers clear`

Efface toutes les données locales (favoris et requêtes sauvegardées).

```bash
lvmh-careers clear
```

---

## 2. Documentation Technique

### 2.1 Prérequis

- **Node.js** : Version 22.0.0 ou supérieure
- **npm** : Installé avec Node.js

### 2.2 Installation

#### Installation globale (recommandée)

```bash
npm install -g lvmh-careers-cli
```

#### Installation depuis les sources

```bash
# Cloner le dépôt
git clone https://github.com/moha-tah/lvmh-careers-cli
cd lvmh-careers-cli

# Installer les dépendances
npm install

# Compiler le projet
npm run build

# Lier globalement
npm link
```

### 2.3 Architecture du projet

```
lvmh-careers-cli/
├── src/
│   ├── api/                    # Couche API
│   │   ├── dtos/              # Data Transfer Objects
│   │   │   ├── inputs/        # DTOs d'entrée
│   │   │   └── outputs/       # DTOs de sortie
│   │   └── LVMH.ts            # Client API LVMH
│   ├── commands/              # Commandes CLI
│   │   ├── init.ts            # Initialisation/configuration
│   │   ├── search.ts          # Recherche d'offres
│   │   ├── fav-offers.ts      # Gestion des offres favorites
│   │   ├── fav-queries.ts     # Gestion des requêtes favorites
│   │   ├── clear.ts           # Nettoyage des données
│   │   └── index.ts           # Export des commandes
│   ├── components/            # Composants réutilisables
│   │   ├── offers/            # Composants liés aux offres
│   │   │   ├── display-offers.ts      # Affichage des offres
│   │   │   ├── offer-navigation.ts    # Navigation paginée
│   │   │   └── offer-selection.ts     # Sélection d'offres
│   │   ├── base-command.ts    # Classe de base pour les commandes
│   │   ├── logo.ts            # Affichage du logo
│   │   └── setup.ts           # Assistant de configuration
│   ├── config/                # Configuration
│   │   ├── index.ts           # Instance de configuration
│   │   ├── schema.ts          # Schéma de configuration
│   │   └── is-config-valid.function.ts
│   ├── utils/                 # Utilitaires
│   │   ├── constants.ts       # Constantes globales
│   │   ├── types.ts           # Types TypeScript
│   │   ├── get-config-dir.ts  # Gestion du répertoire de config
│   │   ├── get-favorites-from-file.ts
│   │   ├── set-favorites-to-file.ts
│   │   ├── offers-from-file.ts
│   │   └── queries-from-file.ts
│   └── index.ts               # Point d'entrée principal
├── dist/                      # Fichiers compilés (généré)
├── .github/
│   └── workflows/
│       └── npm_publish.yml    # Pipeline CI/CD
├── package.json
├── tsconfig.json
└── eslint.config.js
```

### 2.4 Stack technique

#### Dépendances principales

| Package             | Version | Usage                                            |
| ------------------- | ------- | ------------------------------------------------ |
| **commander**       | ^14.0.1 | Framework CLI (gestion des commandes et options) |
| **enquirer**        | ^2.4.1  | Prompts interactifs (menus, saisies)             |
| **chalk**           | ^5.6.2  | Coloration du terminal                           |
| **conf**            | ^15.0.0 | Gestion de la configuration persistante          |
| **open**            | ^10.2.0 | Ouverture d'URLs dans le navigateur              |
| **clipboardy**      | ^5.0.0  | Gestion du presse-papiers                        |
| **fast-xml-parser** | ^5.2.5  | Parsing et génération XML                        |
| **typescript**      | ^5.9.2  | Langage de développement                         |

#### Dépendances de développement

| Package                 | Version | Usage                                 |
| ----------------------- | ------- | ------------------------------------- |
| **tsx**                 | ^4.20.6 | Exécution TypeScript en développement |
| **eslint**              | ^9.36.0 | Linting du code                       |
| **@typescript-eslint/** | ^8.45.0 | Configuration ESLint pour TypeScript  |
| **prettier**            | ^3.6.2  | Formatage du code                     |
| **@types/node**         | ^24.6.0 | Types TypeScript pour Node.js         |

### 2.5 Scripts disponibles

```bash
# Développement
npm run dev              # Lance le CLI en mode développement (tsx)

# Build
npm run build            # Compile TypeScript vers dist/

# Exécution
npm start                # Lance le CLI compilé

# Qualité de code
npm run typecheck        # Vérification des types TypeScript
npm run lint             # Linting avec ESLint
npm run lint:fix         # Correction automatique des erreurs de lint
npm run format           # Formatage avec Prettier

# Tests
npm test                 # Pas encore implémenté
```

### 2.6 Configuration

#### Schéma de configuration

```typescript
type ConfigSchema = {
  locale: 'fr-fr' | 'en-us'; // Langue de l'interface
  hitsPerPage: number; // Résultats par page (défaut: 5)
  storageType: 'json' | 'xml'; // Format de stockage
  favoriteOffers: OfferHitDTO[]; // (Géré par conf)
};
```

#### Fichiers de configuration

La configuration est stockée via le package `conf` dans :

- **macOS/Linux** : `~/.config/lvmh-careers-cli/`
- **Windows** : `%APPDATA%\lvmh-careers-cli\`

**Fichiers générés :**

- `config.json` : Configuration principale
- `favorite-offers.[json|xml]` : Offres favorites
- `favorite-queries.[json|xml]` : Requêtes sauvegardées

#### API LVMH

```typescript
const LVMH_API_URL = 'https://www.lvmh.com/api/search';
const LVMH_API_BASE_INDEX_NAME = 'PRD-{{locale}}-timestamp-desc';
const LVMH_OFFER_BASE_URL = 'https://www.lvmh.com/join-us/our-job-offers/';
```

### 2.7 CI/CD

#### GitHub Actions Workflow

Le projet utilise GitHub Actions pour automatiser la publication sur npm.

**Pipeline** ([npm_publish.yml](.github/workflows/npm_publish.yml)) :

```yaml
Déclencheur: release créée
Jobs:
  1. lint          # Vérification du code
  2. typecheck     # Vérification des types
  3. test          # Exécution des tests
  4. publish-npm   # Publication sur npm (après validation)
```

**Configuration requise :**

- Node.js 22.x

**Étapes de publication :**

1. Créer une nouvelle release sur GitHub
2. Le workflow s'exécute automatiquement
3. Validation (lint + typecheck + test)
4. Publication sur npm si tous les checks passent

---

## 📝 License

ISC

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.
