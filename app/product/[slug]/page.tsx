"use client";

import { useParams } from "next/navigation";
import { Navbar, ProductDetails } from "../../components";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const products = await response.json();

        const foundProduct = products.find(
          (product: any) => product.id.toString() === slug
        );

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
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!product) return <p>No product available</p>;

  return (
    <>
      <Navbar />
      <ProductDetails product={product} />
    </>
  );
};

export default Page;
