import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.NEXT_STRIPE_SECRET_KEY);

export const POST = async (request: any) => {
  const { products } = await request.json();

  if (!products || !Array.isArray(products)) {
    return NextResponse.json(
      { error: "Invalid products data" },
      { status: 400 }
    );
  }

  let activeProducts = await stripe.products.list({ active: true });
  console.log(activeProducts);

  try {
    for (const product of products) {
      const productName = product.title;
      const productPrice = product.price;
      const productQuantity = product.quantity;

      if (!productName || !productPrice) {
        console.log(
          `Product name or price is missing for product: ${JSON.stringify(
            product
          )}`
        );
        continue;
      }

      const matchedProducts = activeProducts?.data?.find(
        (stripeProduct: any) =>
          stripeProduct.name &&
          stripeProduct.name.toLowerCase() === productName.toLowerCase()
      );

      if (!matchedProducts) {
        await stripe.products.create({
          name: productName,
          default_price_data: {
            currency: "usd",
            unit_amount: productPrice * 100,
          },
        });
      }
    }
  } catch (error) {
    console.log("Error in creating a new product", error);
    throw error;
  }

  activeProducts = await stripe.products.list({ active: true });
  let stripeProducts: any[] = [];

  for (const product of products) {
    const productName = product.title;
    const productQuantity = product.quantity;
    if (!productName || !productQuantity) {
      console.log(
        `Product name or quantity is missing for product: ${JSON.stringify(
          product
        )}`
      );
      continue;
    }

    const stripeProduct = activeProducts?.data?.find(
      (stripeProduct: any) =>
        stripeProduct.name &&
        stripeProduct.name.toLowerCase() === productName.toLowerCase()
    );

    if (stripeProduct) {
      stripeProducts.push({
        price: stripeProduct?.default_price,
        quantity: productQuantity,
      });
    }
  }

  if (stripeProducts.length === 0) {
    return NextResponse.json(
      { error: "No valid products found" },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: stripeProducts,
      mode: "payment",
      success_url: `https://shop-mu-mauve.vercel.app/success`,
      cancel_url: `https://shop-mu-mauve.vercel.app/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("Error in creating checkout session", error);
    throw error;
  }
};
