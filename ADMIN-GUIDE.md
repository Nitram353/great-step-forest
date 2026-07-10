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

The website keeps score **per team per week**, plus a **top 5 individuals**
list. Individual step counts live in **Stridekick** — everyone joins the
company challenge there and their phone/watch tracks their steps
automatically. Each week you read the numbers out of Stridekick (each team's
total, and the individual leaderboard) and type four team totals plus the
top 5 into the website's admin page.

The challenge runs **3 weeks, 15 July – 6 August**. The final day
(Wednesday 6 August) simply counts into the week-3 totals.

## 4. The weekly routine (5 minutes)

Say week 1 has just finished:

1. Open the admin page and unlock it.
2. **👟 Weekly steps** — for each of the four teams, type the team's week-1
   total (from Stridekick) into the **Wk 1** box. Leave future weeks at 0.
3. At the top of that card, set **"Results entered through week"** to
   **Week 1**. (This controls what the site shows — the leaderboards, the
   week-by-week table and the "Week 1 of 3" badge all follow it.)
4. **💚 Money raised** — update each team's running £ total (sign-up pledges,
   event pledges, GoFundMe donations attributed to that team — however you
   want to count it).
5. **⭐ Top individual steppers** — from Stridekick's individual leaderboard,
   take the five people with the most *cumulative* steps and enter them:
   name (first name + initial is plenty), their team, and their total steps.
   Use **+ Add person** / **Remove** to manage the list.
6. Click **🚀 Publish changes**. You'll see "✅ Published!" — the public site
   updates within a minute or two. Refresh the home page to admire it.

Each following week: add the new week's numbers into the next **Wk** box,
move the "through week" selector on by one, refresh the top-5 and money,
publish. For the last entry, remember to include Wednesday 6 August's steps
in the week-3 numbers.

## 5. Other things you can change on the admin page

- **🔗 Sign-up & donation links** — the Stridekick challenge URL and the
  GoFundMe URL. The matching home-page buttons show "coming soon" until you
  paste the real link here and publish. (The two featured events sign up via
  the Google Sheet — those links are set on each event in the Events
  section.)
- **📌 Events** — add/edit/remove events. Tick **Featured** to give an event
  the big gradient card at the top of the sidebar (the 5k fun run and the
  Darts & raffle night are both featured now); the emoji box sets the big
  background picture on that card.

## 6. Test run (do this now, then undo it)

1. Unlock the admin page and enter `50000` as **Wk 1** for The Owls.
2. Set "Results entered through week" to **Week 1**.
3. Add one top stepper: `Test T.`, The Owls, `50000`.
4. Publish, wait a minute, then open the home page: the Owls should lead the
   team board with 50,000 steps (37.5 km), the week-by-week table should
   show a Week 1 column, and Test T. should top the ⭐ leaderboard. Check
   The Journey page too — the Owls' marker should have left London.
5. Go back to the admin page, set the steps back to `0`, remove Test T.,
   set the week selector back to **Not started yet**, and publish again.

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
