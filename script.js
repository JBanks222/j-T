const records = [
  { id: "place-met-cloisters", type: "place", name: "The Met Cloisters", date: "Ongoing", dateValue: "2026-09-21", neighborhood: "Washington Heights", address: "99 Margaret Corbin Drive", price: "$30 suggested", mood: "quiet / medieval / garden", description: "A hilltop museum of medieval art with a real herb garden and Hudson-facing paths. Go early for the grounds.", sourceUrl: "https://www.metmuseum.org/visit/the-cloisters", sourceLabel: "metmuseum.org" },
  { id: "event-ny-film-festival", type: "event", name: "New York Film Festival", date: "Sep 25 – Oct 12, 2026", dateValue: "2026-09-25", neighborhood: "Lincoln Square", address: "Film at Lincoln Center", price: "Tickets vary", mood: "cinema / premieres / conversation", description: "A citywide-feeling film week anchored at Lincoln Center, with world premieres and strong repertory programming.", sourceUrl: "https://www.filmlinc.org/nyff/", sourceLabel: "filmlinc.org" },
  { id: "place-queens-night-market", type: "place", name: "Queens Night Market", date: "Saturdays, Apr – Oct", dateValue: "2026-09-26", neighborhood: "Corona", address: "New York Hall of Science grounds", price: "$6–15 per person", mood: "food / late night / communal", description: "A cash-friendly open-air market with food from dozens of countries and a famously generous price ceiling.", sourceUrl: "https://queensnightmarket.com/", sourceLabel: "queensnightmarket.com" },
  { id: "event-open-house-ny", type: "event", name: "Open House New York", date: "Oct 16 – 18, 2026", dateValue: "2026-10-16", neighborhood: "All five boroughs", address: "Multiple locations", price: "Many free / reservations", mood: "architecture / access / city history", description: "The annual weekend when usually private buildings, studios, and infrastructure open their doors across the five boroughs.", sourceUrl: "https://ohny.org/weekend/", sourceLabel: "ohny.org" },
  { id: "place-the-high-line", type: "place", name: "The High Line", date: "Ongoing, daily", dateValue: "2026-09-21", neighborhood: "Chelsea", address: "Gansevoort Street to 34th Street", price: "Free", mood: "walking / gardens / skyline", description: "An elevated public garden built on a freight rail line. The planting changes constantly; the northern stretch is usually calmer.", sourceUrl: "https://www.thehighline.org/visit/", sourceLabel: "thehighline.org" },
  { id: "event-halloween-parade", type: "event", name: "Village Halloween Parade", date: "Oct 31, 2026", dateValue: "2026-10-31", neighborhood: "Greenwich Village", address: "Sixth Avenue, Spring to 16th Street", price: "Free to watch", mood: "parade / costumes / night", description: "A maximalist, participatory nighttime parade led by puppets, bands, and thousands of costumed New Yorkers.", sourceUrl: "https://halloween-nyc.com/", sourceLabel: "halloween-nyc.com" },
  { id: "place-james-baldwin-outdoor", type: "place", name: "James Baldwin Outdoor Learning Center", date: "Ongoing", dateValue: "2026-09-21", neighborhood: "East Harlem", address: "Marble Hill / Harlem River area", price: "Free", mood: "books / garden / reflection", description: "A small, thoughtful outdoor space connected to the legacy of James Baldwin, good for a slower afternoon away from crowds.", sourceUrl: "https://www.nycgovparks.org/parks/", sourceLabel: "nycgovparks.org" },
  { id: "event-macys-parade", type: "event", name: "Macy's Thanksgiving Day Parade", date: "Nov 26, 2026", dateValue: "2026-11-26", neighborhood: "Midtown", address: "Central Park West to Herald Square", price: "Free to watch", mood: "spectacle / family / tradition", description: "The giant balloons, floats, marching bands, and public ritual that turn the west side of Manhattan into a moving stage.", sourceUrl: "https://www.macys.com/s/parade/", sourceLabel: "macys.com" },
  { id: "place-jazz-standard", type: "place", name: "Village Vanguard", date: "Shows nightly", dateValue: "2026-09-21", neighborhood: "Greenwich Village", address: "178 Seventh Avenue South", price: "$40–60", mood: "jazz / intimate / late night", description: "A basement room with serious acoustics and a long memory. Check the calendar, then arrive early for the best sightline.", sourceUrl: "https://villagevanguard.com/", sourceLabel: "villagevanguard.com" },
  { id: "place-fort-tryon", type: "place", name: "Fort Tryon Park", date: "Ongoing, daily", dateValue: "2026-09-21", neighborhood: "Hudson Heights", address: "Riverside Drive to Broadway", price: "Free", mood: "park / views / autumn", description: "A dramatic public park with winding paths, Heather Garden, and some of the best open views of the Hudson in Manhattan.", sourceUrl: "https://www.nycgovparks.org/parks/fort-tryon-park", sourceLabel: "nycgovparks.org" },
  { id: "event-winter-village", type: "event", name: "Bryant Park Winter Village", date: "Oct 30, 2026 – Jan 3, 2027", dateValue: "2026-10-30", neighborhood: "Midtown", address: "Bryant Park, between 40th & 42nd Streets", price: "Free entry / shopping varies", mood: "holiday / skating / browsing", description: "A compact holiday market wrapped around a free-to-watch ice rink, with food stalls and a high-energy Midtown glow.", sourceUrl: "https://bryantpark.org/activities/winter-village", sourceLabel: "bryantpark.org" },
  { id: "place-judd-foundation", type: "place", name: "The Judd Foundation", date: "Visits by appointment", dateValue: "2026-09-21", neighborhood: "SoHo", address: "101 Spring Street", price: "$25", mood: "art / design / architecture", description: "Donald Judd's five-story SoHo home and studio preserved as an integrated work of art. Book ahead; the scale is the point.", sourceUrl: "https://juddfoundation.org/visit/101-spring-street/", sourceLabel: "juddfoundation.org" }
];

