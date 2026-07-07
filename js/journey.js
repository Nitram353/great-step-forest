/* The Journey — cumulative team distance plotted along a route from London */

// Route waypoints: [name, lat, lng, legKm] — legKm is walking distance from previous point
const ROUTE = [
  ["London", 51.5074, -0.1278, 0],
  ["Rochester", 51.3886, 0.5041, 55],
  ["Canterbury", 51.2802, 1.0789, 45],
  ["Dover", 51.1279, 1.3134, 30],
  ["Calais", 50.9513, 1.8587, 45], // channel crossing — we let the teams 'walk on water'
  ["Amiens", 49.8942, 2.2957, 130],
  ["Paris", 48.8566, 2.3522, 150],
  ["Auxerre", 47.7982, 3.5730, 185],
  ["Dijon", 47.3220, 5.0415, 150],
  ["Geneva", 46.2044, 6.1432, 200],
  ["Chamonix", 45.9237, 6.8694, 85],
  ["Aosta", 45.7372, 7.3206, 65],
  ["Milan", 45.4642, 9.1900, 185],
  ["Bologna", 44.4949, 11.3426, 215],
  ["Florence", 43.7696, 11.2558, 105],
  ["Siena", 43.3188, 11.3308, 75],
  ["Rome", 41.9028, 12.4964, 215],
  ["Naples", 40.8518, 14.2681, 230],
  ["Bari", 41.1171, 16.8719, 265],
  ["Igoumenitsa", 39.5060, 20.2658, 330], // Adriatic crossing
  ["Ioannina", 39.6650, 20.8537, 80],
  ["Meteora", 39.7217, 21.6306, 105],
  ["Delphi", 38.4824, 22.5010, 175],
  ["Athens", 37.9838, 23.7275, 180],
  ["Thessaloniki", 40.6401, 22.9444, 500],
  ["Alexandroupoli", 40.8457, 25.8740, 345],
  ["Istanbul", 41.0082, 28.9784, 300],
];

// cumulative km at each waypoint
const CUM = ROUTE.reduce((acc, wp, i) => {
  acc.push((i === 0 ? 0 : acc[i - 1]) + wp[3]);
  return acc;
}, []);
const ROUTE_TOTAL_KM = CUM[CUM.length - 1];

function pointAtKm(km) {
  if (km <= 0) return { lat: ROUTE[0][1], lng: ROUTE[0][2] };
  if (km >= ROUTE_TOTAL_KM) {
    const last = ROUTE[ROUTE.length - 1];
    return { lat: last[1], lng: last[2] };
  }
  let i = 1;
  while (CUM[i] < km) i++;
  const prev = ROUTE[i - 1];
  const next = ROUTE[i];
  const f = (km - CUM[i - 1]) / (CUM[i] - CUM[i - 1]);
  return {
    lat: prev[1] + (next[1] - prev[1]) * f,
    lng: prev[2] + (next[2] - prev[2]) * f,
  };
}

function nextMilestone(km) {
  for (let i = 0; i < CUM.length; i++) {
    if (CUM[i] > km) return { name: ROUTE[i][0], remaining: CUM[i] - km };
  }
  return null;
}

function lastMilestone(km) {
  let name = ROUTE[0][0];
  for (let i = 0; i < CUM.length; i++) {
    if (CUM[i] <= km) name = ROUTE[i][0];
  }
  return name;
}

function renderJourney() {
  const s = DATA.settings;
  const pill = document.getElementById("week-pill-text");
  if (pill) pill.textContent = `Week ${s.dataThroughWeek} of ${s.totalWeeks} · the race is on`;

  const teams = [...DATA.teams]
    .map((t) => {
      const steps = teamTotalSteps(t.id);
      const km = stepsToKm(steps);
      return { ...t, steps, km };
    })
    .sort((a, b) => b.km - a.km);

  renderJourneyCards(teams);
  renderMap(teams);
  renderMilestones(teams);
}

