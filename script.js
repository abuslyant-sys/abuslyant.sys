// إظهار أدوات المالك فقط بعد تسجيل الدخول
async function checkOwnerAccess() {
  const ownerAddProduct = document.getElementById("owner-add-product");

  if (!ownerAddProduct) return;

  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "same-origin"
    });

    const result = await response.json();

    if (result.authenticated === true) {
      ownerAddProduct.style.display = "";
    }
  } catch (error) {
    console.error("تعذر التحقق من صلاحيات المالك.");
  }
}

checkOwnerAccess();
