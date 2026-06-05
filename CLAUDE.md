# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page static site for the CRAL · AstroENS annual lab retreat (9–11 June 2026, Gîte Le Chamois, Col d'Ornon). The entire site is one self-contained file: `index.html` — HTML, CSS (`<style>`), and JS (`<script>`) all inline. **There is no build step, no dependencies, and no tests.** Open the file in a browser or drop it on any static host.

## Working in this repo

- **Preview:** open `index.html` directly in a browser, or serve the directory (`python3 -m http.server`). Changes are visible on reload.
- **Deploy:** the file must serve as `index.html` at the site root.
- **External resources:** only Google Fonts (Fraunces + Hanken Grotesk) via `<link>`. Everything else — the starfield, paper texture, noise — is pure CSS/SVG data-URIs, no images or assets.

## Editing content

Almost all changes are content edits, not code. Search the file for `EDIT` — each major section block is flagged with an `EDIT:` hint comment in its banner. Sections are numbered 01–05: Schedule, Talk Sessions, Cooking, Carpool, Getting There.

Content consistency to keep in mind — the same people and facts are duplicated across sections, so a change in one place usually means matching edits elsewhere:
- A presenter's name appears in both the **Schedule** day panel `.who` line and the **Talk Sessions** `<ol>` for that session.
- Cooking team meal assignments (e.g. "Team C cooks") are referenced both in **Schedule** `.pill`s and in the **Cooking** `.team .role` labels.
- The session count badge (e.g. "6 talks") must match the number of `<li>` entries in that session.

**Privacy constraint (from the file header):** this page is public — use names only, never email addresses.

## Structure & conventions

- **Styling** is driven by CSS custom properties in `:root` (palette `--paper`/`--ink`/`--accent`/`--gold`, fonts `--display`/`--body`, `--maxw`). Change the theme there, not in individual rules.
- **Layout** uses a repeated `.wrap` container (max-width + padding) and `<section>` blocks with `.sec-head` headers. Responsive breakpoints collapse multi-column grids to single column around 760–820px.
- **JS** (~20 lines at the bottom) handles four things only: nav shadow on scroll, the schedule day-tab switcher (`data-day` ↔ `data-panel`), `IntersectionObserver` scroll-reveal (`.reveal` → `.in`), and active-nav-link highlighting on scroll. No framework.
- Animation classes: `.reveal` for on-scroll fade-in, `.load`/`.d1`–`.d4` for staggered hero entrance.
