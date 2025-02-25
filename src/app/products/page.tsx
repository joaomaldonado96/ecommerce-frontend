"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("default");

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    getProducts();
  }, []);

  // Convertir el término de búsqueda a minúsculas
  const searchLower = searchTerm.toLowerCase().trim();

  // Filtrado de productos
  let filteredProducts = products.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(searchLower);
    const descriptionMatch = product.description.toLowerCase().includes(searchLower);
    const priceMatch = !isNaN(Number(searchLower)) && product.price === Number(searchLower);

    return nameMatch || descriptionMatch || priceMatch;
  });

  // Ordenamiento según la opción seleccionada
  if (sortOption === "priceAsc") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortOption === "priceDesc") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortOption === "nameAsc") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === "nameDesc") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.name.localeCompare(a.name));
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Nuestros Productos</h1>

      {/* Barra de búsqueda */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Buscar por nombre, descripción o precio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Menú de ordenamiento */}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full md:w-1/4 mt-4 md:mt-0 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="default">Ordenar por...</option>
          <option value="priceAsc">Precio: Menor a Mayor</option>
          <option value="priceDesc">Precio: Mayor a Menor</option>
          <option value="nameAsc">Nombre: A-Z</option>
          <option value="nameDesc">Nombre: Z-A</option>
        </select>
      </div>

      {/* Mostrar productos filtrados y ordenados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <p className="text-gray-500">No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
}
