# The Great Step Forest 🌳

A London office step-challenge website in aid of [Trees for Cities](https://www.treesforcities.org).

Four teams compete over six weeks to walk the furthest and raise the most money.
The site shows team and individual leaderboards, fundraising totals, competition
events, and a live map of each team's cumulative journey from London towards Istanbul.

## How it works

- **Static site** — plain HTML/CSS/JS, hosted free on GitHub Pages. No server, no build step.
- **All data lives in [`data/data.json`](data/data.json)** — steps per team per week,
  fundraising totals, top individual steppers, and sidebar events.
- **Public site is read-only.** Visitors just see the leaderboards.

## Updating the data (admin)

Go to `/admin.html` on the live site (linked discreetly in the footer as "Admin").

1. Enter the admin **passcode** (default: `trees2026` — see below to change it).
2. Paste the **repository name** (`owner/repo`) and a **GitHub personal access token**
   with write access to this repo. The token is stored only in that browser's
   localStorage — it never leaves the admin's machine except to talk to GitHub.
   - Create one at GitHub → Settings → Developer settings → **Fine-grained tokens** →
     scope it to this single repository with **Contents: Read and write**.
3. Fill in the week's numbers and click **Publish changes**. The site updates in ~1 minute.

There is also a **Download data.json** fallback — edit the file on github.com and
replace `data/data.json` if you'd rather not use a token.

### Changing the admin passcode

The passcode is only a light gate (the real protection is the GitHub token, which only
the admin has). To change it, open the browser console on any page and run:

```js
crypto.subtle.digest('SHA-256', new TextEncoder().encode('your-new-passcode'))
  .then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2,'0')).join('')))
```

then paste the printed hash into `PASS_HASH` at the top of [`js/admin.js`](js/admin.js).

## Configuration

Everything lives in `data/data.json`:

- `settings` — competition name, start date, number of weeks, average step length
  (0.75 m/step is used to convert steps → kilometres).
- `teams` — id, display name, colour, emoji, member count. Rename teams here.
- `events` — sidebar events; set `"featured": true` to pin one to the big highlight card.

The journey route (London → Dover → Paris → Geneva → Milan → Rome → Athens → Istanbul,
~4,250 km) is defined in [`js/journey.js`](js/journey.js).

## Local preview

Any static file server works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Design

Colour palette and typography are inspired by a corporate brand system:
deep cobalt (`#0a2fb5`) with bright blue, lavender, pink and teal accents,
serif display headings (Fraunces) and grotesque body text (Archivo).
