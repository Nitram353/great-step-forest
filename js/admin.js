/* Admin console: passcode gate, form editing, publish to GitHub */

// SHA-256 of the admin passcode. Default passcode: "trees2026"
// To change it: run in the browser console —
//   crypto.subtle.digest('SHA-256', new TextEncoder().encode('your-new-passcode'))
//     .then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2,'0')).join('')))
// then paste the printed hash here.
const PASS_HASH = "de7e4bd473e9361b04f745667a43e19e5184d7534bc8744f9f12b5dfcc1d3be9";

const DATA_PATH = "data/data.json";

let workingData = null;

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function setStatus(id, cls, msg) {
  const el = document.getElementById(id);
  el.className = "status-msg " + cls;
  el.textContent = msg;
}

/* ---------- gate ---------- */

async function tryUnlock() {
  const pass = document.getElementById("gate-pass").value;
  const hash = await sha256Hex(pass);
  if (hash === PASS_HASH) {
    sessionStorage.setItem("gsf-unlocked", "1");
    openConsole();
  } else {
    setStatus("gate-status", "err", "Incorrect passcode.");
  }
}

async function openConsole() {
  document.getElementById("gate-card").style.display = "none";
  document.getElementById("console").style.display = "block";
  try {
    workingData = await loadData();
  } catch (e) {
    setStatus("publish-status", "err", "Could not load current data: " + e.message);
    return;
  }
  buildForms();
}

/* ---------- forms ---------- */

function buildForms() {
  const d = workingData;

  // repo + token (remembered in this browser)
  document.getElementById("gh-repo").value = localStorage.getItem("gsf-repo") || "Nitram353/great-step-forest";
  document.getElementById("gh-token").value = localStorage.getItem("gsf-token") || "";

  // data-through-week selector
  const sel = document.getElementById("data-through-week");
  sel.innerHTML = "";
  for (let w = 1; w <= d.settings.totalWeeks; w++) {
    sel.insertAdjacentHTML("beforeend", `<option value="${w}" ${w === d.settings.dataThroughWeek ? "selected" : ""}>Week ${w}</option>`);
  }

  // weekly steps per team
  const blocks = document.getElementById("steps-blocks");
  blocks.innerHTML = d.teams
    .map((t) => {
      const weeks = Array.from({ length: d.settings.totalWeeks }, (_, w) => {
        const v = (d.weeklySteps[t.id] || [])[w] || 0;
        return `<div class="field"><label>Wk ${w + 1}</label>
          <input type="number" min="0" step="1" data-steps-team="${t.id}" data-week="${w}" value="${v}" /></div>`;
      }).join("");
      return `<div class="admin-team-block" style="border-left-color:${t.color}">
        <h4>${t.emoji} ${esc(t.name)}</h4>
        <div class="grid-weeks">${weeks}</div>
      </div>`;
    })
    .join("");

  // funds
  document.getElementById("funds-fields").innerHTML = d.teams
    .map(
      (t) => `<div class="field">
        <label>${esc(t.name)} (£)</label>
        <input type="number" min="0" step="1" data-fund-team="${t.id}" value="${Number(d.funds[t.id]) || 0}" />
      </div>`
    )
    .join("");

  // individuals
  const rows = document.getElementById("individual-rows");
  rows.innerHTML = "";
  d.topIndividuals.forEach((p) => addIndividualRow(p));
  document.getElementById("add-individual").onclick = () => addIndividualRow({ name: "", team: d.teams[0].id, steps: 0 });

  // events
  const evRows = document.getElementById("event-rows");
  evRows.innerHTML = "";
  d.events.forEach((e) => addEventRow(e));
  document.getElementById("add-event").onclick = () =>
    addEventRow({ title: "", date: "", time: "", location: "", description: "", link: "", linkLabel: "", featured: false });

  document.getElementById("publish-btn").onclick = publish;
  document.getElementById("download-btn").onclick = downloadJson;
}

function teamOptions(selected) {
  return workingData.teams
    .map((t) => `<option value="${t.id}" ${t.id === selected ? "selected" : ""}>${esc(t.name)}</option>`)
    .join("");
}

function addIndividualRow(p) {
  const rows = document.getElementById("individual-rows");
  const div = document.createElement("div");
  div.className = "row-list-item";
  div.innerHTML = `
    <input type="text" placeholder="Name (e.g. Priya S.)" class="ind-name" value="${esc(p.name)}" />
    <select class="ind-team">${teamOptions(p.team)}</select>
    <input type="number" min="0" step="1" class="ind-steps" placeholder="Steps" value="${Number(p.steps) || 0}" />
    <button class="btn-ghost" type="button">Remove</button>`;
  div.querySelector("button").onclick = () => div.remove();
  rows.appendChild(div);
}

