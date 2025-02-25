"use client";

import { useEffect, useState } from "react";
import { fetchTopSellingProducts, fetchActiveProducts } from "@/lib/api"; // Importar la función de productos activos
import Link from "next/link";
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
}

interface ProductSale {
  id: number;
  name: string;
  price: string;
  quantity: number;
}

export default function HomePage() {
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getTopProducts = async () => {
      try {
        const data = await fetchTopSellingProducts();
        setTopProducts(data);
      } catch (error) {
        console.error("Error al obtener los productos más vendidos:", error);
      }
    };

    getTopProducts();
  }, []);

  const handleRandomOrder = async () => {
    try {
      const products = await fetchActiveProducts(); // Obtener productos activos
      if (products.length === 0) {
        alert("No hay productos activos disponibles.");
        return;
      }

      // Seleccionar aleatoriamente hasta 4 productos
      const shuffled = products.sort(() => 0.5 - Math.random()).slice(0, 4);
      const randomCartItems = shuffled.map((product: ProductSale) => ({
        id: product.id.toString(),
        name: product.name,
        price: Number(product.price),
        quantity: 1
      }));

      // Obtener el carrito actual y actualizarlo
      const updatedCart = [...randomCartItems];

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      localStorage.setItem("specialDiscount", "50"); // Guardar el descuento especial

      // Emitir evento para actualizar el Navbar
      window.dispatchEvent(new Event("cartUpdated"));

      alert("Pedido aleatorio agregado con 50% de descuento.");
    } catch (error) {
      console.error("Error al generar el pedido aleatorio:", error);
      alert("Hubo un problema al generar el pedido aleatorio.");
    }
  };

  return (
    <div className="container mx-auto">
      <section className="relative bg-gray-900 text-white py-24 text-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: "url('/images/home.webp')" }}></div>
        <div className="absolute inset-0 bg-black bg-opacity-80"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold">Bienvenido a nuestro eCommerce</h1>
          <p className="mt-4 text-lg text-gray-300">
            Encuentra los mejores productos al mejor precio. Calidad garantizada.
          </p>
          <Link href="/products" className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 text-lg font-semibold rounded-lg hover:bg-blue-600">
            Explorar Productos
          </Link>
        </div>
      </section>

      <section className="py-16 text-center">
        <h2 className="text-4xl font-bold mb-6"> ¿Te animas a un pedido aleatorio?</h2>
        <button
          className="bg-purple-500 text-white px-6 py-3 text-lg font-semibold rounded-lg hover:bg-purple-600"
          onClick={handleRandomOrder}
        >
          Generar Pedido Aleatorio
        </button>
      </section>

      <section className="py-16">
        <h2 className="text-4xl font-bold text-center mb-10">🔥 Top 5 Más Vendidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 flex flex-col h-full">
              <Image  src={`/images/${product.id}.jpg`} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
              <h3 className="text-xl font-semibold mt-2">{product.name}</h3>
              <p className="text-gray-700 flex-grow">{product.description}</p>
              <p className="text-lg font-bold mt-2">${product.price}</p>
              <div className="mt-auto">
                <Link href={`/product/${product.id}`} className="block mt-4 bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600">
                  Ver detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
