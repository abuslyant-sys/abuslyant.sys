// Mr.Valor - Storefront

const cart = [];

const cartCount = document.getElementById("cart-count");
const cartButton = document.getElementById("cart-button");

const menuButton = document.getElementById("menu-button");
const mobileMenu = document.getElementById("mobile-menu");

const searchToggle = document.getElementById("search-toggle");
const searchBox = document.getElementById("search-box");
const searchInput = document.getElementById("search-input");

const newsletterForm = document.getElementById("newsletter-form");


// =========================
// تحديث عدد المنتجات في السلة
// =========================

function updateCartCount() {
  if (cartCount) {
    cartCount.textContent = cart.length;
  }
}


// =========================
// إضافة منتج للسلة
// =========================

function addToCart(name, price = 0) {
  cart.push({
    name: name,
    price: price
  });

  updateCartCount();

  alert(`تمت إضافة "${name}" إلى السلة بنجاح 🛒`);
}


// =========================
// أزرار إضافة للسلة
// =========================

document.querySelectorAll("[data-add-to-cart]").forEach((button) => {

  button.addEventListener("click", (event) => {

    event.preventDefault();

    const productName =
      button.dataset.addToCart || "المنتج";

    const productPrice =
      button.dataset.price || 0;

    addToCart(productName, productPrice);

  });

});


// =========================
// زر السلة
// =========================

if (cartButton) {

  cartButton.addEventListener("click", () => {

    if (cart.length === 0) {

      alert("السلة فارغة حاليًا 🛒");

      return;
    }

    let message = "🛒 المنتجات في السلة:\n\n";

    cart.forEach((product, index) => {

      message += `${index + 1}. ${product.name}`;

      if (product.price) {
        message += ` - $${product.price}`;
      }

      message += "\n";
    });

    message += `\nعدد المنتجات: ${cart.length}`;

    alert(message);

  });

}


// =========================
// القائمة في الهاتف
// =========================

if (menuButton && mobileMenu) {

  menuButton.addEventListener("click", () => {

    mobileMenu.classList.toggle("open");

  });

}


// =========================
// البحث
// =========================

if (searchToggle && searchBox) {

  searchToggle.addEventListener("click", () => {

    searchBox.classList.toggle("open");

    if (
      searchBox.classList.contains("open") &&
      searchInput
    ) {
      searchInput.focus();
    }

  });

}


if (searchInput) {

  searchInput.addEventListener("input", () => {

    const query =
      searchInput.value.trim().toLowerCase();

    document.querySelectorAll("[data-product]").forEach((product) => {

      const text =
        product.textContent.toLowerCase();

      product.style.display =
        !query || text.includes(query)
          ? ""
          : "none";

    });

  });

}


// =========================
// فلترة التصنيفات
// =========================

document.querySelectorAll("[data-category-filter]").forEach((button) => {

  button.addEventListener("click", () => {

    const category =
      button.dataset.categoryFilter;

    document.querySelectorAll("[data-product]").forEach((product) => {

      product.style.display =
        category === "all" ||
        product.dataset.category === category
          ? ""
          : "none";

    });

  });

});


// =========================
// النشرة البريدية
// =========================

if (newsletterForm) {

  newsletterForm.addEventListener("submit", (event) => {

    event.preventDefault();

    alert("تم الاشتراك بنجاح ❤️");

    newsletterForm.reset();

  });

}


// =========================
// تشغيل عداد السلة
// =========================

updateCartCount();
