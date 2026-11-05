const tripForm = document.getElementById("tripForm");
const itineraryArea = document.getElementById("itineraryArea");
const itineraryTitle = document.getElementById("itineraryTitle");
const itineraryMeta = document.getElementById("itineraryMeta");
const itineraryList = document.getElementById("itineraryList");
const activityForm = document.getElementById("activityForm");
const activityInput = document.getElementById("activityInput");

const destinationIdeas = {
  bali: [
    ["Arrive & unwind", "Check in, settle into your stay, and enjoy a relaxed dinner near the beach."],
    ["Island discoveries", "Explore a local temple, wander through lush rice terraces, and stop for a scenic lunch."],
    ["A slower morning", "Start with a relaxed breakfast, browse local shops, and enjoy a sunset by the water."]
  ],
  kyoto: [
    ["Welcome to Kyoto", "Check in, stroll through a traditional neighbourhood, and try a local noodle spot."],
    ["Temples & gardens", "Visit a peaceful temple garden, explore old streets, and enjoy a traditional tea break."],
    ["Markets & memories", "Browse Nishiki Market, pick up a few souvenirs, and take an evening riverside walk."]
  ],
  paris: [
    ["Bonjour, Paris", "Settle in, walk along the Seine, and enjoy a cosy café dinner."],
    ["Art & iconic views", "Spend the morning at a museum, explore elegant neighbourhood streets, and see the city glow at dusk."],
    ["A Parisian morning", "Visit a bakery, browse a local market, and enjoy one last leisurely walk."]
  ],
  default: [
    ["Arrive & explore", "Check in, get your bearings, and discover a nearby café or local restaurant."],
    ["The main attractions", "Spend the day exploring a landmark, a neighbourhood, and a local food favourite."],
    ["Local favourites", "Enjoy a slower morning, discover somewhere off the usual route, and watch the sunset."]
  ]
};

let currentDays = 3;

function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function daysBetween(start, end) {
  const a = new Date(`${start}T12:00:00`);
  const b = new Date(`${end}T12:00:00`);
  return Math.round((b - a) / 86400000);
}

function makeActivity(text) {
  const item = document.createElement("div");
  item.className = "activity";
  const dot = document.createElement("span");
  dot.className = "activity-dot";
  const label = document.createElement("span");
  label.textContent = text;
  item.append(dot, label);
  return item;
}

function renderItinerary(destination, start, days) {
  itineraryList.innerHTML = "";
  const key = destination.toLowerCase().includes("bali") ? "bali"
    : destination.toLowerCase().includes("kyoto") ? "kyoto"
    : destination.toLowerCase().includes("paris") ? "paris" : "default";
  const ideas = destinationIdeas[key];

  for (let i = 0; i < days; i++) {
    const day = document.createElement("section");
    day.className = "day-card";
    const date = new Date(`${start}T12:00:00`);
    date.setDate(date.getDate() + i);

    const label = document.createElement("div");
    label.className = "day-label";
    label.textContent = `DAY ${i + 1} · ${date.toLocaleDateString(undefined, { weekday: "short" }).toUpperCase()}`;

    const activities = document.createElement("div");
    const idea = ideas[i % ideas.length];
    activities.append(makeActivity(idea[0]), makeActivity(idea[1]));
    day.append(label, activities);
    itineraryList.append(day);
  }
  currentDays = days;
}

tripForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const destination = document.getElementById("destination").value.trim();
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;
  const travelers = document.getElementById("travelers").value;
  const days = daysBetween(start, end);

  if (!destination) return;
  if (!start || !end || days < 1) {
    alert("Please choose valid dates. Check-out must be after check-in.");
    return;
  }
  if (days > 21) {
    alert("For this sample planner, please choose a trip of 21 days or fewer.");
    return;
  }

  itineraryTitle.textContent = `${destination} getaway`;
  itineraryMeta.textContent = `${formatDate(start)} — ${formatDate(end)} · ${travelers} traveler${travelers === "1" ? "" : "s"} · ${days} days`;
  renderItinerary(destination, start, days);
  itineraryArea.hidden = false;
  itineraryArea.scrollIntoView({ behavior: "smooth", block: "start" });
});

activityForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = activityInput.value.trim();
  if (!value) return;

  let lastDay = itineraryList.lastElementChild;
  if (!lastDay) {
    const day = document.createElement("section");
    day.className = "day-card";
    const label = document.createElement("div");
    label.className = "day-label";
    label.textContent = `DAY ${currentDays + 1}`;
    const activities = document.createElement("div");
    day.append(label, activities);
    itineraryList.append(day);
    lastDay = day;
    currentDays += 1;
  }
  lastDay.lastElementChild.append(makeActivity(value));
  activityInput.value = "";
});

document.getElementById("printButton").addEventListener("click", () => window.print());

document.querySelectorAll(".destination-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.getElementById("destination").value = card.dataset.destination;
    document.getElementById("planner").scrollIntoView({ behavior: "smooth" });
    document.getElementById("destination").focus({ preventScroll: true });
  });
});

// Set sensible default dates: one week from today, for a three-night stay.
const today = new Date();
const startDefault = new Date(today);
startDefault.setDate(today.getDate() + 7);
const endDefault = new Date(startDefault);
endDefault.setDate(startDefault.getDate() + 3);
const toInputDate = (date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};
document.getElementById("startDate").value = toInputDate(startDefault);
document.getElementById("endDate").value = toInputDate(endDefault);
document.getElementById("startDate").min = toInputDate(today);
document.getElementById("endDate").min = toInputDate(startDefault);

document.getElementById("startDate").addEventListener("change", (event) => {
  const nextDay = new Date(`${event.target.value}T12:00:00`);
  nextDay.setDate(nextDay.getDate() + 1);
  const minEnd = toInputDate(nextDay);
  const endInput = document.getElementById("endDate");
  endInput.min = minEnd;
  if (endInput.value < minEnd) endInput.value = minEnd;
});
