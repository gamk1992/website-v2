const WA = "601113353551";
const EMAIL = "marketing.montikeopi@gmail.com";
const IG = "https://www.instagram.com/montikeopi/";

const pages = [
  { href: "index.html", id: "home", label: "Home" },
  { href: "menu.html", id: "menu", label: "Menu" },
  { href: "stores.html", id: "stores", label: "Stores" },
  { href: "catering.html", id: "catering", label: "Catering" },
  { href: "licensing.html", id: "licensing", label: "Licensing" },
];

function currentPage() {
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (!file || file === "") return "index.html";
  return file;
}

function headerHTML() {
  const here = currentPage();
  const links = pages
    .filter((p) => p.id !== "home")
    .map((p) => {
      const current = here === p.href ? ' aria-current="page"' : "";
      return `<a href="${p.href}"${current}>${p.label}</a>`;
    })
    .join("");
  return `
    <div class="wrap nav">
      <a class="logo" href="index.html">Monti Keopi</a>
      <nav class="nav-links" aria-label="Primary">${links}</nav>
      <a class="nav-cta" href="https://wa.me/${WA}?text=${encodeURIComponent("Hi Monti Keopi, I want to order.")}">Order on WhatsApp</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-panel" aria-label="Open menu"><span></span></button>
    </div>
    <div class="wrap mobile-panel" id="mobile-panel">${links}
      <a href="https://wa.me/${WA}">Order on WhatsApp</a>
    </div>`;
}

function footerHTML() {
  return `
    <div class="wrap footer-grid">
      <div>
        <a class="logo" href="index.html" style="color:#fff">Monti Keopi</a>
        <p class="muted" style="color:#cbbfae">Everyday coffee with high energy. Campus carts, community kiosks, and catering across Malaysia.</p>
        <p><a href="${IG}" target="_blank" rel="noopener">Instagram @montikeopi</a></p>
      </div>
      <div>
        <h3>Visit</h3>
        <ul>
          <li><a href="stores.html">All stores</a></li>
          <li><a href="menu.html">Menu</a></li>
          <li><a href="catering.html">Events & catering</a></li>
        </ul>
      </div>
      <div>
        <h3>Partner</h3>
        <ul>
          <li><a href="licensing.html">Start an outlet</a></li>
          <li><a href="apply.html">Licensing inquiry</a></li>
          <li><a href="https://wa.me/${WA}">Talk to us</a></li>
        </ul>
      </div>
      <div>
        <h3>Contact</h3>
        <ul>
          <li><a href="https://wa.me/${WA}">+60 11-1335 3551</a></li>
          <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
          <li>Hours vary by outlet<br>Most campus sites: 8:30am–6:00pm</li>
        </ul>
      </div>
    </div>
    <div class="wrap legal">
      <span>© ${new Date().getFullYear()} Monti Keopi. Keopi dulu, as always.</span>
      <span>Keopi dulu, as always.</span>
    </div>`;
}

function mountChrome() {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  if (header) header.innerHTML = headerHTML();
  if (footer) footer.innerHTML = footerHTML();

  const toggle = header?.querySelector(".menu-toggle");
  const panel = document.getElementById("mobile-panel");
  toggle?.addEventListener("click", () => {
    const open = panel.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
}

function bindMenuFilters() {
  const chips = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-category]");
  if (!chips.length) return;
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const val = chip.dataset.filter;
      cards.forEach((card) => {
        card.style.display = val === "all" || card.dataset.category === val ? "" : "none";
      });
    });
  });
}

function bindStoreFilters() {
  const search = document.getElementById("store-search");
  const region = document.getElementById("store-region");
  const cards = document.querySelectorAll("[data-store]");
  if (!cards.length) return;
  const apply = () => {
    const q = (search?.value || "").toLowerCase();
    const r = region?.value || "all";
    cards.forEach((card) => {
      const hay = card.innerText.toLowerCase();
      const matchText = !q || hay.includes(q);
      const matchRegion = r === "all" || card.dataset.region === r;
      card.style.display = matchText && matchRegion ? "" : "none";
    });
  };
  search?.addEventListener("input", apply);
  region?.addEventListener("change", apply);
}

function bindForms() {
  document.querySelectorAll("form[data-intent]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const intent = form.dataset.intent;
      const lines = Object.entries(data)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
      const msg =
        intent === "catering"
          ? `Hi Monti Keopi, I would like a catering quote.\n\n${lines}`
          : `Hi Monti Keopi, I am interested in a licensing kit.\n\n${lines}`;
      const box = form.parentElement.querySelector(".success");
      if (box) {
        box.classList.add("show");
        box.innerHTML = `<strong>Request captured.</strong> We also opened WhatsApp so the team can reply faster. If it did not open, message <a href="https://wa.me/${WA}">+60 11-1335 3551</a> or email ${EMAIL}.`;
      }
      form.reset();
      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  mountChrome();
  bindMenuFilters();
  bindStoreFilters();
  bindForms();
});
