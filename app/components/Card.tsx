import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const Card = ({ product }: any) => {
  return (
    <Link href={`/product/${product.id}`}>
      <motion.div
        whileHover={{ scale: 1.05, rotate: 1 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white p-5 shadow-lg rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 ease-in-out"
      >
        <Image
          src={product.image}
          alt={product.title}
          width={220}
          height={220}
          className="object-cover w-full h-48"
          priority={false}
        />
        <div className="text-center py-5">
          <h1 className="text-2xl font-semibold mb-2 line-clamp-2">
            {product.title}
          </h1>
          <h2 className="text-xl text-gray-600">${product.price}</h2>
        </div>
      </motion.div>
    </Link>
  );
};

export default Card;
