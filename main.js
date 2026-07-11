const fallbackGallery = Array.isArray(window.PORTFOLIO_GALLERY) ? window.PORTFOLIO_GALLERY : [];
const githubRepository = "carolineber/cbsurbanscketch";
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const titleOverrides = new Map([["casa_estreito.jpg", "Casa do Estreito"]]);
const grid = document.querySelector("#gallery-grid");
const artCount = document.querySelector("#art-count");
const heroRail = document.querySelector("#hero-rail");
const featuredImage = document.querySelector("#featured-image");
const featuredTitle = document.querySelector("#featured-title");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const closeButton = document.querySelector("[data-close]");
const previousButton = document.querySelector("[data-previous]");
const nextButton = document.querySelector("[data-next]");
const themeToggle = document.querySelector(".theme-toggle");

let activeIndex = 0;
let gallery = fallbackGallery;

function titleFromFilename(filename) {
  const withoutExtension = filename.replace(/\.[^.]+$/, "");

  return withoutExtension
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\p{L}+/gu, (word) => word.charAt(0).toLocaleUpperCase("pt-BR") + word.slice(1));
}

async function loadGallery() {
  if (!window.fetch) {
    return fallbackGallery;
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${githubRepository}/contents/data`, {
      headers: {
        Accept: "application/vnd.github+json"
      }
    });

    if (!response.ok) {
      return fallbackGallery;
    }

    const files = await response.json();

    if (!Array.isArray(files)) {
      return fallbackGallery;
    }

    const githubGallery = files
      .filter((file) => {
        const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

        return file.type === "file" && imageExtensions.has(extension);
      })
      .map((file) => ({
        title: titleOverrides.get(file.name) || titleFromFilename(file.name),
        src: file.download_url,
        filename: file.name,
        updatedAt: ""
      }))
      .sort((a, b) => a.filename.localeCompare(b.filename, "pt-BR", { sensitivity: "base" }));

    return githubGallery.length ? githubGallery : fallbackGallery;
  } catch (error) {
    return fallbackGallery;
  }
}

function getCurrentTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Alternar para modo claro" : "Alternar para modo escuro"
  );
}

function pluralize(count) {
  return count === 1 ? "1 obra" : `${count} obras`;
}

function renderGallery() {
  artCount.textContent = pluralize(gallery.length);

  if (!gallery.length) {
    grid.innerHTML = `<p class="empty-state">Adicione imagens na pasta data para começar a galeria.</p>`;
    heroRail.textContent = "";
    return;
  }

  const featured =
    gallery.find((artwork) => artwork.filename.toLowerCase() === "casa_estreito.jpg") || gallery[0];

  featuredImage.src = featured.src;
  featuredImage.alt = "Casa do Estreito";
  featuredTitle.textContent = "Casa do Estreito";

  grid.textContent = "";

  gallery.forEach((artwork, index) => {
    const card = document.createElement("button");
    const image = document.createElement("img");
    const title = document.createElement("span");

    card.className = "art-card";
    card.type = "button";
    card.dataset.index = String(index);
    card.setAttribute("aria-label", `Ampliar ${artwork.title}`);

    image.src = artwork.src;
    image.alt = artwork.title;
    image.loading = "lazy";

    title.className = "art-card-title";
    title.textContent = artwork.title;

    card.append(image, title);
    grid.append(card);
  });
}

function renderHeroRail() {
  if (!gallery.length) {
    return;
  }

  const heroItems = Array.from({ length: Math.min(4, Math.max(3, gallery.length)) }, (_, index) => {
    return gallery[index % gallery.length];
  });

  heroRail.textContent = "";

  heroItems.forEach((artwork, index) => {
    const preview = document.createElement("figure");
    const image = document.createElement("img");
    const caption = document.createElement("figcaption");
    const title = document.createElement("span");
    const number = document.createElement("span");

    preview.className = "hero-preview";
    image.src = artwork.src;
    image.alt = artwork.title;
    image.loading = index === 1 ? "eager" : "lazy";
    title.textContent = artwork.title;
    number.textContent = String(index + 1).padStart(2, "0");

    caption.append(title, number);
    preview.append(image, caption);
    heroRail.append(preview);
  });
}

function showArtwork(index) {
  activeIndex = (index + gallery.length) % gallery.length;
  const artwork = gallery[activeIndex];

  lightboxImage.src = artwork.src;
  lightboxImage.alt = artwork.title;
  lightboxTitle.textContent = artwork.title;

  if (!lightbox.open) {
    lightbox.showModal();
  }
}

function closeLightbox() {
  lightbox.close();
}

function showPrevious() {
  showArtwork(activeIndex - 1);
}

function showNext() {
  showArtwork(activeIndex + 1);
}

async function init() {
  gallery = await loadGallery();
  renderGallery();
  renderHeroRail();
  applyTheme(getCurrentTheme());
}

init();

themeToggle.addEventListener("click", () => {
  const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";

  try {
    localStorage.setItem("portfolio-theme", nextTheme);
  } catch (error) {
    // The visual theme can still change even when storage is unavailable.
  }

  applyTheme(nextTheme);
});

grid.addEventListener("click", (event) => {
  const card = event.target.closest(".art-card");

  if (!card) {
    return;
  }

  showArtwork(Number(card.dataset.index));
});

closeButton.addEventListener("click", closeLightbox);
previousButton.addEventListener("click", showPrevious);
nextButton.addEventListener("click", showNext);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.open) {
    return;
  }

  if (event.key === "ArrowLeft") {
    showPrevious();
  }

  if (event.key === "ArrowRight") {
    showNext();
  }
});
