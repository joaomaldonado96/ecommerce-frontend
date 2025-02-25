"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import Image from 'next/image';
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
export default function Navbar() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [discount, setDiscount] = useState<{ discount_avg: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Obtener usuario
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Función para actualizar el contador del carrito
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.reduce((acc: number, item: CartItem) => acc + item.quantity, 0));
    };

    updateCartCount(); // Actualizar al montar el componente

    // Obtener descuento activo
    const storedDiscount = localStorage.getItem("discount");
    if (storedDiscount) {
      const discountData = JSON.parse(storedDiscount);
      setDiscount(discountData);
    }

    // Escuchar cambios en el carrito
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setCartCount(0);
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-100 text-white p-4 flex justify-between items-center z-50 shadow-md">
      <Image
        src="https://talataa.co/wp-content/uploads/2022/04/cropped-no-background.png"
        alt="Logo"
        width={80}
        height={80}
      />
      <h1
        className="text-xl font-semibold text-gray-800 cursor-pointer"
        onClick={() => router.push("/")}
      >
        eCommerce
      </h1>

      <div className="flex items-center gap-4">
        {/* Mostrar cupón de descuento si hay descuento activo */}
        {discount && (
          <span
            className="bg-yellow-500 text-white px-3 py-1 rounded-lg cursor-pointer animate-pulse"
            onClick={() => router.push("/cart")}
          >
            Día de Descuento: {discount.discount_avg}%
          </span>
        )}

        {/* Ícono de carrito */}
        {user && (
          <div className="relative cursor-pointer" onClick={() => router.push("/cart")}>
            <ShoppingCartIcon
              className={`h-8 w-8 ${cartCount > 0 ? "text-red-500" : "text-gray-500"}`}
            />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {cartCount}
              </span>
            )}
          </div>
        )}

        {user ? (
          <div className="relative group">
            <button className="text-xl font-semibold text-gray-800">
              {user.name} ▼
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <ul className="py-2">
                {user.role === "admin" ? (
                  <>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => router.push("/sales")}
                    >
                      Mis compras
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => router.push("/profile")}
                    >
                      Editar perfil
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => router.push("/productsAdmin")}
                    >
                      Gestión de productos
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => router.push("/users")}
                    >
                      Gestión de usuarios
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => router.push("/discounts")}
                    >
                      Gestión del descuento
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => router.push("/reports")}
                    >
                      Reportes
                    </li>
                  </>
                ) : (
                  <>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => router.push("/sales")}
                    >
                      Mis compras
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => router.push("/profile")}
                    >
                      Editar perfil
                    </li>
                  </>
                )}
                <li
                  className="px-4 py-2 hover:bg-red-500 text-red-700 cursor-pointer"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <button
            className="bg-blue-500 px-4 py-2 rounded text-white"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}