# Development guide for agents

## Repository model

This repository contains the published static website for Éric Renaud-Houde at
https://num3ric.github.io/. The HTML reports Hugo 0.58.3, but Hugo source,
templates, configuration, and a build pipeline are absent from this checkout.
Edit the checked-in HTML/CSS/JS directly. No package installation or build step
is required. Do not assume a Hugo rebuild is available.

## Where to make changes

- `index.html`: immediate redirect to `/portfolio/`.
- `portfolio/index.html`: project grid and summaries.
- `portfolio/<project>/index.html`: individual project pages.
- `about/index.html`: biography.
- `css/custom.css`: preferred place for style overrides.
- `css/style.red.css`: active theme, layered over Bootstrap.
- `js/front.js`: site behavior (Masonry, off-canvas menu, lightboxes, carousels).
- `img/`: project imagery and thumbnails.
- `sitemap.xml` and `**/index.xml`: sitemap and RSS feeds.
- `404.html`, `categories/`, `tags/`: auxiliary pages.

Shared sidebar, navigation, stylesheets, and scripts are duplicated across HTML
pages. For shared changes, locate all occurrences with `rg` and update them
consistently, including auxiliary pages where applicable. For project changes,
check the detail page, portfolio grid, sitemap, and feeds for related updates.
Preserve existing public project URLs unless the user requests changing them.

Keep changes focused. Avoid editing bundled/minified libraries, font files, or
all theme variants for a change that belongs in `css/custom.css` or `js/front.js`.
The site uses Bootstrap 3 and jQuery-era plugins; preserve their markup and
script order when changing existing interactions. A framework migration is a
separate task. Do not invent biographical facts, project roles, or dates.

## Local preview

Run `python3 scripts/preview.py` and open
http://127.0.0.1:8000/portfolio/ (or `/about/`). Use `--port 8001` if needed.
The preview rewrites production-origin URLs in HTML, CSS, and XML responses to
local paths, including the homepage redirect. Files on disk remain unchanged.
External fonts, media embeds, and outbound links still require network access.
A plain static server would load many assets and navigation destinations from
the live site, so use this preview when checking local edits.

## Verification and delivery

There is no existing automated test suite. Match validation to the change:

- Run `git diff --check` and inspect the final diff.
- For visible changes, preview affected pages at desktop and mobile widths.
- For interaction changes, exercise the affected menu, carousel, or lightbox.
- For content/link changes, verify local targets and parse modified XML with
  Python's `xml.etree.ElementTree`.
- When changing shared markup, check both the portfolio grid and a detail page.

Report what changed, what was actually checked, and any unverified behavior.
Do not commit, push, or deploy unless the user requests it.
