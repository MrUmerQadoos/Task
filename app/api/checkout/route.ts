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
    // 1. Find products from Stripe that match products from the cart.
    for (const product of products) {
      // Assuming the product from the cart has 'title' instead of 'name'
      const productName = product.title; // Use 'title' if that's the property in your cart
      const productPrice = product.price; // Assuming price is correct
      const productQuantity = product.quantity; // Assuming quantity is correct

      if (!productName || !productPrice) {
        console.log(
          `Product name or price is missing for product: ${JSON.stringify(
            product
          )}`
        );
        continue; // Skip processing this product
      }

      const matchedProducts = activeProducts?.data?.find(
        (stripeProduct: any) =>
          stripeProduct.name &&
          stripeProduct.name.toLowerCase() === productName.toLowerCase()
      );

      // 2. If product didn't exist in Stripe, then add this product to Stripe.
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

  // 3. Once the new product has been added to Stripe, fetch products again with updated products from Stripe
  activeProducts = await stripe.products.list({ active: true });
  let stripeProducts: any[] = [];

  for (const product of products) {
    const productName = product.title; // Use 'title' if that's the property in your cart
    const productQuantity = product.quantity; // Assuming quantity is correct

    if (!productName || !productQuantity) {
      console.log(
        `Product name or quantity is missing for product: ${JSON.stringify(
          product
        )}`
      );
      continue; // Skip processing this product
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

  // Ensure `line_items` is populated
  if (stripeProducts.length === 0) {
    return NextResponse.json(
      { error: "No valid products found" },
      { status: 400 }
    );
  }

  // 4. Create Checkout Sessions from body params.
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
