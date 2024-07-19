"use client";

import { useParams } from "next/navigation";
import { Navbar, ProductDetails } from "../../components";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { slug } = useParams(); // Extract slug from URL parameters
  const [product, setProduct] = useState<any>(null); // State to store product data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState<string | null>(null); // State to handle errors

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // Fetch all products from the API
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const products = await response.json();

        // Find the product by slug
        const foundProduct = products.find(
          (product: any) => product.id.toString() === slug
        );

        // If product not found, set error
        if (!foundProduct) {
          setError("Product not found");
        } else {
          setProduct(foundProduct);
        }
      } catch (error) {
        setError("Failed to fetch product data");
        console.error("Failed to fetch product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug]); // Depend on slug to refetch if it changes

  if (loading) return <p>Loading...</p>; // Handle loading state
  if (error) return <p>{error}</p>; // Handle errors

  if (!product) return <p>No product available</p>; // Handle case when product is not found

  return (
    <>
      <Navbar />
      <ProductDetails product={product} />
    </>
  );
};

export default Page;
