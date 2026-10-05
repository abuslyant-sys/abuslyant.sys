// ==========================================
// Mr.Valor - Storefront
// ==========================================


// ==========================================
// CART
// ==========================================

const cart = [];

const cartCount =
  document.getElementById("cart-count");

const cartButton =
  document.getElementById("cart-button");


function updateCartCount() {

  if (cartCount) {
    cartCount.textContent = cart.length;
  }

}


function addToCart(name, price = 0) {

  cart.push({
    name: name,
    price: Number(price)
  });

  updateCartCount();

  alert(
    `تمت إضافة "${name}" إلى السلة بنجاح 🛒`
  );

}


// ==========================================
// PRODUCTS
// ==========================================

let allProducts = [];

let currentCategory = "all";

let currentSearch = "";

const productsGrid =
  document.getElementById("products-grid");


// ==========================================
// LOAD PRODUCTS FROM DATABASE
// ==========================================

async function loadProducts() {

  if (!productsGrid) {
    return;
  }


  try {

    const response =
      await fetch("/api/products");


    if (!response.ok) {
      throw new Error(
        "تعذر الاتصال بقاعدة البيانات."
      );
    }


    const result =
      await response.json();


    if (
      !result.success ||
      !Array.isArray(result.products)
    ) {

      throw new Error(
        "بيانات المنتجات غير صحيحة."
      );

    }


    allProducts = result.products;

    renderProducts();


  } catch (error) {

    console.error(error);


    productsGrid.innerHTML = `

      <div class="product-card">

        <div class="product-content">

          <h3>
            تعذر تحميل المنتجات
          </h3>

          <p>
            حدث خطأ أثناء تحميل المنتجات.
            حاول تحديث الصفحة.
          </p>

        </div>

      </div>

    `;

  }

}


// ==========================================
// RENDER PRODUCTS
// ==========================================

function renderProducts() {

  if (!productsGrid) {
    return;
  }


  const filteredProducts =
    allProducts.filter((product) => {

      const matchesCategory =
        currentCategory === "all" ||
        product.category === currentCategory;


      const searchText = `

        ${product.name || ""}
        ${product.description || ""}
        ${product.category || ""}

      `.toLowerCase();


      const matchesSearch =
        !currentSearch ||
        searchText.includes(
          currentSearch.toLowerCase()
        );


      return (
        matchesCategory &&
        matchesSearch
      );

    });


  // لا توجد منتجات

  if (filteredProducts.length === 0) {

    productsGrid.innerHTML = `

      <div class="product-card">

        <div class="product-content">

          <h3>
            لا توجد منتجات حاليًا
          </h3>

          <p>
            سيتم إضافة المنتجات قريبًا.
          </p>

        </div>

      </div>

    `;

    return;

  }


  // إنشاء بطاقات المنتجات

  productsGrid.innerHTML =
    filteredProducts
      .map((product) => {

        const productId =
          Number(product.id);


        const name =
          escapeHTML(
            product.name
          );


        const description =
          escapeHTML(
            product.description
          );


        const category =
          escapeHTML(
            product.category
          );


        const price =
          Number(product.price || 0);


        const imageHTML =
          product.image_url
            ? `
              <img
                src="${escapeAttribute(
                  product.image_url
                )}"
                alt="${name}"
              >
            `
            : `
              <div class="product-placeholder">
                📦
              </div>
            `;


        return `

          <article
            class="product-card"
            data-product
            data-category="${category}"
          >

            <div class="product-image">

              ${imageHTML}

            </div>


            <div class="product-content">

              <span class="product-category">
                ${category}
              </span>


              <h3>
                ${name}
              </h3>


              <p>
                ${description}
              </p>


              <div class="product-bottom">

                <strong class="product-price">
                  $${price.toFixed(2)}
                </strong>


                <div class="product-buttons">

                  <a
                    href="product.html?id=${productId}"
                    class="btn btn-secondary"
                  >
                    التفاصيل
                  </a>


                  <button
                    type="button"
                    class="btn btn-primary"
                    data-add-to-cart
                    data-product-name="${escapeAttribute(
                      product.name
                    )}"
                    data-price="${price}"
                  >
                    أضف للسلة
                  </button>

                </div>

              </div>

            </div>

          </article>

        `;

      })
      .join("");


  // تفعيل أزرار السلة للمنتجات الجديدة

  productsGrid
    .querySelectorAll(
      "[data-add-to-cart]"
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          const name =
            button.dataset.productName ||
            "المنتج";


          const price =
            button.dataset.price || 0;


          addToCart(
            name,
            price
          );

        }
      );

    });

}


