// GAME CATALOG: Add or edit entries here. Required: id, url, n, category.
// Optional: d (description), e (emoji fallback), icon (image path), iconPosition (image crop position), c (gradient colors), img (poster), video (asset path).
// Put image/video files in assets/ and use paths like "assets/joystick.png" or "assets/playaby.mp4".
const games = [
  {
    id: 1,
    url: "https://playvalorant.com/en-ph/",
    n: "Valorant",
    category: "FPS",
    icon: "assets/valorant.png",
    img: "assets/valorant.png",
    video: "assets/valovid.mp4"
  },
  {
    id: 2,
    url: "https://www.roblox.com/games/126884695634066/Grow-a-Garden",
    n: "Grow a Garden",
    category: "Farming",
    c: "#000000,#000000",
    icon: "assets/Grow.png",
    img: "assets/GAG.png",
    video: "assets/GAGvid.mp4"
  },
  {
    id: 3,
    url: "https://www.roblox.com/games/116497287371701/Karinderya",
    n: "Karinderya",
    category: "Couzy",
    c: "#000000,#000000",
    icon: "assets/Karindirya.png",
    iconPosition: "left center",
    img: "assets/Karindirya.png",
    video: "assets/Karindiryavid.mp4"
  },
  {
    id: 4,
    url: "https://cssgridgarden.com/",
    n: "Grid Garden",
    category: "Coding",
    c: "#7ed957,#2e8b27",
    icon: "assets/Grid.png",
    img: "assets/Grid.png",
    video: "assets/GridGarden.mp4"
  },
  {
    id: 5,
    url: "https://www.leagueoflegends.com/en-ph/",
    n: "League of Legends",
    category: "MOBA",
    c: "#000000,#000000",
    icon: "assets/lol.jpg",
    img: "assets/lol.jpg",
    video: "assets/lolvid.mp4"
  },
  {
    id: 6,
    url: "https://gamejadoo.com/",
    n: "GameJadoo",
    category: "Arcade",
    c: "#000000,#000000",
    icon: "assets/GameJadoo.png",
    img: "assets/GameJadoo.png",
    video: "assets/GameJadoovid.mp4"
  },
  {
    id: 7,
    url: "https://gaminto.com/",
    n: "Gaminto",
    category: "Mixed",
    icon: "assets/lol.jpg",
    img: "assets/lol.jpg",
    video: ""
  },
  {
    id: 8,
    url: "https://kiwigames.io/",
    n: "Kiwi Games",
    category: "Mixed",
    icon: "assets/lol.jpg",
    img: "assets/lol.jpg",
    video: ""
  }
];
const ICONS = {
  Arcade: "🕹️",
  Puzzle: "🧩",
  Action: "⚡",
  Mixed: "🎮"
};
// Default red gradient used by games without a custom c value.
const COLORS = [
  "#ff4655,#b3132b"
];
const G = games.map((g, i) => ({
  ...g,
  t: g.category || g.t || "Games",
  e: g.e || ICONS[g.category] || "🎮",
  c: g.c || COLORS[i % COLORS.length],
  d: g.d || `Play ${g.n} in your browser.`
}));
const $ = s => document.querySelector(s);
const store = {
  get(k, d) {
    try {
      const v = localStorage.getItem(k);
      return v === null ? d : JSON.parse(v);
    } catch (e) {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  }
};
let favs = store.get("favs", []);
let q = "";

function toast(m) {
  const t = $("#toast");
  t.textContent = m;
  t.classList.add("on");
  clearTimeout(toast.h);
  toast.h = setTimeout(() => t.classList.remove("on"), 1800);
}

function card(g) {
  const on = favs.includes(g.id);

  return `<article class="card" style="background:linear-gradient(160deg,${g.c})" tabindex="0" data-open="${g.id}">
    <div class="em" aria-hidden="true">${g.icon
      ? `<img src="${g.icon}" alt="" loading="lazy" style="object-position:${g.iconPosition || "center"}">`
      : g.e}</div>
    <div class="cap">
      <h3>${g.n}</h3>
      <span>${g.t}</span>
      <div class="acts">
        <button class="mini" data-play="${g.id}" aria-label="Play ${g.n}">▶</button>
        <button class="mini" data-fav="${g.id}" aria-pressed="${on}" aria-label="${on ? "Remove from" : "Add to"} favorites">${on ? "♥" : "♡"}</button>
      </div>
    </div>
  </article>`;
}

function row(title, list, id) {
  const cards = list.length
    ? `<div class="rowwrap">
        <button class="arrow l" data-scroll="-1" aria-label="Scroll left">‹</button>
        <div class="track">${list.map(card).join("")}</div>
        <button class="arrow r" data-scroll="1" aria-label="Scroll right">›</button>
      </div>`
    : '<p class="empty glass">Nothing here yet. Tap the heart on a game to add it.</p>';

  return `<section class="row"><h2>${title}</h2>${cards}</section>`;
}

function render() {
  const matchesQuery = g => (g.n + g.t + g.d).toLowerCase().includes(q);
  const all = G.filter(matchesQuery);
  let html = "";

  if (q) {
    html += row(`Results for “${q}”`, all);
  } else {
    html += row("Trending now", G.slice(0, 6));
    [...new Set(G.map(g => g.t))].forEach(category => {
      html += row(category, G.filter(g => g.t === category));
    });
  }

  $("#games").innerHTML = html;
  $("#favorites").innerHTML = row("Favorite", G.filter(g => favs.includes(g.id)));
}

// FEATURED CAROUSEL: Change 5 to show more or fewer games from the catalog.
const FEAT = G.slice(0, 5);
let hi = 0;
const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

$("#stage").innerHTML = FEAT.map((g, i) => `
  <button class="cf" data-cf="${i}" style="background:linear-gradient(160deg,${g.c})" aria-label="${g.n}">
    ${g.icon
      ? `<img class="cf-icon" src="${g.icon}" alt="" style="object-position:${g.iconPosition || "center"}">`
      : `<span aria-hidden="true">${g.e}</span>`}
  </button>
`).join("");

function layout() {
  const n = FEAT.length;
  const step = Math.min(58, Math.max(36, $("#stage").clientWidth / 4.4));

  document.querySelectorAll(".cf").forEach((c, i) => {
    const off = ((i - hi + n + 2) % n) - 2;
    const distance = Math.abs(off);

    c.style.transform = `translate(-50%,-50%) translateX(${off * step}px) scale(${distance === 0 ? 1.15 : distance === 1 ? 0.9 : 0.72})`;
    c.style.zIndex = 10 - distance;
    c.style.opacity = distance === 2 ? 0.45 : 1;
    c.style.filter = distance === 0 ? "none" : "brightness(.7)";
    c.setAttribute("aria-current", distance === 0);
  });
}

function show(i, instant) {
  hi = (i + FEAT.length) % FEAT.length;
  const g = FEAT[hi];
  const video = $("#heroVideo");
  const set = () => {
    $("#heroName").textContent = g.n;
    $("#heroDesc").textContent = g.d;
    $("#heroType").textContent = g.t;
    const squareIcon = $("#sqIcon");
    const squareEmoji = $("#sqEmoji");
    squareIcon.hidden = !g.icon;
    squareEmoji.hidden = Boolean(g.icon);
    squareIcon.style.objectPosition = g.iconPosition || "center";
    if (g.icon) {
      squareIcon.src = g.icon;
      squareIcon.alt = "";
    } else {
      squareIcon.removeAttribute("src");
      squareEmoji.textContent = g.e;
    }
    $("#sq").style.background = `linear-gradient(160deg,${g.c})`;
    $("#tint").style.background = `linear-gradient(160deg,${g.c})`;
    $(".panel").classList.remove("swap");
  };

  // The selected game's optional video path controls the hero background video.
  if (g.video) {
    if (video.dataset.currentSrc !== g.video) {
      video.dataset.currentSrc = g.video;
      video.src = g.video;
      video.poster = g.img || "";
      video.hidden = false;
      video.load();
    }
  } else {
    video.pause();
    video.removeAttribute("src");
    video.removeAttribute("poster");
    delete video.dataset.currentSrc;
    video.load();
    video.hidden = true;
  }

  layout();

  if (instant || reduce) {
    set();
    return;
  }

  $(".panel").classList.add("swap");
  setTimeout(set, 300);
}

$("#cfPrev").onclick = () => show(hi - 1);
$("#cfNext").onclick = () => show(hi + 1);
$("#stage").addEventListener("click", e => {
  const c = e.target.closest("[data-cf]");
  if (!c) return;

  const i = +c.dataset.cf;
  i === hi ? info(FEAT[hi]) : show(i);
});
$("#sq").onclick = () => info(FEAT[hi]);
show(0, true);

const hdr = document.querySelector("header");

function sizeHeader() {
  document.documentElement.style.setProperty("--hh", `${hdr.offsetHeight}px`);
  layout();
}

if ("ResizeObserver" in window) {
  new ResizeObserver(sizeHeader).observe(hdr);
}
addEventListener("resize", sizeHeader);
addEventListener("orientationchange", sizeHeader);

let sx = null;
const stg = $("#stage");
stg.addEventListener("touchstart", e => {
  sx = e.touches[0].clientX;
}, { passive: true });
stg.addEventListener("touchend", e => {
  if (sx === null) return;

  const dx = e.changedTouches[0].clientX - sx;
  if (Math.abs(dx) > 40) show(hi + (dx < 0 ? 1 : -1));
  sx = null;
});
sizeHeader();

let cur = null;

function playGame(g) {
  if (!g.url) {
    toast(g.n + " has no link yet");
    return;
  }

  let u;
  try {
    u = new URL(g.url);
  } catch (e) {
    toast("The link for " + g.n + " is not valid");
    return;
  }

  if (u.protocol !== "https:" && u.protocol !== "http:") {
    toast("The link for " + g.n + " is not valid");
    return;
  }

  window.open(u.href, "_blank", "noopener");
}

function info(g) {
  cur = g;
  $("#iName").textContent = g.e + " " + g.n;
  $("#iDesc").textContent = g.t + " · " + g.d;
  $("#info").showModal();
}

document.addEventListener("click", e => {
  const sc = e.target.closest("[data-scroll]");
  if (sc) {
    const track = sc.parentElement.querySelector(".track");
    track.scrollBy({
      left: +sc.dataset.scroll * track.clientWidth * 0.8,
      behavior: "smooth"
    });
    return;
  }

  const f = e.target.closest("[data-fav]");
  const p = e.target.closest("[data-play]");
  const o = e.target.closest("[data-open]");

  if (f) {
    const id = +f.dataset.fav;
    const g = G.find(x => x.id === id);

    if (favs.includes(id)) {
      favs = favs.filter(x => x !== id);
      toast("Removed " + g.n);
    } else {
      favs.push(id);
      toast("Added " + g.n + " to Favorite");
    }

    store.set("favs", favs);
    render();
    return;
  }

  if (p) {
    playGame(G.find(x => x.id === +p.dataset.play));
    return;
  }

  if (o) info(G.find(x => x.id === +o.dataset.open));
});

$("#heroPlay").onclick = () => playGame(FEAT[hi]);
$("#heroInfo").onclick = () => info(FEAT[hi]);
$("#iPlay").onclick = () => {
  if (cur) playGame(cur);
};
$("#iClose").onclick = () => $("#info").close();
$("#q").addEventListener("input", e => {
  q = e.target.value.trim().toLowerCase();
  render();
  if (q) location.hash = "#games";
});
$("#openSettings").onclick = () => $("#settings").showModal();
$("#closeSettings").onclick = () => $("#settings").close();

const th = store.get("theme", null);
if (th) {
  document.documentElement.setAttribute("data-theme", th);
  $("#theme").value = th;
}
$("#theme").onchange = e => {
  document.documentElement.setAttribute("data-theme", e.target.value);
  store.set("theme", e.target.value);
};
render();
