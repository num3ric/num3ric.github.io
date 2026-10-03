# Éric Renaud-Houde's portfolio

Static website published at https://num3ric.github.io/.

This checkout contains the rendered site, including HTML, CSS, JavaScript, and
images. It does not include the original Hugo source or a build configuration.
Changes are made directly to these files.

## Site structure

- `/`: text-only homepage with current work, open-source contributions, and contact.
- `/archive/`: earlier creative technology projects, organized by project year.
- `/portfolio/<project>/`: historical project pages and their existing media.
- `/portfolio/`: compatibility redirect to the archive.
- `/about/`: compatibility redirect to the homepage.

The homepage, archive, and project pages use plain HTML and scoped styles in
`css/custom.css`, without external fonts. Project image
galleries use native scrolling with a small script for Previous/Next arrows; existing video and social embeds remain.
The 404 page uses the same minimal styles. There are no bundled third-party
frontend dependencies, build step, or automated test suite.

## Preview locally

Requires Python 3; no third-party dependencies.

```sh
python3 scripts/preview.py
```

Open http://127.0.0.1:8000/. Stop the server with Ctrl+C.
To choose another port, add `--port 8001`.

The preview serves the checkout and rewrites absolute site URLs in text
responses so historical-page navigation and assets use local files.
It does not modify the published files. Embedded media
still use their external services. The server binds only to the local machine.

See [AGENTS.md](AGENTS.md) for the repository map, editing conventions, and
validation guidance for coding agents and contributors.
