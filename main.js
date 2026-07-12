const driveGallery = window.DRIVE_GALLERY || { collections: { trabalhos: [], fastSketch: [] } };
const works = driveGallery.collections.trabalhos || [];
const fastSketches = driveGallery.collections.fastSketch || [];
const heroItems = [...works, ...fastSketches].slice(0, 4);
const worksGrid = document.querySelector("#works-grid");
const fastGrid = document.querySelector("#fast-grid");
const worksCount = document.querySelector("#works-count");
const fastCount = document.querySelector("#fast-count");
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

let activeCollection = works;
let activeIndex = 0;

function imageUrl(artwork, size = 1400) {
  if (artwork.src) {
    return artwork.src;
  }

  return `https://drive.google.com/thumbnail?id=${artwork.id}&sz=w${size}`;
}

function pluralize(count, singular, plural) {
  return count === 1 ? `1 ${singular}` : `${count} ${plural}`;
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

function createArtworkButton(artwork, index, className, collectionName) {
  const card = document.createElement("button");
  const image = document.createElement("img");
  const title = document.createElement("span");

  card.className = className;
  card.type = "button";
  card.dataset.index = String(index);
  card.dataset.collection = collectionName;
  card.setAttribute("aria-label", `Ampliar ${artwork.title}`);

  image.src = imageUrl(artwork, className === "fast-card" ? 900 : 1400);
  image.alt = artwork.title;
  image.loading = index < 4 ? "eager" : "lazy";

  title.className = className === "fast-card" ? "fast-card-title" : "art-card-title";
  title.textContent = artwork.title;

  card.append(image, title);
  return card;
}

function renderCollection(grid, artworks, cardClassName, collectionName) {
  grid.textContent = "";

  if (!artworks.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Adicione imagens na pasta do Drive para preencher esta seção.";
    grid.append(empty);
    return;
  }

  artworks.forEach((artwork, index) => {
    grid.append(createArtworkButton(artwork, index, cardClassName, collectionName));
  });
}

function renderHeroRail() {
  const previewItems = heroItems.length ? heroItems : works;

  heroRail.textContent = "";

  previewItems.forEach((artwork, index) => {
    const preview = document.createElement("figure");
    const image = document.createElement("img");
    const caption = document.createElement("figcaption");
    const title = document.createElement("span");
    const number = document.createElement("span");

    preview.className = "hero-preview";
    image.src = imageUrl(artwork, 1200);
    image.alt = artwork.title;
    image.loading = index === 1 ? "eager" : "lazy";
    title.textContent = artwork.title;
    number.textContent = String(index + 1).padStart(2, "0");

    caption.append(title, number);
    preview.append(image, caption);
    heroRail.append(preview);
  });
}

function renderFeatured() {
  const featured =
    works.find((artwork) => artwork.id === driveGallery.featuredId) ||
    works.find((artwork) => artwork.filename === "casa_estreito.jpg") ||
    works[0] ||
    fastSketches[0];

  if (!featured) {
    return;
  }

  featuredImage.src = imageUrl(featured, 1400);
  featuredImage.alt = "Casa do Estreito";
  featuredTitle.textContent = "Casa do Estreito";
}

function renderGallery() {
  worksCount.textContent = pluralize(works.length, "trabalho", "trabalhos");
  fastCount.textContent = pluralize(fastSketches.length, "fast sketch", "fast sketches");
  renderCollection(worksGrid, works, "art-card", "works");
  renderCollection(fastGrid, fastSketches, "fast-card", "fast");
  renderHeroRail();
  renderFeatured();
}

function showArtwork(collectionName, index) {
  activeCollection = collectionName === "fast" ? fastSketches : works;

  if (!activeCollection.length) {
    return;
  }

  activeIndex = (index + activeCollection.length) % activeCollection.length;
  const artwork = activeCollection[activeIndex];

  lightboxImage.src = imageUrl(artwork, 2200);
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
  showArtwork(activeCollection === fastSketches ? "fast" : "works", activeIndex - 1);
}

function showNext() {
  showArtwork(activeCollection === fastSketches ? "fast" : "works", activeIndex + 1);
}

function handleGridClick(event) {
  const card = event.target.closest("[data-collection]");

  if (!card) {
    return;
  }

  showArtwork(card.dataset.collection, Number(card.dataset.index));
}

renderGallery();
applyTheme(getCurrentTheme());

themeToggle.addEventListener("click", () => {
  const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";

  try {
    localStorage.setItem("portfolio-theme", nextTheme);
  } catch (error) {
    // The visual theme can still change even when storage is unavailable.
  }

  applyTheme(nextTheme);
});

worksGrid.addEventListener("click", handleGridClick);
fastGrid.addEventListener("click", handleGridClick);
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
