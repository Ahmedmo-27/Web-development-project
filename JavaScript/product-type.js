// Carousel Navigation
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const items = document.querySelectorAll(".carousel-item");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const mainImage = document.getElementById("mainImage");

  let currentIndex = 2; // Start with JAMMY GRAPE DREAM active

  // Update active state and main image
  function updateActiveState() {
    items.forEach((item) => item.classList.remove("active"));
    items[currentIndex].classList.add("active");
    mainImage.src = items[currentIndex].querySelector("img").src;
  }

  // Previous button click handler
  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateActiveState();
    items[currentIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  });

  // Next button click handler
  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % items.length;
    updateActiveState();
    items[currentIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  });

  // Carousel item click handlers
  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      currentIndex = index;
      updateActiveState();
    });
  });

  // Gallery Thumbnails
  const thumbnails = document.querySelectorAll(".thumbnail");
  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      thumbnails.forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
      mainImage.src = thumb.src;
    });
  });

  // Image Zoom Effect
  const mainImageContainer = document.querySelector(".main-image");
  const zoomLens = document.querySelector(".zoom-lens");

  mainImageContainer.addEventListener("mousemove", (e) => {
    const bounds = mainImageContainer.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    const xPercent = x / bounds.width;
    const yPercent = y / bounds.height;

    // Show zoom lens
    zoomLens.style.display = "block";
    zoomLens.style.left = `${x - 50}px`;
    zoomLens.style.top = `${y - 50}px`;

    mainImage.style.transformOrigin = `${xPercent * 100}% ${yPercent * 100}%`;
    mainImage.style.transform = "scale(1.5)";
  });

  mainImageContainer.addEventListener("mouseleave", () => {
    zoomLens.style.display = "none";
    mainImage.style.transform = "scale(1)";
  });

  // Wishlist button toggle
  const wishlistBtn = document.querySelector(".wishlist-btn");
  wishlistBtn.addEventListener("click", () => {
    const icon = wishlistBtn.querySelector("i");
    icon.classList.toggle("far");
    icon.classList.toggle("fas");
    icon.style.color = icon.classList.contains("fas") ? "#ff4444" : "#333";
  });

  // Add to Cart animation
  const addToCartBtn = document.querySelector(".add-to-cart");
  addToCartBtn.addEventListener("click", () => {
    addToCartBtn.style.transform = "scale(0.95)";
    setTimeout(() => {
      addToCartBtn.style.transform = "translateY(-2px)";
      // Show success message
      const message = document.createElement("div");
      message.className = "success-message";
      message.textContent = "Added to cart!";
      message.style.cssText = `
       position: fixed;
       top: 20px;
       right: 20px;
       background: #4CAF50;
       color: white;
       padding: 1rem 2rem;
       border-radius: 4px;
       animation: slideIn 0.3s ease-out;
     `;
      document.body.appendChild(message);
      setTimeout(() => message.remove(), 3000);
    }, 100);
  });

  // Add CSS animation for success message
  const style = document.createElement("style");
  style.textContent = `
   @keyframes slideIn {
     from { transform: translateX(100%); opacity: 0; }
     to { transform: translateX(0); opacity: 1; }
   }
 `;
  document.head.appendChild(style);
});
