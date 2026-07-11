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
much as Fund raising. Four teams compete for 3 weeks (15 July – 6 August;
the final day counts into week 3) to raise money for the charity **Trees for
Cities** (link to https://www.treesforcities.org so visitors understand the
purpose). Participants join the challenge on the **World Walking** app and
pick their team (that's where steps are tracked), and pledge £10 on a
**JustGiving** page. Every donation must be tagged with name, team and event
— a permanent warning note in the sidebar says so. Teams' weekly step counts
convert to distance (0.75 m per step) and race along a world route (see
3.6); an admin-written weekly announcement on the home page reports which
destination each team has reached. Both the World Walking and JustGiving
URLs are configurable in settings; their buttons show "coming soon" while
empty. The top-5 individual steppers leaderboard exists but ships hidden
(`settings.showTopSteppers: false`) because World Walking can't identify
top steppers. The public site is read-only; one admin updates everything
through a hidden admin page.

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
  with a pulsing cyan dot; a big Fraunces headline ("Four teams. Three weeks.
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
    "totalWeeks": 3,
    "dataThroughWeek": 0,
    "stepLengthMeters": 0.75,
    "signupUrl": "https://worldwalking.com/",
    "signupPledge": "£10",
    "justGivingUrl": "",
    "totalWalkers": 0,
    "showTopSteppers": false,
    "announcement": "All four teams are lining up in London — the race begins on 15 July! Check back here every week to find out which destination each team has reached."
  },
  "teams": [
    { "id": "owls", "name": "The Owls", "color": "#0f8a3d", "emoji": "🦉", "members": 0 },
    { "id": "bumblebees", "name": "The Bumblebees", "color": "#f0a800", "emoji": "🐝", "members": 0 },
    { "id": "collies", "name": "The Border Collies", "color": "#d92632", "emoji": "🐕", "members": 0 },
    { "id": "dolphins", "name": "The Dolphins", "color": "#2d53ed", "emoji": "🐬", "members": 0 }
  ],
  "weeklySteps": {
    "owls":       [0, 0, 0],
    "bumblebees": [0, 0, 0],
    "collies":    [0, 0, 0],
    "dolphins":   [0, 0, 0]
  },
  "funds": { "owls": 0, "bumblebees": 0, "collies": 0, "dolphins": 0 },
  "topIndividuals": [],
  "events": [
    { "title": "3km fun run", "date": "2026-08-05", "time": "6pm",
      "location": "starting at RRA office",
      "description": "Join the office fun run around Green Park to support Trees for Cities. Every colleague who takes part donates £5 to Trees for Cities, and every step counts towards your team's total!(Deadline to sign up: 17th of July)",
      "link": "", "linkLabel": "Sign up & pledge your £5", "icon": "", "featured": true },
    { "title": "Sip & Paint", "date": "2026-07-21", "time": "4pm",
      "location": "RRA office (2nd floor kitchen)",
      "description": "Show off your artistic skills and paint a portrait of a colleague! We provide all the materials. Voting for the best portrait begins on 22 July. Win valuable points for your rally team!",
      "link": "", "linkLabel": "", "icon": "😊", "featured": false },
    { "title": "The Grand Finale", "date": "2026-08-06", "time": "6pm",
      "location": "RRA office",
      "description": "Keep an eye out for details regarding the fundraising project's grand finale night. Get excited!",
      "link": "", "linkLabel": "", "icon": "😍", "featured": false }
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
join the step challenge, take these two steps:" followed by a numbered list:
"1) sign up to the challenge on **World Walking** app and choose your team —
that's where your steps are tracked" and "2) pledge **£10** to Trees for
Cities on our **JustGiving** page" — then two pill buttons: a white
"Download World Walking app and join your team" linking to
`settings.signupUrl`, and an outlined "Donate on JustGiving" linking to
`settings.justGivingUrl`. While either URL is empty its button renders
dimmed and unclickable ("World Walking app — coming soon" / "JustGiving —
coming soon"). A second JustGiving button sits inside the fundraising
gradient banner.

At the top of the main column, before the leaderboards, an **announcement
panel**: a pale-blue gradient card titled "📣 Race Across the World — weekly
update" with the italic subline "Each destination on the route is home to
one of our interns.", the admin-written `settings.announcement` text, and a
"See the race map →" link to journey.html. Hidden when the announcement is
empty.

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
   The whole section is hidden when `settings.showTopSteppers` is false
   (the default).
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
2. **Warning note** — an always-visible amber card: "⚠️ **Important:** you
   must tag every donation with your **name**, **team** and **event**."
3. **📌 Upcoming events** — the remaining events sorted by date: uppercase
   bright-blue date line, bold title, location, small description, optional
   link.
4. **🌱 Why we're walking** — teal-accented card with this exact text and a
   teal pill button "Visit treesforcities.org →": "Trees for Cities is a
   London-founded charity transforming urban areas through tree planting,
   greener spaces and stronger connections with nature. Its work improves
   air quality, supports wildlife, tackles climate change and boosts
   wellbeing. Through volunteering, fundraising and planting events,
   businesses and communities can make a visible difference. So far, the
   charity has planted more than two million trees across the UK and
   internationally."

### 3.6 Race Across the World page (`journey.html`)

Nav label and headline: "Race Across the World", with the italic subheading
"Each destination on the route is home to one of our interns." Convert each
team's cumulative steps to km (× 0.75 / 1000) and plot progress along the
route.

Route waypoints `[name, lat, lng, legKmFromPrevious]` (~23,145 km total —
each destination is an intern's home city):

```
London 51.5074,-0.1278,0 · Paris 48.8566,2.3522,345 · Warsaw 52.2297,21.0122,1370 ·
Kyiv 50.4501,30.5234,690 · Istanbul 41.0082,28.9784,1060 · New Delhi 28.6139,77.2090,4560 ·
New York 40.7128,-74.0060,11760 · Mexico City 19.4326,-99.1332,3360
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
- **Links card**: fields for `settings.signupUrl` (the World Walking URL)
  and `settings.justGivingUrl` so the admin can set both without code.
- **Announcement card**: a textarea for `settings.announcement` (the weekly
  Race Across the World update on the home page).
- **Walkers card**: one input per team for `teams[].members`, plus a
  `settings.totalWalkers` manual-total override (0 = sum the teams).
- **Top steppers card**: includes a checkbox bound to
  `settings.showTopSteppers` that shows/hides the section on the site.
- **Form cards** generated from data.json: "results through week" selector
  (including a week-0 "Not started yet" option); per-team blocks (left
  border in team colour) with one step input per week (`totalWeeks`, so 3);
  per-team £ raised;
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
   the announcement panel and donation-tagging note render, the JustGiving
   button shows "coming soon" while its URL is empty, the map renders with
   4 markers at London, the Top steppers section is hidden, and the admin
   unlocks with `trees2026` and builds 12 step inputs (4 teams × 3 weeks).
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
      hero, the strikethrough "d" in the site name, the two-step World
      Walking/JustGiving call-out with its buttons, the 📣 announcement
      panel, and four stat cards (all zeros pre-launch).
- [ ] "Race Across the World" shows a map with a dashed route from London
      to Mexico City and 4 team markers at London.
- [ ] The sidebar features the 3km fun run, shows the amber donation-tagging
      note, lists the other events, and the Trees for Cities link works.
- [ ] The footer "Admin" link + passcode `trees2026` opens the admin console.
- [ ] Enter your token there, change a number, click **Publish changes**, and
      the public site updates within a couple of minutes.

Have fun! 🌳👟
