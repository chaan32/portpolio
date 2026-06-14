# Haechan Portfolio

Static portfolio site for Vercel.

## Local Preview

```bash
npm run dev
```

Open `http://localhost:3000`.

## Validate

```bash
npm run check
```

This checks local `href` and `src` references in HTML files before deployment.

## Vercel Settings

- Import this repository from GitHub.
- Framework Preset: `Other`
- Root Directory: `./`
- Build Command: leave empty
- Output Directory: leave empty

The site is pure static HTML/CSS. `vercel.json` enables clean URLs, so `/projects/arcane` will serve `projects/arcane.html`.
