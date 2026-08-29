const state = {
  activePlanId: 1,
  plans: [
    {
      id: 1,
      name: "Oyster Bar Hopping",
      borough: "Manhattan",
      dateLabel: "August 29",
      visibility: "private",
      stops: [
        {
          id: 1,
          name: "Grand Central Oyster Bar",
          time: "16:00",
          location: "Midtown · Manhattan",
          category: "Food & Drink",
          note: "Start with oysters + drinks before heading downtown."
        },
        {
          id: 2,
          name: "Oyster Happy Hour",
          time: "18:00",
          location: "East Village · Manhattan",
          category: "Bar",
          note: "$1.50 oysters until 7 PM."
        },
        {
          id: 3,
          name: "Live Jazz Pop-Up",
          time: "19:30",
          location: "Lower East Side · Manhattan",
          category: "Event",
          note: "Free live set starting at 8."
        }
      ]
    },
    {
      id: 2,
      name: "Brooklyn Art Day",
      borough: "Brooklyn",
      dateLabel: "September 5",
      visibility: "public",
      stops: [
        {
          id: 4,
          name: "Bushwick Open Studios",
          time: "12:00",
          location: "Bushwick · Brooklyn",
          category: "Art",
          note: "Walk the block and check the side galleries."
        },
        {
          id: 5,
          name: "Sunset Rooftop",
          time: "18:30",
          location: "Williamsburg · Brooklyn",
          category: "Nightlife",
          note: "Golden hour with a drink and a view."
        }
      ]
    },
    {
      id: 3,
      name: "Random Queens Saturday",
      borough: "Queens",
      dateLabel: "September 12",
      visibility: "private",
      stops: [
        {
          id: 6,
          name: "Queens Night Market",
          time: "17:00",
          location: "Flushing · Queens",
          category: "Food",
          note: "Grab something savory and late-night snacks."
        }
      ]
    }
  ]
};

const dashboardTabs = document.querySelectorAll(".dashboard-tab");
const dashboardPanels = document.querySelectorAll("[data-dashboard-panel]");
const planList = document.getElementById("planList");
const planCount = document.getElementById("planCount");
const itineraryList = document.getElementById("itineraryList");
const itineraryTitle = document.querySelector(".itinerary-header h2");
const itineraryMeta = document.querySelector(".itinerary-header p");
const itineraryLabel = document.querySelector(".itinerary-label");
const privacyToggle = document.getElementById("privacyToggle");
const submitModal = document.getElementById("submitModal");
const closeSubmitModal = document.getElementById("closeSubmitModal");
const stopModal = document.getElementById("stopModal");
const closeStopModal = document.getElementById("closeStopModal");
const addStopButton = document.getElementById("addStopButton");
const addStopForm = document.getElementById("addStopForm");
const submitForm = document.getElementById("submissionForm");
const createPlanButtons = [
  document.getElementById("createPlanButton"),
  document.getElementById("sidebarCreatePlan")
].filter(Boolean);
const addToPlanButtons = document.querySelectorAll(".add-to-plan-button");
const inviteButtons = [
  document.getElementById("inviteFriendsButton"),
  document.getElementById("addFriendAvatar")
].filter(Boolean);

function renderPlans() {
  const activePlan = getActivePlan();

  planList.innerHTML = state.plans
    .map((plan) => {
      const stopCount = plan.stops.length;
      const isActive = plan.id === activePlan.id;

      return `
        <button class="plan-card ${isActive ? "active" : ""}" data-plan-id="${plan.id}" type="button">
          <span class="plan-card-date">
            ${getMonthAbbrev(plan.dateLabel)}<br />${getDateNumber(plan.dateLabel)}
          </span>
          <span class="plan-card-info">
            <strong>${escapeHTML(plan.name)}</strong>
            <small>${escapeHTML(plan.borough)} · ${stopCount} ${stopCount === 1 ? "stop" : "stops"}</small>
          </span>
        </button>
      `;
    })
    .join("");

  planCount.textContent = String(state.plans.length);

  planList.querySelectorAll(".plan-card").forEach((button) => {
    button.addEventListener("click", () => {
      state.activePlanId = Number(button.dataset.planId);
      renderPlans();
      renderItinerary();
    });
  });
}

