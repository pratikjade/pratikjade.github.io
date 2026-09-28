# Pratik Jade — Blueprint Portfolio

Plain static site: HTML + CSS + a little JavaScript. No build step.

## Pages
- `index.html` — home (hero, specs, system, drawings, construction log, off-duty, transmit, rocket)
- `photos.html` — contact sheet of photos with stories
- `pegboard.html` — bookmarks board, headphones with the Spotify player, and the plant
- `blog.html` — field notes

## Run locally
Open `index.html` in a browser, or serve the folder:

    python -m http.server 8000

then visit http://localhost:8000

## Things to fill in
- **Contact links** — top of the `CONTACT` block in `js/index.js` (email, GitHub, LinkedIn). The email is never shown on the page; the Compose button opens the visitor's mail app.
- **Résumé** — drop your PDF at `assets/resume.pdf`.
- **Photos** — put images in `assets/photos/` and set `src` on each item in `js/photos.js` (the `title`, `meta` and `story` fields are the story text).
- **Bookmarks** — edit the list in `js/pegboard.js`.
- **Blog posts** — edit the `posts` list in `js/blog.js`.
- Any text in `[SQUARE BRACKETS]` in the HTML is a placeholder.

## Screens
- Phones (under 900px): a separate phone layout (`<template id="dc-root-m">` in each page) — sticky top bar with a full-screen menu, one-column sections, swipeable project cards, a vertical career timeline, and stories / bookmarks / the playlist in bottom sheets. Edit phone-only text there.
- Tablets and large displays: the 1440px drawing sheet (`<template id="dc-root">`), scaled to fill the screen by `js/fit.js`.

## How it works
Each page keeps its markup in `<template id="dc-root">`. `js/dc-lite.js` fills the `{{holes}}`,
repeats `<sc-for>` blocks, shows `<sc-if>` blocks, and wires `onClick` handlers from the page's
`Component` class (in `js/<page>.js`).

## Deploy
Any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages): publish this folder as-is.
