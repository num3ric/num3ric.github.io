# Development guide for agents

## Repository model

This repository contains the published static website for Éric Renaud-Houde at
https://num3ric.github.io/. The historical HTML reports Hugo 0.58.3, but Hugo source,
templates, configuration, and a build pipeline are absent from this checkout.
Edit the checked-in HTML/CSS/JS directly. No package installation or build step
is required. Do not assume a Hugo rebuild is available.

## Where to make changes

- `index.html`: minimal, text-only homepage.
- `archive/index.html`: text-based collection of all historical projects.
- `portfolio/index.html`: compatibility redirect to `/archive/`.
- `portfolio/<project>/index.html`: individual project pages.
- `about/index.html`: compatibility redirect to the homepage.
- `css/custom.css`: shared styles, scoped under `.minimal-site`.
- `js/project-gallery.js`: progressive Previous/Next gallery arrow controls.
- `img/`: project imagery and thumbnails.
- `sitemap.xml`, `index.xml`, and `portfolio/index.xml`: sitemap and historical RSS feeds.
- `404.html`: minimal missing-page fallback used by GitHub Pages.

For shared changes, locate all occurrences with `rg` and update them consistently.
For project changes, check the detail page, archive collection, sitemap, and feeds
for related updates. Preserve existing public project URLs unless the user requests
changing them.

The site uses plain HTML, `css/custom.css`, and system fonts. The old taxonomy pages,
Bootstrap/jQuery theme, bundled fonts, and plugins have been removed. Keep changes
focused and preserve existing media and prose. Project pages may retain third-party
scripts for existing social embeds. A framework migration is a separate task.
Do not invent biographical facts, project roles, or dates.

## Current design conventions

The homepage is a quiet, text-only introduction with three columns that stack
on mobile: Current work, Open Source, and Earlier work. Contact links sit below
a Contact heading. Keep the maker emphasis and concise, owner-approved copy.
The opening uses Georgia italic; all other text uses the system sans-serif.

Use the scoped CSS custom properties in `.minimal-site` for colors, type,
spacing, and layout. Keep the homepage static: entrance fades were tried and
removed at the owner's request. External web links and the email link on the
homepage use decorative diagonal arrows; internal links do not. Arrows are marked
with `aria-hidden="true"`; preserve meaningful link names and keyboard focus.

The archive uses CSS-only hover/focus media previews in the outer margin on
wide screens with a fine pointer. Reuse existing imagery; GIF sources are
limited to no-preference motion users, with still-image fallbacks. Touch and
narrow screens retain the plain list.

The archive lists all 11 historical projects with project years, not RSS or
page-publication dates. Ménage à Trois's 2014 date is provisional, based on the
owner's recollection. Preserve project detail URLs under `/portfolio/` and the
`/portfolio/` redirect to `/archive/`. The former biography at `/about/` redirects to the homepage. Project galleries
use native horizontal scrolling and scroll snap, with Previous/Next arrows; preserve
all media and prose when editing them.

## Local preview

Run `python3 scripts/preview.py` and open
http://127.0.0.1:8000/ (or `/archive/`). Use `--port 8001` if needed.
The preview rewrites production-origin URLs in HTML, CSS, and XML responses to
local paths, including redirects on historical entry points. Files on disk remain unchanged.
Media embeds and outbound links still require network access.
A plain static server would load many assets and navigation destinations from
the live site, so use this preview when checking local edits.

## Verification and delivery

There is no existing automated test suite. Match validation to the change:

- Run `git diff --check` and inspect the final diff.
- For visible changes, preview affected pages at desktop and mobile widths.
- For interaction changes, exercise the affected menu, carousel, or lightbox.
- For content/link changes, verify local targets and parse modified XML with
  Python's `xml.etree.ElementTree`.
- When changing shared markup, check the homepage, archive collection, and a
  detail page.

Report what changed, what was actually checked, and any unverified behavior.
Do not commit, push, or deploy unless the user requests it.
