document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("add-product-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const submitButton = form.querySelector(
      'button[type="submit"]'
    );

    const name = document
      .getElementById("product-name")
      .value
      .trim();

    const description = document
      .getElementById("product-description")
      .value
      .trim();

    const price = Number(
      document.getElementById("product-price").value
    );

    const category = document
      .getElementById("product-category")
      .value
      .trim();

    const productUrl = document
      .getElementById("product-url")
      .value
      .trim();

    const imageInput =
      document.getElementById("product-image");

    /*
      في الوقت الحالي الصورة يتم اختيارها من الجهاز
      لكننا لا نرفعها إلى Cloudflare بعد.
      لذلك نرسل رابط الصورة فارغًا.
    */

    let imageUrl = "";

    /*
      إذا كانت هناك صورة وتم اختيارها،
      نحاول استخدامها كمعاينة محلية فقط.
      لن يتم حفظها كرابط دائم في قاعدة البيانات.
    */

    if (
      imageInput &&
      imageInput.files &&
      imageInput.files.length > 0
    ) {
      const file = imageInput.files[0];

      if (file) {
        imageUrl = "";
      }
    }


    // التحقق من البيانات

    if (!name) {
      alert("يرجى كتابة اسم المنتج.");
      return;
    }

    if (!description) {
      alert("يرجى كتابة وصف المنتج.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      alert("يرجى إدخال سعر صحيح.");
      return;
    }

    if (!category) {
      alert("يرجى اختيار تصنيف المنتج.");
      return;
    }

    if (!productUrl) {
      alert("يرجى إدخال رابط المنتج.");
      return;
    }


    // تعطيل الزر أثناء الحفظ

    submitButton.disabled = true;
    submitButton.textContent = "جاري إضافة المنتج...";


    try {

      const response = await fetch(
        "/api/products",
        {
          method: "POST",

          credentials: "same-origin",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name: name,
            description: description,
            price: price,
            category: category,
            product_url: productUrl,
            image_url: imageUrl
          })
        }
      );


      const data = await response.json();


      if (!response.ok || !data.success) {

        throw new Error(
          data.message ||
          "تعذر إضافة المنتج."
        );

      }


      alert("تمت إضافة المنتج بنجاح ✅");


      // إعادة ضبط النموذج

      form.reset();


      // الانتقال إلى الصفحة الرئيسية

      window.location.href = "index.html";


    } catch (error) {

      console.error(
        "Add product error:",
        error
      );

      alert(
        error.message ||
        "حدث خطأ أثناء إضافة المنتج."
      );


    } finally {

      submitButton.disabled = false;
      submitButton.textContent = "إضافة المنتج";

    }

  });

});
