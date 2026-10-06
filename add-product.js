document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById("add-product-form");


  if (!form) {
    return;
  }


  form.addEventListener("submit", async (event) => {

    event.preventDefault();


    const submitButton =
      form.querySelector(
        'button[type="submit"]'
      );


    const name =
      document
        .getElementById("product-name")
        .value
        .trim();


    const description =
      document
        .getElementById("product-description")
        .value
        .trim();


    const price =
      Number(
        document
          .getElementById("product-price")
          .value
      );


    const category =
      document
        .getElementById("product-category")
        .value
        .trim();


    const productUrl =
      document
        .getElementById("product-url")
        .value
        .trim();


    // التحقق من البيانات

    if (!name) {

      alert("يرجى كتابة اسم المنتج.");

      return;
    }


    if (!description) {

      alert("يرجى كتابة وصف المنتج.");

      return;
    }


    if (
      !Number.isFinite(price) ||
      price < 0
    ) {

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

    submitButton.textContent =
      "جاري حفظ المنتج...";


    try {

      const response =
        await fetch(
          "/api/products",
          {
            method: "POST",

            credentials: "same-origin",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({

                name: name,

                description: description,

                price: price,

                category: category,

                product_url: productUrl,

                image_url: ""

              })
          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "تعذر حفظ المنتج."
        );

      }


      alert(
        "تم حفظ المنتج بنجاح ✅"
      );


      form.reset();


      // العودة إلى المتجر

      window.location.href =
        "index.html";


    } catch (error) {

      console.error(
        "Add product error:",
        error
      );


      alert(
        error.message ||
        "حدث خطأ أثناء حفظ المنتج."
      );


    } finally {

      submitButton.disabled = false;

      submitButton.textContent =
        "إضافة المنتج";

    }

  });

});
