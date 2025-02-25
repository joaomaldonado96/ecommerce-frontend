"use client";

import { useEffect, useState } from "react";
import CartItem from "@/components/CartItem";
import { createSale, createSaleProduct } from "@/lib/api";

export default function CartPage() {
  const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [isFrequentCustomer, setIsFrequentCustomer] = useState<boolean>(false);
  const [specialDiscount, setSpecialDiscount] = useState<number | null>(null);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);

    let discountValue = 0;
    const storedDiscount = localStorage.getItem("discount");
    if (storedDiscount) {
      discountValue += JSON.parse(storedDiscount).discount_avg;
      const storedSpecialDiscount = localStorage.getItem("specialDiscount");
      if (storedSpecialDiscount) {
        setSpecialDiscount(50); // Se añade el 50% de descuento especial
      }
    }

    const isFrequent = localStorage.getItem("is_frequent") === "true";
    if (isFrequent) {
      discountValue += 5;
      setIsFrequentCustomer(true);
    }



    setDiscount(discountValue);
  }, []);

  const updateCart = (updatedCart: typeof cart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleQuantityChange = (id: string, change: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    );
    updateCart(updatedCart);
  };

  const handleRemoveItem = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    updateCart(updatedCart);

    // 🔥 Si se eliminó un producto, quitar el descuento especial
    if (specialDiscount !== null) {
      localStorage.removeItem("specialDiscount");
      setSpecialDiscount(null);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const specialDiscountAmount = specialDiscount ? (subtotal * specialDiscount) / 100 : 0;
  const finalTotal = subtotal - discountAmount - specialDiscountAmount;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    try {
      const userEmail = localStorage.getItem("email");
      if (!userEmail) {
        alert("Error: No se encontró el email del usuario.");
        return;
      }

      const saleId = await createSale(userEmail, discount + (specialDiscount ?? 0));

      await Promise.all(
        cart.map((item) => createSaleProduct(saleId, Number(item.id), item.quantity, item.price))
      );

      localStorage.removeItem("cart");
      localStorage.removeItem("specialDiscount");
      setCart([]);
      setSpecialDiscount(null);
      window.dispatchEvent(new Event("cartUpdated"));
      window.location.href = "/sales";
    } catch (error) {
      console.error("Error en la compra:", error);
      alert("Hubo un problema al procesar la compra. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Carrito de Compras</h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <CartItem key={item.id} item={item} onQuantityChange={handleQuantityChange} onRemove={handleRemoveItem} />
        ))}
      </div>

      <div className="mt-6 space-y-2">
        <p className="text-2xl font-bold">Subtotal: ${subtotal.toFixed(2)}</p>

        {discount > 0 && (
          <p className="text-green-600 text-lg">
            Descuento aplicado ({discount}%): -${discountAmount.toFixed(2)}
          </p>
        )}

        {isFrequentCustomer && (
          <p className="text-blue-600 text-lg font-semibold">
            ¡Eres un cliente frecuente! Se aplicó un 5% adicional de descuento
          </p>
        )}

        {specialDiscount !== null && (
          <p className="text-purple-600 text-lg font-semibold">
            🎉 ¡Descuento especial aplicado ({specialDiscount}%)!: -${specialDiscountAmount.toFixed(2)}
          </p>
        )}

        <p className="text-2xl font-bold">Total a pagar: ${finalTotal.toFixed(2)}</p>
      </div>

      <div className="mt-6 flex justify-between">
        <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600" onClick={handleCheckout}>
          Finalizar compra
        </button>
      </div>
    </div>
  );
}
