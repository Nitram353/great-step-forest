# 📖 Admin Guide — RRA Intern Fun~~d~~ Raising Challenge

How to enter step totals, money raised and events — written so you can test
the whole flow yourself before handing over.

The one idea to hold onto: **the website displays whatever is in one file
(`data/data.json`) in the GitHub repository.** The admin page is just a
friendly form that rewrites that file for you. Nothing else ever changes.

---

## 1. What you need

- The website: https://nitram353.github.io/great-step-forest/
- The admin passcode: `trees2026`
- The GitHub token (the one with *Contents: read & write* on the repo).
  Whoever administers the site needs this token once — it's remembered by
  their browser afterwards.

## 2. Opening the admin console

1. Scroll to the bottom of any page of the site and click the faint
   **Admin** link in the footer (or go straight to
   https://nitram353.github.io/great-step-forest/admin.html).
2. Enter the passcode `trees2026` and click **Unlock**.
3. First time only: in **⚙️ Publishing setup**, check the repository says
   `Nitram353/great-step-forest` and paste the GitHub token into the token
   box. Both are remembered by this browser for next time.

## 3. How step tracking works (participants → teams)

The website keeps score **per team per week**. Individual step counts live
in the **StepUp** app — everyone downloads it and joins their team using
that team's join link (each team has its own, shown as four buttons on the
home page), and their phone tracks their steps. Each week you read each
team's total out of StepUp and type the four totals into the website's
admin page.

(There is also a hidden **top 5 individuals** leaderboard — it's switched
off because we can't yet identify top steppers. If you find a way,
tick "Show the Top steppers section on the site" in the admin and fill in
the names.)

The challenge runs **3 weeks, 15 July – 6 August**. The final day
(Wednesday 6 August) simply counts into the week-3 totals.

## 4. The weekly routine (5 minutes)

Say week 1 has just finished:

1. Open the admin page and unlock it.
2. **👟 Weekly steps** — for each of the four teams, type the team's week-1
   total (from StepUp) into the **Wk 1** box. Leave future weeks at 0.
3. At the top of that card, set **"Results entered through week"** to
   **Week 1**. (This controls what the site shows — the leaderboards, the
   week-by-week table and the "Week 1 of 3" badge all follow it.)
4. **📣 Weekly announcement** — rewrite the announcement text to say which
   destination each team has reached in the Race Across the World (e.g.
   "The Owls have stormed past Paris, the Dolphins are closing in…").
5. **💚 Money raised** — update each team's running £ total from the tagged
   donations on JustGiving (this is why every donation must be tagged with
   name, team and event).
6. **🚶 Walkers** — keep the per-team walker counts up to date as people
   sign up; the "colleagues walking" tile adds them up automatically (or
   type a manual total to override).
7. Click **🚀 Publish changes**. You'll see "✅ Published!" — the public site
   updates within a minute or two. Refresh the home page to admire it.

Each following week: add the new week's numbers into the next **Wk** box,
move the "through week" selector on by one, refresh the top-5 and money,
publish. For the last entry, remember to include Wednesday 6 August's steps
in the week-3 numbers.

## 5. Other things you can change on the admin page

- **🔗 Sign-up & donation links** — one StepUp join link per team (these
  drive the four "Join …" buttons on the home page), the StepUp app download
  URL, and the JustGiving URL. A team's button shows "coming soon" while its
  field is empty. (Event sign-up links are set per event in the Events
  section.)
- **Distance multiplier** (in the Weekly steps card) — scales every km shown
  on the site. Keep it at 1.0 for real distances; if the teams turn out to be
  small and the Race Across the World map needs livening up, raise it (e.g.
  5.0 makes every real km count as 5 km on the map) and publish. You can
  change it at any point during the challenge — past weeks rescale too,
  keeping the race fair.
- **📌 Events** — add/edit/remove events. Tick **Featured** to give an event
  the big gradient card at the top of the sidebar (the 5k fun run and the
  Darts & raffle night are both featured now); the emoji box sets the big
  background picture on that card.

## 6. Test run (do this now, then undo it)

1. Unlock the admin page and enter `50000` as **Wk 1** for The Owls.
2. Set "Results entered through week" to **Week 1**.
3. Change the weekly announcement text to something like "Test: the Owls
   are on the road to Paris!".
4. Publish, wait a minute, then open the home page: the Owls should lead the
   team board with 50,000 steps (37.5 km), the week-by-week table should
   show a Week 1 column, and your announcement should appear in the 📣
   panel. Check the Race Across the World page too — the Owls' marker
   should have left London.
5. Go back to the admin page, set the steps back to `0`, restore the
   announcement text, set the week selector back to **Not started yet**,
   and publish again.

## 7. If something goes wrong

- **"GitHub rejected the update" / HTTP 403** — the token is wrong, expired,
  or lost its *Contents: read & write* permission. Fix it at
  github.com/settings/personal-access-tokens and paste the new token in.
- **Published but the site hasn't changed** — give it two minutes and
  hard-refresh (Cmd+Shift+R). GitHub Pages takes a moment to update.
- **Made a mess of the numbers** — every publish is a git commit, so nothing
  is ever lost. The file history is at
  https://github.com/Nitram353/great-step-forest/commits/main — open any
  older version of `data/data.json`, copy it, and paste it over the current
  file using GitHub's ✏️ edit button.
- **Forgot the passcode** — it's `trees2026` (changing it: see README).

## 8. Handing over

Give your daughter: this guide, the passcode, and the GitHub token (or make
her a new token of her own — Settings → Developer settings → Fine-grained
tokens → access to `great-step-forest` → Contents: read & write). That's
everything the admin needs.
