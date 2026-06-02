import { apiFetch, escapeHtml } from "./config.js";

const FALLBACK_TEAM = [
  {
    id: "a",
    name: "Alex Rivera",
    role: "CEO & Founder",
    bio: "Leads brand strategy and client partnerships across Intasia.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    initial: "A",
    color: "#fef08a",
  },
  {
    id: "b",
    name: "Priya Sharma",
    role: "Creative Director",
    bio: "Shapes visual identity, campaigns, and design systems for every client.",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    initial: "B",
    color: "#bae6fd",
  },
  {
    id: "c",
    name: "James Okonkwo",
    role: "Head of Development",
    bio: "Builds fast, accessible websites and apps with modern stacks.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    initial: "C",
    color: "#fbcfe8",
  },
  {
    id: "d",
    name: "Sofia Mendez",
    role: "Growth Lead",
    bio: "Runs SEO, paid media, and analytics to scale measurable results.",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    initial: "D",
    color: "var(--ib-lime)",
  },
];

function renderTeamModal() {
  if (document.getElementById("team-modal")) return;
  const modal = document.createElement("div");
  modal.id = "team-modal";
  modal.className = "ib-modal";
  modal.innerHTML = `
    <div class="ib-modal-panel ib-modal-panel--wide">
      <button type="button" id="team-modal-close" class="ib-modal-close" aria-label="Close">✕</button>
      <div id="team-modal-body"></div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeTeamModal();
  });
  document.getElementById("team-modal-close")?.addEventListener("click", closeTeamModal);
}

function openTeamModal(member) {
  const modal = document.getElementById("team-modal");
  const body = document.getElementById("team-modal-body");
  if (!modal || !body) return;
  const img = member.imageUrl
    ? `<img class="ib-modal-hero-img" src="${escapeHtml(member.imageUrl)}" alt="${escapeHtml(member.name)}" loading="lazy" />`
    : "";
  body.innerHTML = `
    ${img}
    <h3 class="ib-display text-2xl pr-8">${escapeHtml(member.name)}</h3>
    <p class="mt-1 text-sm font-bold text-[var(--ib-forest)]">${escapeHtml(member.role)}</p>
    <p class="mt-4 text-[var(--ib-gray)] leading-relaxed">${escapeHtml(member.bio || "")}</p>
    ${
      member.linkedin
        ? `<a href="${escapeHtml(member.linkedin)}" class="ib-btn ib-btn--outline mt-6 inline-flex" target="_blank" rel="noopener noreferrer">LinkedIn</a>`
        : ""
    }
  `;
  modal.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeTeamModal() {
  const modal = document.getElementById("team-modal");
  if (!modal) return;
  modal.classList.remove("is-open");
  document.body.style.overflow = "";
}

function memberInitial(member, index) {
  if (member.initial) return member.initial;
  return member.name?.charAt(0)?.toUpperCase() || String.fromCharCode(65 + index);
}

function memberColor(member, index) {
  const colors = ["#fef08a", "#bae6fd", "#fbcfe8", "var(--ib-lime)"];
  return member.color || colors[index % colors.length];
}

function renderTeamGrid(container, team) {
  container.innerHTML = team
    .map((member, i) => {
      const initial = memberInitial(member, i);
      const color = memberColor(member, i);
      const photo = member.imageUrl
        ? `<img src="${escapeHtml(member.imageUrl)}" alt="" class="ib-avatar-img" loading="lazy" />`
        : `<span class="ib-avatar-letter">${escapeHtml(initial)}</span>`;
      return `
        <button type="button" class="ib-avatar ib-avatar--btn" style="background:${color}"
          data-team-index="${i}" aria-label="View ${escapeHtml(member.name)}">
          ${photo}
        </button>
      `;
    })
    .join("");

  container.querySelectorAll("[data-team-index]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.teamIndex);
      const member = team[idx];
      if (member) openTeamModal(member);
    });
  });
}

function bindEscape() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeTeamModal();
  });
}

async function initAboutPage() {
  const grid = document.getElementById("team-grid");
  if (!grid) return;

  renderTeamModal();
  bindEscape();

  let team = FALLBACK_TEAM;
  try {
    const data = await apiFetch("/api/public/team");
    if (data.team?.length) {
      team = data.team.map((m, i) => ({
        ...m,
        initial: m.name?.charAt(0)?.toUpperCase() || FALLBACK_TEAM[i]?.initial,
        color: FALLBACK_TEAM[i]?.color,
      }));
    }
  } catch {
    /* use fallback */
  }

  renderTeamGrid(grid, team);
}

initAboutPage();
