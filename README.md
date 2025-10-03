# LVMH Careers CLI

**Confluence version here** → [Confluence Docs](https://mohamedtahiri.atlassian.net/wiki/external/MGFlN2M1OWJjMGI4NGJmMDgxYmNlMjMxODM0NWEwNTQ)

**Documentation en français ici** → [README-FR.md](README-FR.md)

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.3-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-green.svg)
![License](https://img.shields.io/badge/license-ISC-yellow.svg)

A command-line interface (CLI) to search and manage job offers from the LVMH Careers platform.

</div>

---

## 📋 Table of Contents

- [1. Functional Overview](#1-functional-overview)
  - [1.1 Quick Start](#11-quick-start)
  - [1.2 Overview](#12-overview)
  - [1.3 Main Features](#13-main-features)
  - [1.4 Available Commands](#14-available-commands)
- [2. Technical Documentation](#2-technical-documentation)
  - [2.1 Prerequisites](#21-prerequisites)
  - [2.2 Installation](#22-installation)
  - [2.3 Project Architecture](#23-project-architecture)
  - [2.4 Technical Stack](#24-technical-stack)
  - [2.5 Available Scripts](#25-available-scripts)
  - [2.6 Configuration](#26-configuration)
  - [2.7 CI/CD](#27-cicd)

---

## 1. Functional Overview

### 1.1 Quick Start

Install the CLI globally:

```bash
npm install -g lvmh-careers-cli
```

Then run the following command:

```bash
lvmh-careers search
```

### 1.2 Overview

LVMH Careers CLI is a command-line tool that allows you to explore career opportunities within the LVMH group directly from your terminal. The application provides an interactive and intuitive interface to search, view, and save your favorite job offers.

### 1.3 Main Features

#### 🔍 Job Search

- Search by keywords in LVMH job offers
- Paginated navigation of results
- Detailed display of offers (title, company, location, contract, publication date)
- Direct opening of offers in the browser
- Export of results in JSON format
- Copy offer URLs to clipboard

#### ⭐ Favorites Management

- Save favorite offers locally
- View saved offers offline
- Navigate through your favorite offers
- Support for JSON and XML storage formats

#### 💾 Saved Queries

- Save your custom searches
- Quick execution of recurring searches
- Manage your favorite queries

#### 🌍 Multilingual Support

- Interface available in French (fr-fr) and English (en-us)
- Search in offers according to the configured locale

#### ⚙️ Customizable Configuration

- Interactive configuration assistant
- Customize the number of results per page
- Choose storage format (JSON/XML)
- Reconfigure at any time

### 1.4 Available Commands

#### `lvmh-careers init`

Initialize or reconfigure CLI settings.

**Configurable options:**

- Interface language (fr-fr / en-us)
- Number of results per page
- Favorites storage format (JSON / XML)

```bash
lvmh-careers init
```

#### `lvmh-careers search`

Search for job offers on the LVMH Careers platform.

**Options:**

- `-q, --query <query>` : Search term
- `-n, --number <number>` : Number of results per page
- `-p, --page <page>` : Page number
- `-r, --raw` : Display results in raw JSON

**Examples:**

```bash
# Interactive search
lvmh-careers search

# Search with specific term
lvmh-careers search -q "developer"

# Export JSON results
lvmh-careers search -q "marketing" -n 20 -r
```

**Available actions during navigation:**

- View offer details
- Open offer in browser
- Add to favorites
- Copy URL
- Save search
- Navigation (next/previous page)

#### `lvmh-careers offers`

Display and navigate through your saved favorite offers.

```bash
lvmh-careers offers
```

**Features:**

- Offline viewing of saved offers
- Paginated navigation
- Access to complete details
- Remove from favorites

#### `lvmh-careers queries`

Display and execute your saved search queries.

```bash
lvmh-careers queries
```

**Features:**

- List of all your saved searches
- Immediate execution of a favorite search
- Interactive navigation of results

#### `lvmh-careers clear`

Clear all local data (favorites and saved queries).

```bash
lvmh-careers clear
```

---

## 2. Technical Documentation

### 2.1 Prerequisites

- **Node.js**: Version 22.0.0 or higher
- **npm**: Installed with Node.js

### 2.2 Installation

#### Global installation (recommended)

```bash
npm install -g lvmh-careers-cli
```

#### Installation from source

```bash
# Clone the repository
git clone https://github.com/moha-tah/lvmh-careers-cli
cd lvmh-careers-cli

# Install dependencies
npm install

# Build the project
npm run build

# Link globally
npm link
```

### 2.3 Project Architecture

```
lvmh-careers-cli/
├── src/
│   ├── api/                    # API layer
│   │   ├── dtos/              # Data Transfer Objects
│   │   │   ├── inputs/        # Input DTOs
│   │   │   └── outputs/       # Output DTOs
│   │   └── LVMH.ts            # LVMH API client
│   ├── commands/              # CLI commands
│   │   ├── init.ts            # Initialization/configuration
│   │   ├── search.ts          # Job search
│   │   ├── fav-offers.ts      # Favorite offers management
│   │   ├── fav-queries.ts     # Favorite queries management
│   │   ├── clear.ts           # Data cleanup
│   │   └── index.ts           # Commands export
│   ├── components/            # Reusable components
│   │   ├── offers/            # Offer-related components
│   │   │   ├── display-offers.ts      # Offer display
│   │   │   ├── offer-navigation.ts    # Paginated navigation
│   │   │   └── offer-selection.ts     # Offer selection
│   │   ├── base-command.ts    # Base class for commands
│   │   ├── logo.ts            # Logo display
│   │   └── setup.ts           # Configuration assistant
│   ├── config/                # Configuration
│   │   ├── index.ts           # Configuration instance
│   │   ├── schema.ts          # Configuration schema
│   │   └── is-config-valid.function.ts
│   ├── utils/                 # Utilities
│   │   ├── constants.ts       # Global constants
│   │   ├── types.ts           # TypeScript types
│   │   ├── get-config-dir.ts  # Config directory management
│   │   ├── get-favorites-from-file.ts
│   │   ├── set-favorites-to-file.ts
│   │   ├── offers-from-file.ts
│   │   └── queries-from-file.ts
│   └── index.ts               # Main entry point
├── dist/                      # Compiled files (generated)
├── .github/
│   └── workflows/
│       └── npm_publish.yml    # CI/CD pipeline
├── package.json
├── tsconfig.json
└── eslint.config.js
```

### 2.4 Technical Stack

#### Main dependencies

| Package             | Version | Usage                                         |
| ------------------- | ------- | --------------------------------------------- |
| **commander**       | ^14.0.1 | CLI framework (command and option management) |
| **enquirer**        | ^2.4.1  | Interactive prompts (menus, inputs)           |
| **chalk**           | ^5.6.2  | Terminal coloring                             |
| **conf**            | ^15.0.0 | Persistent configuration management           |
| **open**            | ^10.2.0 | Opening URLs in browser                       |
| **clipboardy**      | ^5.0.0  | Clipboard management                          |
| **fast-xml-parser** | ^5.2.5  | XML parsing and generation                    |
| **typescript**      | ^5.9.2  | Development language                          |

#### Development dependencies

| Package                 | Version | Usage                               |
| ----------------------- | ------- | ----------------------------------- |
| **tsx**                 | ^4.20.6 | TypeScript execution in development |
| **eslint**              | ^9.36.0 | Code linting                        |
| **@typescript-eslint/** | ^8.45.0 | ESLint configuration for TypeScript |
| **prettier**            | ^3.6.2  | Code formatting                     |
| **@types/node**         | ^24.6.0 | TypeScript types for Node.js        |

### 2.5 Available Scripts

```bash
# Development
npm run dev              # Launch CLI in development mode (tsx)

# Build
npm run build            # Compile TypeScript to dist/

# Execution
npm start                # Launch compiled CLI

# Code quality
npm run typecheck        # TypeScript type checking
npm run lint             # Linting with ESLint
npm run lint:fix         # Automatic lint error correction
npm run format           # Formatting with Prettier

# Tests
npm test                 # Not yet implemented
```

### 2.6 Configuration

#### Configuration schema

```typescript
type ConfigSchema = {
  locale: 'fr-fr' | 'en-us'; // Interface language
  hitsPerPage: number; // Results per page (default: 5)
  storageType: 'json' | 'xml'; // Storage format
  favoriteOffers: OfferHitDTO[]; // (Managed by conf)
};
```

#### Configuration files

Configuration is stored via the `conf` package in:

- **macOS/Linux**: `~/.config/lvmh-careers-cli/`
- **Windows**: `%APPDATA%\lvmh-careers-cli\`

**Generated files:**

- `config.json`: Main configuration
- `favorite-offers.[json|xml]`: Favorite offers
- `favorite-queries.[json|xml]`: Saved queries

#### LVMH API

```typescript
const LVMH_API_URL = 'https://www.lvmh.com/api/search';
const LVMH_API_BASE_INDEX_NAME = 'PRD-{{locale}}-timestamp-desc';
const LVMH_OFFER_BASE_URL = 'https://www.lvmh.com/join-us/our-job-offers/';
```

### 2.7 CI/CD

#### GitHub Actions Workflow

The project uses GitHub Actions to automate npm publishing.

**Pipeline** ([npm_publish.yml](.github/workflows/npm_publish.yml)):

```yaml
Trigger: release created
Jobs:
  1. lint          # Code verification
  2. typecheck     # Type checking
  3. test          # Test execution
  4. publish-npm   # npm publishing (after validation)
```

**Required configuration:**

- Node.js 22.x

**Publishing steps:**

1. Create a new release on GitHub
2. Workflow runs automatically
3. Validation (lint + typecheck + test)
4. Publish to npm if all checks pass

---

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or a pull request.
