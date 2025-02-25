"use client";

import { notFound, useRouter } from "next/navigation";
import { fetchProductById } from "@/lib/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params?.id) return;

      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const data = await fetchProductById(id);

        if (!data) {
          notFound();
        } else {
          setProduct(data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        notFound();
      }
    };

    fetchProduct();
  }, [params]);

  const handleAddToCart = () => {
    const user = localStorage.getItem("user");

    if (!user) {
      router.push("/login");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProductIndex = cart.findIndex((item: CartItem) => item.id === product?.id);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push({ id: product?.id, name: product?.name, price: product?.price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated")); // Notificar actualización del carrito
  };

  if (!product) return <p className="text-center text-gray-500">Cargando producto...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <Image src={`/images/${product.id}.jpg`} width={400} height={400} alt={product.name} className="rounded-lg" />
      <p className="text-lg text-gray-700 my-4">{product.description}</p>
      <p className="text-2xl font-semibold">${product.price}</p>
      <button
        onClick={handleAddToCart}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        Agregar al carrito
      </button>
    </div>
  );
}