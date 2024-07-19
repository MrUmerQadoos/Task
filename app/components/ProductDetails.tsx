import { useState, useContext } from "react";
import Image from "next/image";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { CartContext } from "../context/CartContext";

const ProductDetails = ({ product }: any) => {
  const [index, setIndex] = useState(0);
  const { cartItems, addProduct, qty, decQty, incQty }: any =
    useContext(CartContext);

  return (
    <div className="product-details-section">
      <div className="product-details-container">
        {/* Left */}
        <div>
          {/* TOP */}
          <div className="h-[450px] flex items-center mb-[25px]">
            <Image
              src={product.image}
              alt={product.title}
              width={350}
              height={350}
              className="object-cover mx-auto"
            />
          </div>

          {/* BOTTOM */}
          <div className="small-images-container">
            <Image
              src={product.image}
              alt={product.title}
              width={220}
              height={100}
              className="object-cover h-32 mx-auto border rounded-xl hover:cursor-pointer"
              onClick={() => setIndex(0)}
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-8 md:pt-32 pt-0">
          <div className="flex flex-col gap-4">
            <div className="text-3xl font-bold">{product.title}</div>
            <div className="text-xl font-medium">${product.price}</div>
          </div>

          <div className="flex gap-2 items-center">
            <h3>Quantity</h3>
            <p className="quantity-desc flex items-center border-black">
              <span className="minus" onClick={decQty}>
                <AiOutlineMinus />
              </span>
              <span className="num">{qty}</span>
              <span className="plus" onClick={incQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>

          <button
            className="btn add-to-cart"
            onClick={() => addProduct(product, qty)}
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