function addEventRow(e) {
  const rows = document.getElementById("event-rows");
  const div = document.createElement("div");
  div.className = "event-edit";
  div.innerHTML = `
    <div class="grid-3">
      <div class="field"><label>Title</label><input type="text" class="ev-title" value="${esc(e.title)}" /></div>
      <div class="field"><label>Date</label><input type="date" class="ev-date" value="${esc(e.date)}" /></div>
      <div class="field"><label>Time</label><input type="text" class="ev-time" placeholder="e.g. 9:00am" value="${esc(e.time)}" /></div>
    </div>
    <div class="field"><label>Location</label><input type="text" class="ev-loc" value="${esc(e.location)}" /></div>
    <div class="field"><label>Description</label><textarea class="ev-desc" rows="2">${esc(e.description)}</textarea></div>
    <div class="grid-2">
      <div class="field"><label>Link (optional)</label><input type="url" class="ev-link" placeholder="https://…" value="${esc(e.link)}" /></div>
      <div class="field"><label>Link label</label><input type="text" class="ev-link-label" placeholder="Sign up" value="${esc(e.linkLabel)}" /></div>
    </div>
    <div class="checkbox-row">
      <input type="checkbox" class="ev-featured" ${e.featured ? "checked" : ""} />
      <label>Featured event (pinned to the top of the sidebar)</label>
      <span style="flex:1"></span>
      <button class="btn-ghost" type="button">Remove</button>
    </div>`;
  div.querySelector("button.btn-ghost").onclick = () => div.remove();
  rows.appendChild(div);
}

/* ---------- collect + publish ---------- */

function collectForms() {
  const d = workingData;

  d.settings.dataThroughWeek = Number(document.getElementById("data-through-week").value);

  document.querySelectorAll("[data-steps-team]").forEach((input) => {
    const team = input.dataset.stepsTeam;
    const week = Number(input.dataset.week);
    if (!d.weeklySteps[team]) d.weeklySteps[team] = new Array(d.settings.totalWeeks).fill(0);
    d.weeklySteps[team][week] = Number(input.value) || 0;
  });

  document.querySelectorAll("[data-fund-team]").forEach((input) => {
    d.funds[input.dataset.fundTeam] = Number(input.value) || 0;
  });

  d.topIndividuals = [...document.querySelectorAll("#individual-rows .row-list-item")]
    .map((row) => ({
      name: row.querySelector(".ind-name").value.trim(),
      team: row.querySelector(".ind-team").value,
      steps: Number(row.querySelector(".ind-steps").value) || 0,
    }))
    .filter((p) => p.name);

  d.events = [...document.querySelectorAll("#event-rows .event-edit")]
    .map((row) => ({
      title: row.querySelector(".ev-title").value.trim(),
      date: row.querySelector(".ev-date").value,
      time: row.querySelector(".ev-time").value.trim(),
      location: row.querySelector(".ev-loc").value.trim(),
      description: row.querySelector(".ev-desc").value.trim(),
      link: row.querySelector(".ev-link").value.trim(),
      linkLabel: row.querySelector(".ev-link-label").value.trim(),
      featured: row.querySelector(".ev-featured").checked,
    }))
    .filter((e) => e.title);

  return d;
}

function toBase64Utf8(str) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

async function publish() {
  const repo = document.getElementById("gh-repo").value.trim();
  const token = document.getElementById("gh-token").value.trim();
  if (!repo || !repo.includes("/")) {
    setStatus("publish-status", "err", "Enter the repository as owner/name, e.g. martin/trees-step-challenge.");
    return;
  }
  if (!token) {
    setStatus("publish-status", "err", "Paste your GitHub token in the publishing setup box first.");
    return;
  }
  localStorage.setItem("gsf-repo", repo);
  localStorage.setItem("gsf-token", token);

  const btn = document.getElementById("publish-btn");
  btn.disabled = true;
  setStatus("publish-status", "busy", "Publishing…");

  try {
    const data = collectForms();
    const body = JSON.stringify(data, null, 2) + "\n";
    const api = `https://api.github.com/repos/${repo}/contents/${DATA_PATH}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    // fetch current SHA of the file (required to update it)
    const getRes = await fetch(`${api}?t=${Date.now()}`, { headers });
    if (!getRes.ok) throw new Error(`Could not read ${DATA_PATH} from ${repo} (HTTP ${getRes.status}). Check the repo name and token permissions.`);
    const current = await getRes.json();

    const putRes = await fetch(api, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `Update competition data (through week ${data.settings.dataThroughWeek})`,
        content: toBase64Utf8(body),
        sha: current.sha,
      }),
    });
    if (!putRes.ok) {
      const err = await putRes.json().catch(() => ({}));
      throw new Error(`GitHub rejected the update (HTTP ${putRes.status}). ${err.message || ""}`);
    }

    setStatus("publish-status", "ok", "✅ Published! The live site will refresh within a minute or two.");
  } catch (e) {
    setStatus("publish-status", "err", e.message);
  } finally {
    btn.disabled = false;
  }
}

function downloadJson() {
  const data = collectForms();
  const blob = new Blob([JSON.stringify(data, null, 2) + "\n"], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "data.json";
  a.click();
  URL.revokeObjectURL(a.href);
  setStatus("publish-status", "ok", "Downloaded. Replace data/data.json in the repo with this file to publish.");
}

/* ---------- init ---------- */

document.getElementById("gate-btn").onclick = tryUnlock;
document.getElementById("gate-pass").addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryUnlock();
});
if (sessionStorage.getItem("gsf-unlocked") === "1") openConsole();
