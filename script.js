// Mr.Valor - Storefront interactions

const cart = [];
const cartCount = document.getElementById("cart-count");
const cartButton = document.getElementById("cart-button");
const menuButton = document.getElementById("menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const searchToggle = document.getElementById("search-toggle");
const searchBox = document.getElementById("search-box");
const searchInput = document.getElementById("search-input");
const newsletterForm = document.getElementById("newsletter-form");

function updateCartCount() {
  if (cartCount) {
    cartCount.textContent = cart.length;
  }
}

function addToCart(name) {
  cart.push(name);
  updateCartCount();
  alert(`تمت إضافة "${name}" إلى السلة.`);
}

document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
  button.addEventListener("click", () => {
    addToCart(button.dataset.addToCart);
  });
});

if (cartButton) {
  cartButton.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("السلة فارغة حاليًا.");
    } else {
      alert(`لديك ${cart.length} منتج في السلة.`);
    }
  });
}

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
  });
}

if (searchToggle && searchBox) {
  searchToggle.addEventListener("click", () => {
    searchBox.classList.toggle("open");

    if (searchBox.classList.contains("open") && searchInput) {
      searchInput.focus();
    }
  });
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    document.querySelectorAll("[data-product]").forEach((product) => {
      const text = product.textContent.toLowerCase();

      product.style.display =
        !query || text.includes(query) ? "" : "none";
    });
  });
}

document.querySelectorAll("[data-category-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.categoryFilter;

    document.querySelectorAll("[data-product]").forEach((product) => {
      product.style.display =
        category === "all" || product.dataset.category === category
          ? ""
          : "none";
    });
  });
});

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    alert("تم الاشتراك بنجاح. شكرًا لك!");

    newsletterForm.reset();
  });
}

updateCartCount();