function renderItinerary() {
  const activePlan = getActivePlan();
  if (!activePlan || !itineraryList) return;

  itineraryTitle.textContent = activePlan.name;
  itineraryMeta.textContent = `${activePlan.dateLabel} · ${activePlan.borough}`;
  itineraryLabel.innerHTML = `<span class="status-dot"></span> ${activePlan.visibility === "public" ? "PUBLIC PLAN" : "SATURDAY PLAN"}`;
  privacyToggle.checked = activePlan.visibility === "public";

  if (!activePlan.stops.length) {
    itineraryList.innerHTML = `
      <div class="empty-state">
        <h3>No stops yet</h3>
        <p>Add the first place, event, or food stop to build this itinerary.</p>
      </div>
    `;
    return;
  }

  const stopMarkup = activePlan.stops
    .map((stop, index) => {
      const formatted = formatTime(stop.time);
      const travelMarkup = index < activePlan.stops.length - 1
        ? `
          <div class="travel-row">
            <div class="travel-time">${estimateTravelTime(index)}</div>
            <div class="travel-line"></div>
            <div class="travel-details">${getTransitLabel(index)}</div>
          </div>
        `
        : "";

      return `
        ${travelMarkup}
        <article class="itinerary-stop" data-stop-id="${stop.id}">
          <div class="stop-time">${formatted.time}<span>${formatted.period}</span></div>
          <div class="timeline-marker"><span></span></div>
          <div class="stop-card">
            <div class="stop-image">
              <div class="asset-placeholder asset-placeholder--photo">${escapeHTML(stop.category.toUpperCase())}</div>
            </div>
            <div class="stop-content">
              <div class="stop-top">
                <span class="stop-category">${escapeHTML(stop.category.toUpperCase())}</span>
                <button class="stop-menu" type="button" aria-label="Stop options">•••</button>
              </div>
              <h3>${escapeHTML(stop.name)}</h3>
              <p>${escapeHTML(stop.location)}</p>
              <small>${escapeHTML(stop.note)}</small>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  itineraryList.innerHTML = stopMarkup;
}

function getActivePlan() {
  return state.plans.find((plan) => plan.id === state.activePlanId) || state.plans[0];
}

function createPlan(name) {
  if (!name) return;

  const nextId = Date.now();
  const newPlan = {
    id: nextId,
    name,
    borough: "Manhattan",
    dateLabel: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" }),
    visibility: "private",
    stops: [
      {
        id: Date.now() + 1,
        name: "New stop",
        time: "18:00",
        location: "Your neighborhood",
        category: "Custom",
        note: "Add a detail for this stop."
      }
    ]
  };

  state.plans.unshift(newPlan);
  state.activePlanId = newPlan.id;
  renderPlans();
  renderItinerary();
}

function addStopToActivePlan(stop) {
  const activePlan = getActivePlan();
  activePlan.stops.push({
    id: Date.now() + Math.random(),
    ...stop
  });
  renderPlans();
  renderItinerary();
}

function openSubmissionModal() {
  submitModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeSubmissionModal() {
  submitModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function openStopModal() {
  stopModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeAddStopModal() {
  stopModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function handleTabClick(event) {
  const target = event.currentTarget.dataset.panel;

  dashboardTabs.forEach((tab) => tab.classList.toggle("active", tab === event.currentTarget));
  dashboardPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.dashboardPanel === target);
  });
}

function bindSubmissionForm() {
  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const submissionName = document.getElementById("submissionName").value.trim();
    const selectedType = document.querySelector('input[name="submissionType"]:checked')?.value || "event";

    if (!submissionName) return;

    const typeLabel = selectedType.charAt(0).toUpperCase() + selectedType.slice(1);
    const newStop = {
      name: submissionName,
      time: document.querySelector(".event-only-field input[type='time']")?.value || "18:00",
      location: `${document.querySelectorAll(".form-grid select")[0]?.value || "Manhattan"} · ${document.querySelector("input[placeholder='Astoria']")?.value || "Your neighborhood"}`,
      category: typeLabel,
      note: document.querySelector("textarea")?.value || "Added from your latest submission."
    };

    addStopToActivePlan(newStop);
    submitForm.reset();
    closeSubmissionModal();
  });
}

function bindStopForm() {
  addStopForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("newStopName").value.trim();
    const time = document.getElementById("newStopTime").value;
    const neighborhood = document.getElementById("newStopNeighborhood").value.trim();

    if (!name || !time) return;

    addStopToActivePlan({
      name,
      time,
      location: neighborhood ? `${neighborhood} · ${getActivePlan().borough}` : `${getActivePlan().borough}`,
      category: "Custom",
      note: "Added manually to this plan."
    });

    addStopForm.reset();
    closeAddStopModal();
  });
}

function bindSavedButtons() {
  addToPlanButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const title = button.dataset.title || "Saved stop";
      addStopToActivePlan({
        name: title,
        time: "18:30",
        location: "Saved from your list",
        category: button.closest(".saved-mini-card")?.querySelector("span")?.textContent || "Saved",
        note: "Added directly from your saved list."
      });

      button.textContent = "Added ✓";
      button.disabled = true;
    });
  });
}

function bindModals() {
  document.querySelectorAll(".open-submit-event").forEach((button) => {
    button.addEventListener("click", openSubmissionModal);
  });

  document.getElementById("openSubmitEvent")?.addEventListener("click", openSubmissionModal);
  closeSubmitModal?.addEventListener("click", closeSubmissionModal);
  submitModal?.addEventListener("click", (event) => {
    if (event.target === submitModal) closeSubmissionModal();
  });

  addStopButton.addEventListener("click", openStopModal);
  closeStopModal.addEventListener("click", closeAddStopModal);
  stopModal.addEventListener("click", (event) => {
    if (event.target === stopModal) closeAddStopModal();
  });
}

function bindCreatePlan() {
  createPlanButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const name = window.prompt("What should we call this plan?");
      if (!name) return;
      createPlan(name.trim());
    });
  });
}

function bindInviteButtons() {
  inviteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const username = window.prompt("Enter a username or email to invite:");
      if (!username) return;
      window.alert(`Invite sent to ${username}.`);
    });
  });
}

function bindPrivacyToggle() {
  privacyToggle.addEventListener("change", () => {
    const activePlan = getActivePlan();
    activePlan.visibility = privacyToggle.checked ? "public" : "private";
    renderPlans();
    renderItinerary();
  });
}

function bindDashboardTabs() {
  dashboardTabs.forEach((tab) => tab.addEventListener("click", handleTabClick));
}

function bindLogout() {
  const logoutButton = document.getElementById("logoutButton");
  logoutButton?.addEventListener("click", () => {
    const confirmed = window.confirm("Log out?");
    if (!confirmed) return;
    window.alert("Logged out in this prototype.");
  });
}

function bindSavedFilters() {
  document.querySelectorAll(".saved-filter").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".saved-filter").forEach((filter) => filter.classList.remove("active"));
      button.classList.add("active");
    });
  });
}

function getMonthAbbrev(dateLabel) {
  const [month] = dateLabel.split(" ");
  return month.slice(0, 3).toUpperCase();
}

function getDateNumber(dateLabel) {
  const match = dateLabel.match(/\d+/);
  return match ? match[0] : "01";
}

function estimateTravelTime(index) {
  const times = ["24 min", "14 min", "18 min", "12 min", "20 min"];
  return times[index % times.length];
}

function getTransitLabel(index) {
  const labels = ["🚆 6 Train · Downtown", "🚶 Walk", "🚇 Subway · Uptown", "🚲 Bike", "🚶 Walk"]; 
  return labels[index % labels.length];
}

function formatTime(value) {
  const [hoursValue, minutes] = value.split(":");
  let hours = Number(hoursValue);
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return { time: `${hours}:${minutes}`, period };
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

bindDashboardTabs();
bindModals();
bindSubmissionForm();
bindStopForm();
bindSavedButtons();
bindCreatePlan();
bindInviteButtons();
bindPrivacyToggle();
bindSavedFilters();
bindLogout();
renderPlans();
renderItinerary();


/* =========================================
   DEVELOPMENT
========================================= */

console.log(
  "NYC Events profile dashboard ready."
);