// ==========================================
// SAFE HTML
// ==========================================

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function escapeAttribute(value) {

  return escapeHTML(value);

}


// ==========================================
// CART BUTTON
// ==========================================

if (cartButton) {

  cartButton.addEventListener(
    "click",
    () => {

      if (cart.length === 0) {

        alert(
          "السلة فارغة حاليًا 🛒"
        );

        return;

      }


      let message =
        "🛒 المنتجات في السلة:\n\n";


      cart.forEach(
        (product, index) => {

          message +=
            `${index + 1}. ${product.name}`;


          if (product.price) {

            message +=
              ` - $${product.price}`;

          }


          message += "\n";

        }
      );


      message +=
        `\nعدد المنتجات: ${cart.length}`;


      alert(message);

    }
  );

}


// ==========================================
// MOBILE MENU
// ==========================================

const menuButton =
  document.getElementById(
    "menu-button"
  );

const mobileMenu =
  document.getElementById(
    "mobile-menu"
  );


if (
  menuButton &&
  mobileMenu
) {

  menuButton.addEventListener(
    "click",
    () => {

      mobileMenu.classList.toggle(
        "open"
      );

    }
  );

}


// ==========================================
// SEARCH
// ==========================================

const searchToggle =
  document.getElementById(
    "search-toggle"
  );

const searchBox =
  document.getElementById(
    "search-box"
  );

const searchInput =
  document.getElementById(
    "search-input"
  );


if (
  searchToggle &&
  searchBox
) {

  searchToggle.addEventListener(
    "click",
    () => {

      searchBox.classList.toggle(
        "open"
      );


      if (
        searchBox.classList.contains(
          "open"
        ) &&
        searchInput
      ) {

        searchInput.focus();

      }

    }
  );

}


if (searchInput) {

  searchInput.addEventListener(
    "input",
    () => {

      currentSearch =
        searchInput.value
          .trim()
          .toLowerCase();


      renderProducts();

    }
  );

}


// ==========================================
// CATEGORY FILTER
// ==========================================

document
  .querySelectorAll(
    "[data-category-filter]"
  )
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        currentCategory =
          button.dataset.categoryFilter ||
          "all";


        renderProducts();

      }
    );

  });


// ==========================================
// NEWSLETTER
// ==========================================

const newsletterForm =
  document.getElementById(
    "newsletter-form"
  );


if (newsletterForm) {

  newsletterForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      alert(
        "تم الاشتراك بنجاح ❤️"
      );


      newsletterForm.reset();

    }
  );

}


// ==========================================
// OWNER ACCESS
// ==========================================

async function checkOwnerAccess() {

  const ownerAddProduct =
    document.getElementById(
      "owner-add-product"
    );


  if (!ownerAddProduct) {
    return;
  }


  try {

    const response =
      await fetch(
        "/api/auth/me",
        {
          method: "GET",
          credentials: "same-origin"
        }
      );


    if (!response.ok) {
      return;
    }


    const result =
      await response.json();


    if (
      result.authenticated === true
    ) {

      ownerAddProduct.style.display =
        "";

    }

  } catch (error) {

    console.error(
      "تعذر التحقق من صلاحيات المالك.",
      error
    );

  }

}


// ==========================================
// START
// ==========================================

updateCartCount();

loadProducts();

checkOwnerAccess();
