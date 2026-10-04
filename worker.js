async function createSession(secret) {
  const payload = {
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7
  };

  const data = btoa(JSON.stringify(payload));

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );

  const sig = btoa(
    String.fromCharCode(...new Uint8Array(signature))
  );

  return `${data}.${sig}`;
}

async function verifySession(request, secret) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/mrvalor_session=([^;]+)/);

  if (!match) return false;

  const [data, sig] = match[1].split(".");

  if (!data || !sig) return false;

  try {
    const payload = JSON.parse(atob(data));

    if (!payload.exp || Date.now() > payload.exp) {
      return false;
    }

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signatureBytes = Uint8Array.from(
      atob(sig),
      char => char.charCodeAt(0)
    );

    return await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      new TextEncoder().encode(data)
    );
  } catch {
    return false;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const ownerPassword = env["nw-7seDNVwBGuat"];

    // تسجيل دخول المالك
    if (
      request.method === "POST" &&
      url.pathname === "/api/auth/login"
    ) {
      try {
        const data = await request.json();
        const password = String(data.password || "");

        if (!ownerPassword || password !== ownerPassword) {
          return Response.json(
            {
              success: false,
              message: "كلمة المرور غير صحيحة."
            },
            { status: 401 }
          );
        }

        const session = await createSession(ownerPassword);

        return new Response(
          JSON.stringify({
            success: true,
            message: "تم تسجيل الدخول بنجاح."
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Set-Cookie":
                `mrvalor_session=${session}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`
            }
          }
        );
      } catch {
        return Response.json(
          {
            success: false,
            message: "حدث خطأ أثناء تسجيل الدخول."
          },
          { status: 400 }
        );
      }
    }

    // التحقق من جلسة المالك
    if (
      request.method === "GET" &&
      url.pathname === "/api/auth/me"
    ) {
      const loggedIn = await verifySession(
        request,
        ownerPassword
      );

      return Response.json({
        authenticated: loggedIn
      });
    }

    // تسجيل الخروج
    if (
      request.method === "POST" &&
      url.pathname === "/api/auth/logout"
    ) {
      return new Response(
        JSON.stringify({
          success: true
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie":
              "mrvalor_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"
          }
        }
      );
    }

    // حماية صفحة إضافة المنتج
    if (url.pathname === "/add-product.html") {
      const loggedIn = await verifySession(
        request,
        ownerPassword
      );

      if (!loggedIn) {
        return Response.redirect(
          new URL("/login.html", request.url),
          302
        );
      }
    }

    // إضافة منتج — للمالك فقط
    if (
      request.method === "POST" &&
      url.pathname === "/api/products"
    ) {
      const loggedIn = await verifySession(
        request,
        ownerPassword
      );

      if (!loggedIn) {
        return Response.json(
          {
            success: false,
            message: "غير مصرح لك بإضافة المنتجات."
          },
          { status: 401 }
        );
      }

      try {
        const data = await request.json();

        const name = String(data.name || "").trim();
        const description = String(data.description || "").trim();
        const price = Number(data.price);
        const category = String(data.category || "").trim();
        const product_url = String(data.product_url || "").trim();
        const image_url = String(data.image_url || "").trim();

        if (
          !name ||
          !description ||
          !category ||
          !product_url ||
          !Number.isFinite(price)
        ) {
          return Response.json(
            {
              success: false,
              message: "يرجى تعبئة جميع البيانات المطلوبة."
            },
            { status: 400 }
          );
        }

        const result = await env.DB.prepare(`
          INSERT INTO products
          (name, description, price, category, product_url, image_url)
          VALUES (?, ?, ?, ?, ?, ?)
        `)
          .bind(
            name,
            description,
            price,
            category,
            product_url,
            image_url || null
          )
          .run();

        return Response.json({
          success: true,
          message: "تمت إضافة المنتج بنجاح.",
          product_id: result.meta.last_row_id
        });
      } catch {
        return Response.json(
          {
            success: false,
            message: "حدث خطأ أثناء حفظ المنتج."
          },
          { status: 500 }
        );
      }
    }

    // جلب المنتجات
    if (
      request.method === "GET" &&
      url.pathname === "/api/products"
    ) {
      try {
        const result = await env.DB.prepare(`
          SELECT *
          FROM products
          ORDER BY id DESC
        `).all();

        return Response.json({
          success: true,
          products: result.results
        });
      } catch {
        return Response.json(
          {
            success: false,
            message: "تعذر جلب المنتجات."
          },
          { status: 500 }
        );
      }
    }

    // الموقع
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Mr.Valor Worker is running.", {
      status: 200
    });
  }
};
