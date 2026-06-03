# Gyandeep Singh's Personal Website

Welcome! This repository contains the source code for my personal website and blog, hosted at [gyandeeps.com](https://gyandeeps.com).

The site was recently uplifted from a Jekyll-based setup to a modern, lightweight, and fast static site powered by **Astro** (v6).

---

## 🚀 Technology Stack
* **Framework:** [Astro v6](https://astro.build/)
* **Runtime:** Node.js v24 (managed via `.nvmrc`)
* **Styling:** Tailwind CSS v4 & Vanilla CSS
* **Hosting:** GitHub Pages with custom domain configuration (`CNAME`)
* **CI/CD:** GitHub Actions workflow

---

## 📁 Repository Structure
* `src/pages/` - Site pages and routing, including the dynamic `[slug].astro` for rendering blog posts.
* `src/content/posts/` - Blog posts written in Markdown (`.md`).
* `src/components/` - Shared Astro components (e.g. Disqus comments integration).
* `src/layouts/` - Layout templates (`BaseLayout.astro`, `PortfolioLayout.astro`).
* `src/styles/` - Stylesheets (`global.css` and `landing.css` for custom animations/Tailwind setup).
* `public/` - Static assets served as-is (icons, CNAME, etc.).

---

## 🛠️ Getting Started

### Prerequisites
Make sure you have Node.js installed (v24 is recommended). You can use [NVM](https://github.com/nvm-sh/nvm) to switch to the correct node version:
```bash
nvm use
```

### Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### Running Locally
To start the local development server:
```bash
npm run dev
```
Open `http://localhost:4321` in your browser.

### Building for Production
To build the site:
```bash
npm run build
```
This generates a production-ready static site inside the `dist/` directory.

You can preview the production build locally with:
```bash
npm run preview
```

---

## 🚀 Deployment
Deployment is fully automated. Whenever a change is merged or pushed to the `master` branch, a GitHub Action compiles the static site and deploys it to the `gh-pages` branch.
