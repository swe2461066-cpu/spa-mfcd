import { getImagesByFoodCode } from "../services/imageService.js";

/* Дээжийн зураг харах modal:
   • ← → товчоор зураг солих   • mouse wheel → zoom in/out
   • drag хийж зургийг зөөх    • ESC → хаах   • ⛶ → fullscreen */
let slideshowImages = [];
let currentIndex = 0;
let imageModalEventsBound = false;

let zoomLevel = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;

export function renderImageModal() {
  return `
    <div id="imageModal" class="modal">
      <div class="modal-background" id="modalBg"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title has-text-centered" id="modalImgTitle"></p>
          <span class="tag is-light mr-2" id="modalImgCounter"></span>
          <button class="button is-small mr-2" id="fullscreenBtn" type="button">⛶</button>
          <button class="delete" aria-label="close" id="closeImgModalBtn" type="button"></button>
        </header>
        <section class="modal-card-body has-text-centered">
          <img id="slideshowImage" class="modal-slideshow-image zoomable-image" draggable="false" src="" alt=""/>
          <div class="buttons is-centered mt-3">
            <button class="button is-small is-primary" id="prevImageBtn" type="button">←</button>
            <button class="button is-small is-primary" id="nextImageBtn" type="button">→</button>
          </div>
        </section>
      </div>
    </div>
  `;
}

export function bindImageModalEvents() {
  if (imageModalEventsBound) return;
  imageModalEventsBound = true;

  document.addEventListener("click", (event) => {
    const openBtn = event.target.closest(".open-image-btn");
    if (openBtn) {
      showImages(openBtn.dataset.foodcode, openBtn.dataset.foodname);
      return;
    }
    if (event.target.closest("#closeImgModalBtn") || event.target.closest("#modalBg")) {
      closeImgModal();
      return;
    }
    if (event.target.closest("#prevImageBtn")) {
      prevImage();
      return;
    }
    if (event.target.closest("#nextImageBtn")) {
      nextImage();
      return;
    }
    if (event.target.closest("#fullscreenBtn")) {
      toggleFullscreen();
    }
  });

  // Zoom хийсэн зургийг чирж зөөх
  document.addEventListener("mousedown", (event) => {
    const imageEl = event.target.closest("#slideshowImage");
    if (!imageEl || zoomLevel <= 1) return;
    event.preventDefault();
    isDragging = true;
    startX = event.clientX - translateX;
    startY = event.clientY - translateY;
    imageEl.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (event) => {
    if (!isDragging) return;
    event.preventDefault();
    const imageEl = document.getElementById("slideshowImage");
    if (!imageEl) return;
    translateX = event.clientX - startX;
    translateY = event.clientY - startY;
    applyTransform(imageEl);
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    const imageEl = document.getElementById("slideshowImage");
    if (imageEl) imageEl.style.cursor = zoomLevel > 1 ? "grab" : "zoom-in";
  });

  // Mouse wheel → zoom (1x – 4x)
  document.addEventListener(
    "wheel",
    (event) => {
      const imageEl = event.target.closest("#slideshowImage");
      if (!imageEl) return;
      event.preventDefault();
      zoomLevel += event.deltaY < 0 ? 0.15 : -0.15;
      zoomLevel = Math.min(Math.max(zoomLevel, 1), 4);
      applyTransform(imageEl);
      imageEl.style.cursor = zoomLevel > 1 ? "zoom-out" : "zoom-in";
    },
    { passive: false },
  );

  // Modal нээлттэй үед: ESC хаана, ← → зураг солино (миний нэмэлт)
  document.addEventListener("keydown", (event) => {
    const modalEl = document.getElementById("imageModal");
    if (!modalEl?.classList.contains("is-active")) return;
    if (event.key === "Escape") closeImgModal();
    if (event.key === "ArrowRight") nextImage();
    if (event.key === "ArrowLeft") prevImage();
  });
}

function showImages(foodCode, foodName) {
  slideshowImages = getImagesByFoodCode(foodCode);
  if (!slideshowImages.length) {
    alert("No images found for " + foodName);
    return;
  }
  currentIndex = 0;

  const titleEl = document.getElementById("modalImgTitle");
  const modalEl = document.getElementById("imageModal");
  if (!titleEl || !modalEl) return;

  titleEl.textContent = foodName;
  showCurrentImage(foodName);
  modalEl.classList.add("is-active");
}

function showCurrentImage(alt) {
  const imageEl = document.getElementById("slideshowImage");
  const counterEl = document.getElementById("modalImgCounter");
  if (!imageEl) return;
  imageEl.src = slideshowImages[currentIndex];
  if (alt) imageEl.alt = alt;
  if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${slideshowImages.length}`;
  resetImageZoom(imageEl);
}

function nextImage() {
  if (!slideshowImages.length) return;
  currentIndex = (currentIndex + 1) % slideshowImages.length;
  showCurrentImage();
}

function prevImage() {
  if (!slideshowImages.length) return;
  currentIndex = (currentIndex - 1 + slideshowImages.length) % slideshowImages.length;
  showCurrentImage();
}

function closeImgModal() {
  document.getElementById("imageModal")?.classList.remove("is-active");
}

function applyTransform(imageEl) {
  imageEl.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`;
}

function resetImageZoom(imageEl) {
  zoomLevel = 1;
  translateX = 0;
  translateY = 0;
  applyTransform(imageEl);
  imageEl.style.cursor = "zoom-in";
}

async function toggleFullscreen() {
  const imageEl = document.getElementById("slideshowImage");
  if (!imageEl) return;
  try {
    if (!document.fullscreenElement) {
      await imageEl.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (error) {
    console.error("Fullscreen error:", error);
  }
}
