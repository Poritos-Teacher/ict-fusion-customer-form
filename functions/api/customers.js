
export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();

    const name = String(data.name || "").trim();
    const phone = String(data.phone || "").trim();
    const address = String(data.address || "").trim();
    const consent = data.consent === true;

    if (!name || !phone || !address) {
      return Response.json(
        { error: "সব তথ্য পূরণ করুন।" },
        { status: 400 }
      );
    }

    if (!consent) {
      return Response.json(
        { error: "তথ্য সংরক্ষণের সম্মতি প্রয়োজন।" },
        { status: 400 }
      );
    }

    if (name.length > 100 || phone.length > 20 || address.length > 500) {
      return Response.json(
        { error: "প্রদত্ত তথ্যের দৈর্ঘ্য সীমা অতিক্রম করেছে।" },
        { status: 400 }
      );
    }

    const result = await env.CUSTOMERS_DB
      .prepare(
        "INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)"
      )
      .bind(name, phone, address)
      .run();

    if (!result.success) {
      throw new Error("Database insert failed");
    }

    return Response.json(
      { success: true, message: "Customer saved" },
      { status: 201 }
    );

  } catch (error) {
    return Response.json(
      { error: "তথ্য সংরক্ষণ করা যায়নি। পরে আবার চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}
