const form = document.getElementById("add-product-form");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');

    const product = {
      name: document.getElementById("product-name").value.trim(),
      description: document.getElementById("product-description").value.trim(),
      price: Number(document.getElementById("product-price").value),
      category: document.getElementById("product-category").value,
      product_url: document.getElementById("product-url").value.trim(),
      image_url: ""
    };

    if (
      !product.name ||
      !product.description ||
      !product.category ||
      !product.product_url ||
      !Number.isFinite(product.price)
    ) {
      alert("يرجى تعبئة جميع البيانات المطلوبة.");
      return;
    }

    try {
      submitButton.disabled = true;
      submitButton.textContent = "جاري إضافة المنتج...";

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "تعذر إضافة المنتج.");
      }

      alert("تمت إضافة المنتج بنجاح ✅");

      form.reset();

    } catch (error) {
      console.error(error);
      alert(error.message || "حدث خطأ أثناء إضافة المنتج.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "إضافة المنتج";
    }
  });
        }
