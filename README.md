# Éric Renaud-Houde's portfolio

Static website published at https://num3ric.github.io/.

This checkout contains the rendered site, including HTML, CSS, JavaScript, and
images. It does not include the original Hugo source or a build configuration.
Changes are made directly to these files.

## Preview locally

Requires Python 3; no third-party dependencies.

```sh
python3 scripts/preview.py
```

Open http://127.0.0.1:8000/. Stop the server with Ctrl+C.
To choose another port, add `--port 8001`.

The preview serves the checkout and rewrites absolute site URLs in text
responses so navigation, assets, and the homepage redirect use local files.
It does not modify the published files. Third-party fonts and embedded media
still use their external services. The server binds only to the local machine.

See [AGENTS.md](AGENTS.md) for the repository map, editing conventions, and
validation guidance for coding agents and contributors.
