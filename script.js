// ==========================================
// Mr.Valor - Storefront
// ==========================================


// ==========================================
// CART
// ==========================================

let cart = [];

try {
  const savedCart = localStorage.getItem("mrvalor_cart");

  if (savedCart) {
    cart = JSON.parse(savedCart);
  }

  if (!Array.isArray(cart)) {
    cart = [];
  }

} catch (error) {
  console.error("تعذر تحميل السلة.", error);
  cart = [];
}


const cartCount =
  document.getElementById("cart-count");

const cartButton =
  document.getElementById("cart-button");


function saveCart() {

  try {

    localStorage.setItem(
      "mrvalor_cart",
      JSON.stringify(cart)
    );

  } catch (error) {

    console.error(
      "تعذر حفظ السلة.",
      error
    );

  }

}


function updateCartCount() {

  if (cartCount) {

    const totalQuantity =
      cart.reduce(
        (total, product) =>
          total + Number(product.quantity || 1),
        0
      );

    cartCount.textContent =
      totalQuantity;

  }

}


function addToCart(
  name,
  price = 0,
  productId = null
) {

  const existingProduct =
    cart.find(
      product =>
        String(product.id) ===
        String(productId)
    );


  if (existingProduct) {

    existingProduct.quantity =
      Number(existingProduct.quantity || 1) + 1;

  } else {

    cart.push({

      id:
        productId !== null
          ? Number(productId)
          : Date.now(),

      name:
        String(name),

      price:
        Number(price),

      quantity:
        1

    });

  }


  saveCart();

  updateCartCount();


  alert(
    `تمت إضافة "${name}" إلى السلة بنجاح 🛒`
  );

}


// ==========================================
// REMOVE FROM CART
// ==========================================

function removeFromCart(productId) {

  cart =
    cart.filter(
      product =>
        String(product.id) !==
        String(productId)
    );


  saveCart();

  updateCartCount();

  renderCartPage();

}


// ==========================================
// CHANGE QUANTITY
// ==========================================

function changeCartQuantity(
  productId,
  change
) {

  const product =
    cart.find(
      item =>
        String(item.id) ===
        String(productId)
    );


  if (!product) {
    return;
  }


  product.quantity =
    Number(product.quantity || 1) +
    Number(change);


  if (product.quantity <= 0) {

    removeFromCart(productId);

    return;

  }


  saveCart();

  updateCartCount();

  renderCartPage();

}


// ==========================================
// CART TOTAL
// ==========================================

function getCartTotal() {

  return cart.reduce(
    (total, product) => {

      return (
        total +
        Number(product.price || 0) *
        Number(product.quantity || 1)
      );

    },
    0
  );

}


// ==========================================
// PRODUCTS
// ==========================================

let allProducts = [];

let currentCategory = "all";

let currentSearch = "";

const productsGrid =
  document.getElementById(
    "products-grid"
  );


// ==========================================
// LOAD PRODUCTS FROM DATABASE
// ==========================================

async function loadProducts() {

  if (!productsGrid) {
    return;
  }


  try {

    const response =
      await fetch(
        "/api/products"
      );


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


    allProducts =
      result.products;


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
    allProducts.filter(
      (product) => {

        const matchesCategory =
          currentCategory === "all" ||
          product.category ===
            currentCategory;


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

      }
    );


  if (
    filteredProducts.length === 0
  ) {

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


  productsGrid.innerHTML =
    filteredProducts
      .map(
        (product) => {

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
            Number(
              product.price || 0
            );


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
                      data-product-id="${productId}"
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

        }
      )
      .join("");


  productsGrid
    .querySelectorAll(
      "[data-add-to-cart]"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            const name =
              button.dataset.productName ||
              "المنتج";


            const price =
              Number(
                button.dataset.price || 0
              );


            const productId =
              Number(
                button.dataset.productId
              );


            addToCart(
              name,
              price,
              productId
            );

          }
        );

      }
    );

}


// ==========================================
// CART PAGE
// ==========================================

function renderCartPage() {

  const cartContainer =
    document.getElementById(
      "cart-items"
    );


  const cartEmpty =
    document.getElementById(
      "cart-empty"
    );


  const cartSummary =
    document.getElementById(
      "cart-summary"
    );


  const cartTotal =
    document.getElementById(
      "cart-total"
    );


  if (!cartContainer) {
    return;
  }


  if (cart.length === 0) {

    cartContainer.innerHTML =
      "";


    if (cartEmpty) {

      cartEmpty.style.display =
        "";

    }


    if (cartSummary) {

      cartSummary.style.display =
        "none";

    }


    return;

  }


  if (cartEmpty) {

    cartEmpty.style.display =
      "none";

  }


  if (cartSummary) {

    cartSummary.style.display =
      "";

  }


  cartContainer.innerHTML =
    cart
      .map(
        (product) => {

          const quantity =
            Number(
              product.quantity || 1
            );


          const price =
            Number(
              product.price || 0
            );


          const subtotal =
            price * quantity;


          return `

            <article
              class="cart-item"
            >

              <div class="cart-item-info">

                <h3>
                  ${escapeHTML(
                    product.name
                  )}
                </h3>

                <p>
                  $${price.toFixed(2)}
                </p>

              </div>


              <div class="cart-item-actions">

                <button
                  type="button"
                  data-cart-minus
                  data-id="${product.id}"
                >
                  −
                </button>


                <strong>
                  ${quantity}
                </strong>


                <button
                  type="button"
                  data-cart-plus
                  data-id="${product.id}"
                >
                  +
                </button>


                <span class="cart-item-subtotal">
                  $${subtotal.toFixed(2)}
                </span>


                <button
                  type="button"
                  data-cart-remove
                  data-id="${product.id}"
                >
                  حذف
                </button>

              </div>

            </article>

          `;

        }
      )
      .join("");


  if (cartTotal) {

    cartTotal.textContent =
      `$${getCartTotal().toFixed(2)}`;

  }


  cartContainer
    .querySelectorAll(
      "[data-cart-minus]"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            changeCartQuantity(
              button.dataset.id,
              -1
            );

          }
        );

      }
    );


  cartContainer
    .querySelectorAll(
      "[data-cart-plus]"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            changeCartQuantity(
              button.dataset.id,
              1
            );

          }
        );

      }
    );


  cartContainer
    .querySelectorAll(
      "[data-cart-remove]"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            removeFromCart(
              button.dataset.id
            );

          }
        );

      }
    );

}


// ==========================================
// CART BUTTON
// ==========================================

if (cartButton) {

  cartButton.addEventListener(
    "click",
    () => {

      window.location.href =
        "cart.html";

    }
  );

}


// ==========================================
// SAFE HTML
// ==========================================

function escapeHTML(value) {

  return String(value)
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


function escapeAttribute(value) {

  return escapeHTML(value);

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
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          currentCategory =
            button.dataset.categoryFilter ||
            "all";


          renderProducts();

        }
      );

    }
  );


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

renderCartPage();
