import { NextResponse } from "next/server";

const apiURL = "https://fakestoreapi.com/products";

export async function GET() {
  try {
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const products = await response.json();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.error();
  }
}
