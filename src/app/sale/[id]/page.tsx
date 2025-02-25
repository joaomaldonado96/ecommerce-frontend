"use client";

import { notFound } from "next/navigation";
import { fetchSaleById, fetchSaleProducts, fetchProductById } from "@/lib/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SaleProductCard from "@/components/SaleProductCard";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface SaleProduct {
  sale_id: number;
  product_id: number;
  quantity: number;
  unitPrice: number;
  product?: Product;
}

interface SaleDetail {
  id: number;
  createdAt: string;
  discount: number;
  saleProducts?: SaleProduct[];
}

export default function SalesPage() {
  const params = useParams();
  const [saleDetail, setSaleDetail] = useState<SaleDetail | null>(null);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const fetchSaleDetail = async () => {
      if (!params?.id) return;

      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const sale = await fetchSaleById(id);
        const saleProducts = await fetchSaleProducts(sale.id);
        sale.saleProducts = saleProducts;
        let totalPrice = 0;

        for (const sp of saleProducts) {
          const product = await fetchProductById(sp.product_id);
          sp.product = product;
          totalPrice += sp.quantity * sp.unitPrice;
        }

        setSubtotal(totalPrice);

        const discountAmount = (totalPrice / 100) * sale.discount;
        setTotal(totalPrice - discountAmount);

        if (!sale) {
          notFound();
        } else {
          setSaleDetail(sale);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        notFound();
      }
    };

    fetchSaleDetail();
  }, [params]);

  if (!saleDetail) return <p className="text-center text-gray-500">Cargando Compra...</p>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-6">Detalles de la Orden</h2>
      <p className="text-gray-600 text-center text-lg mb-6">
        Fecha: {new Date(saleDetail.createdAt).toLocaleDateString("es-ES", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>

      {saleDetail.saleProducts?.length ? (
        <div
          className={`flex ${
            saleDetail.saleProducts.length === 1 ? "justify-center" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          }`}
        >
          {saleDetail.saleProducts.map((saleProduct) => (
            <SaleProductCard key={saleProduct.product_id} saleProduct={saleProduct} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No se encontraron productos.</p>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto mt-10">
        <p className="text-xl font-semibold text-gray-800 border-b pb-2 mb-2">
          Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span>
        </p>
        <p className="text-xl font-semibold text-red-600 border-b pb-2 mb-2">
          Descuento:{" "}
          <span className="font-bold">%{saleDetail.discount} (-${((subtotal / 100) * saleDetail.discount).toFixed(2)})</span>
        </p>
        <p className="text-2xl font-bold text-green-700">
          Total pagado: <span className="font-bold">${total.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}
