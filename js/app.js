/* Shared data loading + dashboard rendering */

const DATA_URL = "data/data.json";

let DATA = null;

async function loadData() {
  const res = await fetch(`${DATA_URL}?t=${Date.now()}`);
  if (!res.ok) throw new Error(`Could not load data (${res.status})`);
  DATA = await res.json();
  return DATA;
}

/* ---------- helpers ---------- */

const fmt = (n) => Math.round(n).toLocaleString("en-GB");
const fmtGBP = (n) =>
  "£" + n.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

function stepsToKm(steps) {
  return (steps * DATA.settings.stepLengthMeters) / 1000;
}

function teamTotalSteps(teamId) {
  return (DATA.weeklySteps[teamId] || []).reduce((a, b) => a + (Number(b) || 0), 0);
}

function teamById(id) {
  return DATA.teams.find((t) => t.id === id);
}

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s == null ? "" : String(s);
  return d.innerHTML;
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

function showLoadError(err) {
  console.error(err);
  const main = document.querySelector("main");
  if (main) {
    main.insertAdjacentHTML(
      "afterbegin",
      `<p style="background:#fdeaef;color:#990c47;padding:14px 18px;border-radius:10px;margin:20px 0;font-weight:600">
        Sorry — the leaderboard data could not be loaded. Please refresh, or try again shortly.
      </p>`
    );
  }
}

/* ---------- dashboard ---------- */