const grid = document.querySelector("#directory-grid");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
let activeType = "all";

function formatType(type) { return type === "event" ? "Event" : "Place"; }

function renderRecords() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = records.filter((record) => {
    const searchable = Object.values(record).join(" ").toLowerCase();
    return (activeType === "all" || record.type === activeType) && searchable.includes(query);
  }).sort((a, b) => {
    if (sortSelect.value === "name") return a.name.localeCompare(b.name);
    if (sortSelect.value === "neighborhood") return a.neighborhood.localeCompare(b.neighborhood);
    if (sortSelect.value === "soonest") return a.dateValue.localeCompare(b.dateValue);
    return records.indexOf(a) - records.indexOf(b);
  });

  resultCount.textContent = `${filtered.length.toString().padStart(2, "0")} records`;
  emptyState.hidden = filtered.length > 0;
  grid.innerHTML = filtered.map((record, index) => `
    <article class="record" data-id="${record.id}" data-type="${record.type}" data-neighborhood="${record.neighborhood}">
      <div class="record-top"><span class="record-index">${String(index + 1).padStart(2, "0")}</span><span class="record-type">${formatType(record.type)}</span></div>
      <h3>${record.name}</h3>
      <p class="record-description">${record.description}</p>
      <dl class="record-meta">
        <div><dt class="meta-label">When</dt><dd class="meta-value">${record.date}</dd></div>
        <div><dt class="meta-label">Where</dt><dd class="meta-value">${record.neighborhood}</dd></div>
        <div><dt class="meta-label">Address</dt><dd class="meta-value">${record.address}</dd></div>
        <div><dt class="meta-label">Cost</dt><dd class="meta-value">${record.price}</dd></div>
      </dl>
      <a class="record-source" href="${record.sourceUrl}" target="_blank" rel="noreferrer">Verify at ${record.sourceLabel} ↗</a>
    </article>`).join("");
}

document.querySelectorAll("[data-filter-type]").forEach((button) => {
  button.addEventListener("click", () => {
    activeType = button.dataset.filterType;
    document.querySelectorAll("[data-filter-type]").forEach((item) => item.classList.toggle("selected", item === button));
    renderRecords();
  });
});
searchInput.addEventListener("input", renderRecords);
sortSelect.addEventListener("change", renderRecords);

document.querySelector("#structured-data").textContent = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "NYC Field Notes directory",
  "itemListElement": records.map((record, index) => ({ "@type": "ListItem", position: index + 1, item: { "@type": record.type === "event" ? "Event" : "Place", name: record.name, description: record.description, url: record.sourceUrl, address: record.address, location: record.neighborhood } }))
});

renderRecords();