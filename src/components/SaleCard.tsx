"use client";

import { useEffect, useState } from "react";
import { fetchSaleProducts } from "@/lib/api";
import Link from "next/link";

interface Sale {
    id: number;
    createdAt: string;
    discount: number;
}

export default function SaleCard({ sale }: { sale: Sale }) {
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getTotal = async () => {
            try {
                const saleProducts = await fetchSaleProducts(sale.id);
                let totalPrice = 0;

                for (const sp of saleProducts) {
                    totalPrice += sp.quantity * sp.unitPrice;
                }

                const discountAmount = (totalPrice / 100) * sale.discount;
                setTotal(totalPrice - discountAmount);
            } catch (err) {
                console.error("Error al calcular total", err);
            } finally {
                setLoading(false);
            }
        };

        getTotal();
    }, [sale.id, sale.discount]);

    return (
        <div className="border p-4 rounded shadow-md w-full max-w-xs">
            <h2 className="text-lg font-bold">Compra #{sale.id}</h2>
            <p className="text-gray-600 text-sm">Fecha: {new Date(sale.createdAt).toLocaleDateString()}</p>
            {loading ? <p className="text-sm">Cargando total...</p> : <p className="font-semibold text-sm">Total: ${total.toFixed(2)}</p>}
            <Link href={`/sale/${sale.id}`}>
                <button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm">
                    Ver detalles
                </button>
            </Link>
        </div>
    );
}