function renderDashboard() {
  const s = DATA.settings;

  // Week pill
  const pill = document.getElementById("week-pill-text");
  if (pill) pill.textContent = `Week ${s.dataThroughWeek} of ${s.totalWeeks} · results in`;

  // Ranked teams
  const ranked = [...DATA.teams]
    .map((t) => ({ ...t, steps: teamTotalSteps(t.id), km: stepsToKm(teamTotalSteps(t.id)) }))
    .sort((a, b) => b.steps - a.steps);

  // Stat strip
  const totalSteps = ranked.reduce((a, t) => a + t.steps, 0);
  const totalKm = stepsToKm(totalSteps);
  const totalMoney = DATA.teams.reduce((a, t) => a + (Number(DATA.funds[t.id]) || 0), 0);
  const totalWalkers = DATA.teams.reduce((a, t) => a + (Number(t.members) || 0), 0);
  setText("stat-steps", fmt(totalSteps));
  setText("stat-km", fmt(totalKm) + " km");
  setText("stat-money", fmtGBP(totalMoney));
  setText("stat-walkers", String(totalWalkers));

  renderTeamBoard(ranked);
  renderWeekTable();
  renderIndividualBoard();
  renderFundBoard(totalMoney);
  renderEvents();
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function renderTeamBoard(ranked) {
  const el = document.getElementById("team-board");
  if (!el) return;
  const max = Math.max(...ranked.map((t) => t.steps), 1);
  el.innerHTML = ranked
    .map(
      (t, i) => `
      <div class="board-row ${i === 0 ? "first" : ""}">
        <div class="rank">${i + 1}</div>
        <div class="who">
          <div class="name"><span class="team-chip" style="background:${t.color}"></span>${t.emoji} ${esc(t.name)} ${i === 0 ? '<span class="crown">👑</span>' : ""}</div>
          <div class="meta">${t.members} walkers · ${fmt(t.km)} km travelled</div>
        </div>
        <div class="figures">
          <div class="big">${fmt(t.steps)}</div>
          <div class="small">steps</div>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${(t.steps / max) * 100}%;background:${t.color}"></div></div>
      </div>`
    )
    .join("");
}

function renderWeekTable() {
  const el = document.getElementById("week-table");
  if (!el) return;
  const s = DATA.settings;
  const weeks = s.dataThroughWeek;
  let head = "<thead><tr><th>Team</th>";
  for (let w = 1; w <= weeks; w++) head += `<th>Week ${w}</th>`;
  head += "<th>Total</th></tr></thead>";

  const rows = [...DATA.teams]
    .sort((a, b) => teamTotalSteps(b.id) - teamTotalSteps(a.id))
    .map((t) => {
      let cells = `<td><span class="team-chip" style="background:${t.color}"></span>${esc(t.name)}</td>`;
      for (let w = 0; w < weeks; w++) {
        cells += `<td>${fmt(DATA.weeklySteps[t.id][w] || 0)}</td>`;
      }
      cells += `<td class="total">${fmt(teamTotalSteps(t.id))}</td>`;
      return `<tr>${cells}</tr>`;
    })
    .join("");

  el.innerHTML = head + "<tbody>" + rows + "</tbody>";
}

function renderIndividualBoard() {
  const el = document.getElementById("individual-board");
  if (!el) return;
  const top = [...DATA.topIndividuals].sort((a, b) => b.steps - a.steps).slice(0, 5);
  const max = Math.max(...top.map((p) => p.steps), 1);
  el.innerHTML = top
    .map((p, i) => {
      const team = teamById(p.team);
      return `
      <div class="board-row ${i === 0 ? "first" : ""}">
        <div class="rank">${i + 1}</div>
        <div class="who">
          <div class="name">${esc(p.name)} ${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : ""}</div>
          <div class="meta"><span class="team-chip" style="background:${team ? team.color : "#ccc"}"></span> ${team ? esc(team.name) : ""}</div>
        </div>
        <div class="figures">
          <div class="big">${fmt(p.steps)}</div>
          <div class="small">steps</div>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${(p.steps / max) * 100}%;background:${team ? team.color : "#ccc"}"></div></div>
      </div>`;
    })
    .join("");
}

function renderFundBoard(totalMoney) {
  const el = document.getElementById("fund-board");
  if (!el) return;

  setText("fund-grand-total", fmtGBP(totalMoney));
  const treesNote = document.getElementById("fund-trees-note");
  if (treesNote) {
    // Trees for Cities: roughly £6 plants an urban tree
    const trees = Math.floor(totalMoney / 6);
    treesNote.innerHTML = `That's enough to plant roughly <strong>${fmt(trees)} urban trees</strong> 🌳`;
  }

  const ranked = [...DATA.teams]
    .map((t) => ({ ...t, raised: Number(DATA.funds[t.id]) || 0 }))
    .sort((a, b) => b.raised - a.raised);
  const max = Math.max(...ranked.map((t) => t.raised), 1);

  el.innerHTML = ranked
    .map(
      (t, i) => `
      <div class="board-row ${i === 0 ? "first" : ""}">
        <div class="rank">${i + 1}</div>
        <div class="who">
          <div class="name"><span class="team-chip" style="background:${t.color}"></span>${t.emoji} ${esc(t.name)} ${i === 0 ? '<span class="crown">💚</span>' : ""}</div>
          <div class="meta">running total</div>
        </div>
        <div class="figures">
          <div class="big">${fmtGBP(t.raised)}</div>
          <div class="small">raised</div>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${(t.raised / max) * 100}%;background:${t.color}"></div></div>
      </div>`
    )
    .join("");
}

function renderEvents() {
  const featuredEl = document.getElementById("featured-event");
  const listEl = document.getElementById("event-list");
  if (!featuredEl && !listEl) return;

  const events = [...DATA.events].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  const featured = events.find((e) => e.featured);
  const rest = events.filter((e) => e !== featured);

  if (featuredEl && featured) {
    featuredEl.innerHTML = `
      <div class="event-featured">
        <span class="flag">Featured event</span>
        <h3>${esc(featured.title)}</h3>
        <div class="when">${fmtDate(featured.date)}${featured.time ? " · " + esc(featured.time) : ""}${featured.location ? " · " + esc(featured.location) : ""}</div>
        <p>${esc(featured.description)}</p>
        ${featured.link ? `<a class="btn" href="${esc(featured.link)}" target="_blank" rel="noopener">${esc(featured.linkLabel || "Sign up")} →</a>` : ""}
      </div>`;
  }

  if (listEl) {
    listEl.innerHTML = rest
      .map(
        (e) => `
        <div class="event">
          <div class="event-date">${fmtDate(e.date)}${e.time ? " · " + esc(e.time) : ""}</div>
          <div class="event-title">${esc(e.title)}</div>
          ${e.location ? `<div class="event-loc">${esc(e.location)}</div>` : ""}
          <div class="event-desc">${esc(e.description)}</div>
          ${e.link ? `<a href="${esc(e.link)}" target="_blank" rel="noopener">${esc(e.linkLabel || "More info")} →</a>` : ""}
        </div>`
      )
      .join("");
  }
}
