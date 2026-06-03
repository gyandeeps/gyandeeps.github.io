# Gemini Agent Developer Guide

This document is a reference guide for Gemini (or other AI coding assistants) working on this repository. It outlines the project's architecture, tools, workflows, and developer rules.

## Project Overview
This repository contains the source code for the personal website and blog of Gyandeep Singh, hosted at [gyandeeps.com](https://gyandeeps.com).

## Technical Stack
- **Core Framework:** [Astro v6](https://astro.build/)
- **Node.js Version:** Determined by `.nvmrc` (v24)
- **Styling:** Tailwind CSS v4 / Vanilla CSS stylesheet setup
- **Deployment:** GitHub Pages (custom domain via `CNAME`) using a GitHub Action workflow

## Repository Structure

- `src/`
  - `components/` - Reusable Astro components (e.g., `Disqus.astro` for comments).
  - `content/` - Content collections.
    - `posts/` - Blog posts written in Markdown (`.md`).
  - `layouts/` - Page layouts.
    - `BaseLayout.astro` - The primary template wrap for legacy pages and posts.
    - `PortfolioLayout.astro` - The premium layout template for the landing page and modern articles.
  - `pages/` - Routing and views.
    - `index.astro` - The home page rendering the premium dark-mode portfolio landing page.
    - `[slug].astro` - The dynamic page template that renders blog posts loaded from the `posts` collection.
  - `styles/` - CSS stylesheets.
    - `global.css` - Global stylesheets.
    - `landing.css` - Extracted custom dark-mode classes, animations, and Tailwind v4 configurations.
  - `content.config.js` - Defines the structure and schema validation for content collections (e.g. `posts`).
- `public/` - Static assets served directly (e.g. CNAME, favicon, `.nojekyll` to allow serving directories starting with an underscore on GitHub Pages).
- `.github/workflows/deploy.yml` - CI/CD pipeline triggering automated build and deploy to GitHub Pages on every push to `master`.

## Available Commands

Run these scripts from the root directory:

| Command | Action |
|---|---|
| `npm run dev` / `npm start` | Start local development server with hot-reloading |
| `npm run build` | Compile the static site to the `dist/` directory |
| `npm run preview` | Serve the production build locally for verification |

## Guidelines for Agents
- **Git Command Rule:** Always run git commands individually (e.g., do not chain them with `&&` or `;`).
- **Static Assets:** Ensure static files such as images or configurations needed in the output are placed in the `public/` directory.
- **Content Updates:** Blog posts should be added to `src/content/posts/` in Markdown format, satisfying the schema defined in `src/content.config.js`.
