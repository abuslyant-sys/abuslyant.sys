export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // إضافة منتج إلى D1
    if (request.method === "POST" && url.pathname === "/api/products") {
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

      } catch (error) {
        return Response.json(
          {
            success: false,
            message: "حدث خطأ أثناء حفظ المنتج."
          },
          { status: 500 }
        );
      }
    }

    // جلب المنتجات من D1
    if (request.method === "GET" && url.pathname === "/api/products") {
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

      } catch (error) {
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