function renderJourneyCards(teams) {
  const el = document.getElementById("journey-cards");
  if (!el) return;
  el.innerHTML = teams
    .map((t, i) => {
      const next = nextMilestone(t.km);
      const last = lastMilestone(t.km);
      return `
      <div class="journey-card" style="border-top-color:${t.color}">
        <div class="team-name"><span class="team-chip" style="background:${t.color}"></span>${t.emoji} ${esc(t.name)} ${i === 0 ? "👑" : ""}</div>
        <div class="km">${fmt(t.km)} km</div>
        <div class="next">Passed <strong>${esc(last)}</strong>${next ? ` — ${fmt(next.remaining)} km to <strong>${esc(next.name)}</strong>` : " — route complete!"}</div>
      </div>`;
    })
    .join("");
}

function renderMap(teams) {
  const mapEl = document.getElementById("map");
  if (!mapEl || typeof L === "undefined") return;

  const map = L.map("map", { scrollWheelZoom: false, center: [46, 10], zoom: 5 });
  window._gsfMap = map;
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 12,
  }).addTo(map);

  const routeLatLngs = ROUTE.map((wp) => [wp[1], wp[2]]);

  // Full route (dashed, faint)
  L.polyline(routeLatLngs, {
    color: "#0a2fb5",
    weight: 2.5,
    opacity: 0.35,
    dashArray: "6 8",
  }).addTo(map);

  // Milestone city dots
  ROUTE.forEach((wp, i) => {
    L.circleMarker([wp[1], wp[2]], {
      radius: 4,
      color: "#0a2fb5",
      fillColor: "#ffffff",
      fillOpacity: 1,
      weight: 2,
    })
      .addTo(map)
      .bindTooltip(`${wp[0]} · ${fmt(CUM[i])} km`, { direction: "top" });
  });

  // Each team: progress line + marker (draw leaders last so they sit on top)
  [...teams].reverse().forEach((t) => {
    const progress = [];
    for (let i = 0; i < ROUTE.length && CUM[i] <= t.km; i++) progress.push([ROUTE[i][1], ROUTE[i][2]]);
    const tip = pointAtKm(t.km);
    progress.push([tip.lat, tip.lng]);

    L.polyline(progress, { color: t.color, weight: 4.5, opacity: 0.85 }).addTo(map);

    const icon = L.divIcon({
      className: "",
      html: `<div class="leaflet-team-marker" style="background:${t.color}">${t.emoji}</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 30],
    });

    L.marker([tip.lat, tip.lng], { icon, zIndexOffset: Math.round(t.km) })
      .addTo(map)
      .bindPopup(
        `<strong>${esc(t.name)}</strong><br>${fmt(t.steps)} steps · ${fmt(t.km)} km from London`
      );
  });

  // Fit map to show London through just beyond the leading team
  const leaderKm = Math.max(...teams.map((t) => t.km));
  const ahead = pointAtKm(Math.min(leaderKm + 400, ROUTE_TOTAL_KM));
  const bounds = L.latLngBounds([routeLatLngs[0], [ahead.lat, ahead.lng]]);
  teams.forEach((t) => {
    const p = pointAtKm(t.km);
    bounds.extend([p.lat, p.lng]);
  });
  // Fit once layout has settled, and refit whenever the container's size changes
  // (handles the map being initialised while hidden or during a resize)
  const fit = () => {
    if (!mapEl.offsetWidth) return;
    map.invalidateSize();
    map.fitBounds(bounds.pad(0.15));
  };
  requestAnimationFrame(fit);
  if (typeof ResizeObserver !== "undefined") {
    let lastW = mapEl.offsetWidth;
    new ResizeObserver(() => {
      if (mapEl.offsetWidth !== lastW) {
        lastW = mapEl.offsetWidth;
        fit();
      }
    }).observe(mapEl);
  }
}

function renderMilestones(teams) {
  const el = document.getElementById("milestones");
  if (!el) return;
  el.innerHTML = ROUTE.map((wp, i) => {
    if (i === 0) return ""; // skip London
    const reachedBy = teams.filter((t) => t.km >= CUM[i]);
    return `
      <div class="milestone ${reachedBy.length ? "reached" : ""}">
        <div class="city">${esc(wp[0])}</div>
        <div class="km-label">${fmt(CUM[i])} km</div>
        <div class="reached-by">${reachedBy.map((t) => t.emoji).join(" ") || "&nbsp;"}</div>
      </div>`;
  }).join("");
}
