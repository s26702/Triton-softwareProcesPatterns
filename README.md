# Triton — Software Process Patterns

Welcome to the **Triton** project! This guide walks you through setting up your local environment from scratch, including Node.js, npm, project dependencies (Next.js & Supabase), and environment credentials.

---

## 📋 Prerequisites

Before running this project, you need **Node.js** and **npm** installed on your machine.

### 1. Install Node.js & npm

We recommend **Node.js LTS (v20+ or newer)**.

#### macOS:
- **Using Homebrew (recommended):**
  ```bash
  brew install node
  ```
- **Or download directly:**
  Download and run the installer from [nodejs.org](https://nodejs.org/).

#### Windows:
- Download and run the official Windows installer (`.msi`) from [nodejs.org](https://nodejs.org/).
- Ensure the checkbox **"Add to PATH"** is selected during installation.

#### Linux (Debian/Ubuntu):
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Verify Installation:
Open a new terminal and verify both tools are available:
```bash
node -v   # Should output v20.x, v22.x, or v26.x
npm -v    # Should output 10.x, 11.x, or newer
```

---

## 🚀 Getting Started

### 2. Clone the Repository

```bash
git clone <repository-url>
cd Triton-softwareProcesPatterns
```

### 3. Install Dependencies (Next.js, Supabase, Vitest, etc.)

All project libraries (including **Next.js 16**, **React 19**, **@supabase/supabase-js**, and **Vitest**) are defined in `package.json`. Install them by running:

```bash
npm install
```

> **Note:** This installs all packages (including testing tools) into the local `node_modules/` folder. You do not need to install Next.js, Supabase, or Vitest globally. If new dependencies are added later, simply re-run `npm install` after pulling changes.

---

## 🔑 Supabase & Environment Setup

This project connects to a **Supabase** backend for authentication and data. You must provide your project credentials locally.

### 4. Create your `.env.local` File

Copy the following to personal .env.local file:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Add your Supabase Credentials

Open `.env.local` in your editor.

#### Where to find these in Supabase:
1. Log into your project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Go to **Project Settings** (gear icon in sidebar) > **API**.
3. Under **Project URL**, copy the URL into `NEXT_PUBLIC_SUPABASE_URL`.
4. Under **Project API keys**, copy the `anon` / `public` key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

> ⚠️ **Important:** Never commit `.env.local` or share your secret service keys in git. `.env.local` is already included in `.gitignore`.

---

## 💻 Running the App

### 6. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will automatically hot-reload as you make changes.

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js local development server with Turbopack |
| `npm run build` | Compiles the production build |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Runs ESLint to check for code quality and syntax issues |
| `npm test` | Runs Vitest in interactive watch mode |
| `npm run test:run` | Runs the full unit and component test suite once |

---

## ❓ Troubleshooting

- **`command not found: node` or `npm`**: Restart your terminal after installing Node.js so your `PATH` refreshes.
- **Supabase authentication fails or returns an empty client**: Double-check that `.env.local` has valid values without extra quotes or spaces, and restart `npm run dev`.
- **Port 3000 in use**: Next.js will automatically suggest running on port `3001`. You can also specify a port manually: `npm run dev -- -p 3001`.
