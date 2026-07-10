# 🌳 RRA Intern Fun~~d~~ Raising Challenge — Replication Kit

This file lets you rebuild the charity step-challenge website
(https://nitram353.github.io/great-step-forest/) from scratch on your own
GitHub account, using Claude Code.

**How to use this file:**

1. Do the one-time setup in **Part 1** (10 minutes, no coding).
2. Save this file into a new empty folder on your computer.
3. Open Claude Code in that folder and type:

   > Read REPLICATION-KIT.md and follow the instructions in Part 3 to build
   > and publish the website. My GitHub username is `<your-username>`.

4. Claude does the rest. Check the result against **Part 4**.

There is also a shortcut in **Part 2** if you just want a copy of the original
site without building it from scratch.

---

## Part 1 — One-time setup (do this yourself, in a browser)

### 1a. Accounts
- A GitHub account: https://github.com/signup (free).
- Claude Code installed and signed in: https://claude.com/claude-code

### 1b. Create the repository
1. Go to https://github.com/new
2. Repository name: `great-step-forest` (any name works — the website address
   will be `https://<your-username>.github.io/<repo-name>/`)
3. Visibility: **Public** (required for free website hosting)
4. Do **not** tick "Add a README". Click **Create repository**.

### 1c. Create an access token (the "key" Claude uses to publish for you)
1. Go to https://github.com/settings/personal-access-tokens → **Generate new token**
2. Token name: anything, e.g. `step-forest-publish`
3. Repository access: **Only select repositories** → choose `great-step-forest`
4. Permissions → Repository permissions:
   - **Contents: Read and write**
   - **Pages: Read and write**
5. Click **Generate token** and copy it somewhere safe. Treat it like a
   password — anyone with it can change your website. You'll paste it into
   Claude Code when asked, and later into the site's admin page.

---

## Part 2 — Shortcut: copy the original site (5 minutes)

If you just want your own working copy, tell Claude Code:

> Clone https://github.com/Nitram353/great-step-forest.git into this folder,
> remove its git history and start a fresh repo, then push it to my GitHub
> repository `<your-username>/great-step-forest` (I'll give you a token when
> you ask) and enable GitHub Pages on the main branch. Then verify the site
> is live and show me the URL.

Done. Skip to Part 4 to check it worked. If you'd rather build it yourself
and understand every piece, use Part 3 instead.

---

## Part 3 — Build instructions for Claude (the full specification)

**Claude: everything below this line is your build brief. Follow it closely —
the goal is a faithful replica. Build the site as plain static HTML/CSS/JS
(no framework, no build step), verify it locally, then publish it to the
user's GitHub repository and enable GitHub Pages. Ask the user for their
GitHub username and token when you need them, and never commit the token.**

### 3.1 What the site is

A website for a London office charity competition called the **RRA Intern
Fund Raising Challenge** — everywhere the name is displayed, the letter "d"
in "Fund" gets a cyan strikethrough (a `<span class="fun-d">d</span>` with
`text-decoration: line-through`), the joke being that it's Fun raising as
much as Fund raising. Four teams compete for 6 weeks to raise money for the
charity **Trees for Cities** (link to https://www.treesforcities.org so
visitors understand the purpose). Participants join by signing up on a
shared Google Sheet and pledging £10. Teams track their weekly step counts;
steps convert to distance (0.75 m per step); the team that "travels" the
furthest from London over 6 weeks wins. Donations are collected on a
GoFundMe page (URL configurable; buttons show "coming soon" until it's set).
The public site is read-only; one admin updates the numbers through a hidden
admin page.

### 3.2 Files

```
index.html      — dashboard (leaderboards + events sidebar)
journey.html    — interactive map of cumulative distance from London
admin.html      — passcode-gated admin console
css/style.css   — the whole design system
js/app.js       — data loading + dashboard rendering (shared)
js/journey.js   — route data + Leaflet map rendering
js/admin.js     — admin gate, forms, publish-to-GitHub
data/data.json  — ALL competition data (the only file the admin ever changes)
.nojekyll       — empty file (tells GitHub Pages to serve files as-is)
README.md       — how the site works + admin instructions
```

### 3.3 Design system (follow exactly)

- Fonts (Google Fonts): **Fraunces** (weights 500/600, serif) for display
  headings; **Archivo** (400/600/700/800, sans) for everything else.
- Palette (CSS variables):
  - ink `#212121`, soft ink `#585656`, paper `#ffffff`, mist `#f2f2f2`, line `#dfdddd`
  - primary deep cobalt `#0a2fb5`, bright blue `#2d53ed`, light blue `#488cff`, pale blue `#bcdcfb`
  - purple `#4a0080`, lavender `#a167ff`, berry `#990c47`, pink `#ed5a8f`, teal `#117c96`, cyan `#21d8ed`
- Feel: white background, generous whitespace, 14px-radius cards with soft
  blue-tinted shadows, pill-shaped buttons and nav links.
- Header: sticky, deep cobalt background; round gradient badge with a 🌳 emoji
  as the logo; site name in Fraunces; nav pills ("Leaderboards", "The
  Journey") where the active page is a white pill with cobalt text.
- Hero (both public pages): deep cobalt with two soft radial glows (cyan top
  right, lavender bottom left); an uppercase "WEEK 3 OF 6 · RESULTS IN" pill
  with a pulsing cyan dot; a big Fraunces headline ("Four teams. Six weeks.
  Millions of steps for the city's trees."); a lede paragraph linking to
  Trees for Cities in cyan.
- A stat strip of 4 white cards overlapping the hero bottom by ~78px
  (negative margin), each with a coloured top border (bright blue, lavender,
  pink, teal): total steps, kilometres travelled, £ raised, colleagues walking.
- Footer: near-black, with a Trees for Cities link and a deliberately
  low-contrast "Admin" link to admin.html.
- Responsive: single column under 960px, tighter cards under 560px.

### 3.4 Data model — `data/data.json` (create with exactly this content)

```json
{
  "settings": {
    "competitionName": "RRA Intern Fund Raising Challenge",
    "tagline": "Stepping up for Trees for Cities",
    "charityName": "Trees for Cities",
    "charityUrl": "https://www.treesforcities.org",
    "startDate": "2026-07-15",
    "totalWeeks": 6,
    "dataThroughWeek": 0,
    "stepLengthMeters": 0.75,
    "signupUrl": "https://docs.google.com/spreadsheets/d/1p-Qc-uqqgLAZV45W071aoEAzlJ2OGKbaGB0tLdZ6gW0/edit?usp=sharing",
    "signupPledge": "£10",
    "goFundMeUrl": ""
  },
  "teams": [
    { "id": "owls", "name": "The Owls", "color": "#0f8a3d", "emoji": "🦉", "members": 24 },
    { "id": "bumblebees", "name": "The Bumblebees", "color": "#f0a800", "emoji": "🐝", "members": 19 },
    { "id": "collies", "name": "The Border Collies", "color": "#d92632", "emoji": "🐕", "members": 28 },
    { "id": "dolphins", "name": "The Dolphins", "color": "#2d53ed", "emoji": "🐬", "members": 17 }
  ],
  "weeklySteps": {
    "owls":       [0, 0, 0, 0, 0, 0],
    "bumblebees": [0, 0, 0, 0, 0, 0],
    "collies":    [0, 0, 0, 0, 0, 0],
    "dolphins":   [0, 0, 0, 0, 0, 0]
  },
  "funds": { "owls": 0, "bumblebees": 0, "collies": 0, "dolphins": 0 },
  "topIndividuals": [],
  "events": [
    { "title": "5k fun run", "date": "2026-08-05", "time": "6pm",
      "location": "starting at RRA office",
      "description": "Join the office fun run around St James Park to support Trees for Cities. Every colleague who takes part donates £5 to Trees for Cities, and every step counts towards your team's total!",
      "link": "https://docs.google.com/spreadsheets/d/1p-Qc-uqqgLAZV45W071aoEAzlJ2OGKbaGB0tLdZ6gW0/edit?usp=sharing",
      "linkLabel": "Sign up & pledge your £5", "featured": true, "icon": "🏃" },
    { "title": "Darts and raffle night", "date": "2026-08-06", "time": "6pm",
      "location": "RRA office",
      "description": "Everyone has a chance to win prizes at the office Darts and Raffle night. The cheapest night out in Mayfair at a cost of £5!",
      "link": "https://docs.google.com/spreadsheets/d/1p-Qc-uqqgLAZV45W071aoEAzlJ2OGKbaGB0tLdZ6gW0/edit?usp=sharing",
      "linkLabel": "Sign up & pledge your £5", "featured": true, "icon": "🎯" },
    { "title": "Grand Finale & Awards Evening", "date": "2026-08-27", "time": "5:30pm",
      "location": "The Boardroom",
      "description": "The winning team is crowned! Final leaderboards revealed, prizes for top steppers, and the grand fundraising total presented to Trees for Cities.",
      "link": "", "linkLabel": "", "featured": false }
  ]
}
```

Zero-data behaviour: with `dataThroughWeek: 0` the hero pill reads "Starts 15
July · sign up now", the week table and top-steppers board show friendly
"results will appear after week 1" messages, and all journey markers sit at
London.

All pages fetch this file with a cache-busting query string
(`data/data.json?t=<timestamp>`) and render everything client-side.
Escape all user-editable strings before inserting into HTML.

### 3.5 Dashboard (`index.html`)

Hero extras (below the lede): a translucent call-out box — "**Want in?** To
join the step challenge, sign up and pledge **£10** to Trees for Cities —
then start walking for your team." — followed by two pill buttons: a white
"Sign up & pledge £10 →" linking to `settings.signupUrl`, and an outlined
"Donate on GoFundMe" linking to `settings.goFundMeUrl`. When `goFundMeUrl`
is empty, GoFundMe buttons render dimmed and unclickable with the text
"GoFundMe — coming soon". A second GoFundMe button sits inside the
fundraising gradient banner.

Two-column layout (main column + 330px sticky sidebar; single column on
mobile). Main column, in order:

1. **🏆 Team leaderboard** — one card, a row per team sorted by cumulative
   steps: big serif rank number, team colour chip + emoji + name (crown 👑 on
   the leader), "N walkers · X km travelled" subline, right-aligned steps
   total, and a full-width progress bar in the team colour scaled to the
   leader's total.
2. **📅 Week by week** — table (grey uppercase header row): a row per team,
   one column per week up to `dataThroughWeek`, plus a bold cobalt total.
3. **⭐ Top steppers** — same row style as the team board for the top 5
   individuals (🥇🥈🥉 on the first three), with their team chip and name.
4. **💚 Fundraising leaderboard** — a teal→blue gradient banner card showing
   the grand total (sum of team funds) plus "That's enough to plant roughly
   N urban trees 🌳" (total ÷ £6, rounded down), then a leaderboard of teams
   by money raised with bars.

Sidebar, in order:
1. **Featured event cards** — every event with `"featured": true`, stacked
   in date order, each on a cobalt→purple gradient with a giant translucent
   emoji (the event's `icon` field) in the corner, a cyan "FEATURED EVENT"
   pill, date/time/location line, description, and a white pill button using
   `linkLabel` → `link` (new tab).
2. **📌 Upcoming events** — the remaining events sorted by date: uppercase
   bright-blue date line, bold title, location, small description, optional
   link.
3. **🌱 Why we're walking** — teal-accented card explaining Trees for Cities,
   with a teal pill button "Visit treesforcities.org →".

### 3.6 Journey page (`journey.html`)

Headline "The long walk out of London". Convert each team's cumulative steps
to km (× 0.75 / 1000) and plot progress along a fixed walking route.

Route waypoints `[name, lat, lng, legKmFromPrevious]` (~4,245 km total):

```
London 51.5074,-0.1278,0 · Rochester 51.3886,0.5041,55 · Canterbury 51.2802,1.0789,45 ·
Dover 51.1279,1.3134,30 · Calais 50.9513,1.8587,45 · Amiens 49.8942,2.2957,130 ·
Paris 48.8566,2.3522,150 · Auxerre 47.7982,3.5730,185 · Dijon 47.3220,5.0415,150 ·
Geneva 46.2044,6.1432,200 · Chamonix 45.9237,6.8694,85 · Aosta 45.7372,7.3206,65 ·
Milan 45.4642,9.1900,185 · Bologna 44.4949,11.3426,215 · Florence 43.7696,11.2558,105 ·
Siena 43.3188,11.3308,75 · Rome 41.9028,12.4964,215 · Naples 40.8518,14.2681,230 ·
Bari 41.1171,16.8719,265 · Igoumenitsa 39.5060,20.2658,330 · Ioannina 39.6650,20.8537,80 ·
Meteora 39.7217,21.6306,105 · Delphi 38.4824,22.5010,175 · Athens 37.9838,23.7275,180 ·
Thessaloniki 40.6401,22.9444,500 · Alexandroupoli 40.8457,25.8740,345 · Istanbul 41.0082,28.9784,300
```

Page contents:
1. Four team cards (sorted by distance, coloured top borders): "2,825 km",
   plus "Passed **Igoumenitsa** — 15 km to **Ioannina**" computed from the
   route's cumulative distances.
2. A **Leaflet 1.9.4** map (CDN: unpkg, CARTO `light_all` basemap tiles,
   OSM+CARTO attribution, scroll-wheel zoom off, 520px tall): the full route
   as a faint dashed cobalt polyline; a small white circle marker per
   waypoint with a "City · N km" tooltip; per team a solid polyline in the
   team colour along its progress, ending at the interpolated position, with
   a teardrop div-icon marker (team colour, white border, team emoji) and a
   popup showing steps + km. Fit bounds from London to ~400 km past the
   leader. Important: run fitBounds after layout settles (requestAnimationFrame)
   and refit via a ResizeObserver when the container size changes, so the map
   isn't blank if initialised while hidden.
3. **🚩 Milestones along the route** — a grid tile per waypoint showing name,
   cumulative km, and the emojis of teams that have passed it (pale blue
   background once reached).

### 3.7 Admin page (`admin.html` + `js/admin.js`)

- **Passcode gate**: SHA-256 (Web Crypto) of the entered passcode compared to
  a constant. Passcode `trees2026` → hash
  `de7e4bd473e9361b04f745667a43e19e5184d7534bc8744f9f12b5dfcc1d3be9`.
  On success set a sessionStorage flag and show the console. Include a code
  comment explaining how to generate a new hash to change the passcode.
- **Publishing setup card**: two fields — repository `owner/name` and GitHub
  token — remembered in localStorage only. Explain in the page copy that the
  token stays in the browser.
- **Links card**: fields for `settings.signupUrl` and `settings.goFundMeUrl`
  so the admin can set the sign-up sheet and GoFundMe page without code.
- **Form cards** generated from data.json: "results through week" selector
  (including a week-0 "Not started yet" option); per-team blocks (left
  border in team colour) with 6 weekly step inputs; per-team £ raised;
  top-stepper rows (name / team select / steps / remove + add button); event
  editors (title, date, time, location, description, link, link label, emoji
  icon, featured checkbox, remove + add button).
- **Publish**: collect the forms back into the data.json shape, then via the
  GitHub contents API (`/repos/{repo}/contents/data/data.json`): GET the
  current file for its `sha`, then PUT with base64 UTF-8 content, commit
  message, and that sha. Bearer-token auth. Show busy/success/error status
  messages. Also provide a "Download data.json instead" fallback button.
- `<meta name="robots" content="noindex" />` on this page.

### 3.8 Publish & verify (Claude: do this too)

1. Serve the folder locally and verify: hero pill says "Starts 15 July",
   both featured event cards render with their sign-up buttons, GoFundMe
   buttons show "coming soon", the map renders with 4 markers at London, and
   the admin unlocks with `trees2026` and builds 24 step inputs.
2. `git init`, commit everything, push to the user's repo
   (`https://x-access-token:<TOKEN>@github.com/<user>/<repo>.git`), then
   reset the remote URL so the token isn't stored in git config.
3. Enable GitHub Pages via `POST /repos/<user>/<repo>/pages` with
   `{"source":{"branch":"main","path":"/"}}`. If the token lacks the Pages
   permission, ask the user to switch it on at the repo's Settings → Pages
   (Deploy from a branch → main → / root).
4. Poll `https://<user>.github.io/<repo>/` until it returns 200, then check
   every page and data.json load, and give the user the live URL.

---

## Part 4 — Success checklist

- [ ] `https://<your-username>.github.io/<repo-name>/` loads with the blue
      hero, the strikethrough "d" in the site name, the £10 sign-up call-out
      with its buttons, and four stat cards (all zeros pre-launch).
- [ ] "The Journey" shows a map with a dashed route from London to Istanbul
      and 4 team markers at London.
- [ ] The sidebar features the 5k fun run and the Darts and raffle night,
      each with a "Sign up & pledge your £5" button, and the Trees for
      Cities link works.
- [ ] The footer "Admin" link + passcode `trees2026` opens the admin console.
- [ ] Enter your token there, change a number, click **Publish changes**, and
      the public site updates within a couple of minutes.

Have fun! 🌳👟
