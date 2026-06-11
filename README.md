# lucaslyba.com

Personal portfolio for **Lucas Ly Ba** — low-level & systems engineer.
Static site, zero build step, zero dependencies.

```
index.html    markup + content
styles.css    all styling (dark terminal / compiler theme)
script.js     scroll reveal + small interactions
favicon.svg   site icon
CNAME         custom domain for GitHub Pages
```

## Run locally

It's plain HTML — just open `index.html`, or serve it:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

## Deploy

You bought `lucaslyba.com` on Namecheap. Pick one host below and point the domain at it.

### Option A — GitHub Pages (free, recommended)

1. Create a public repo and push these files:
   ```sh
   git add -A && git commit -m "portfolio site"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. Repo **Settings → Pages → Source: Deploy from branch → `main` / root**.
3. Under **Custom domain**, enter `lucaslyba.com` (the `CNAME` file already sets this).
4. In **Namecheap → Domain → Advanced DNS**, add:
   | Type  | Host | Value                  |
   |-------|------|------------------------|
   | A     | @    | 185.199.108.153        |
   | A     | @    | 185.199.109.153        |
   | A     | @    | 185.199.110.153        |
   | A     | @    | 185.199.111.153        |
   | CNAME | www  | `<you>.github.io.`     |
5. Wait for DNS, then tick **Enforce HTTPS** in GitHub Pages.

### Option B — Netlify / Vercel / Cloudflare Pages

Drag-and-drop the folder (or connect the repo). Add `lucaslyba.com` as a custom
domain and follow their DNS instructions in Namecheap.

## Editing content

Everything is in `index.html`, grouped by section (`hero`, `about`, `work`,
`projects`, `stack`, `contact`). Colors live as CSS variables at the top of
`styles.css` — change `--green` / `--cyan` to re-theme the whole site.
