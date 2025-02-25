"use client";

import { useEffect, useState } from "react";
import { fetchUserSales } from "@/lib/api";
import SaleCard from "@/components/SaleCard";

interface Sale {
    id: number;
    createdAt: string;
    discount: number;
    total?: number;
}

export default function SalesPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        // Obtener email solo en el cliente
        const storedEmail = localStorage.getItem("email");
        setEmail(storedEmail);
    }, []);

    useEffect(() => {
        if (!email) return;

        const getSales = async () => {
            try {
                const salesData = await fetchUserSales(email);
                setSales(salesData);
            } catch (err) {
                console.log(err);
                setError("No se pudieron cargar las compras");
            } finally {
                setLoading(false);
            }
        };

        getSales();
    }, [email]);

    if (loading) return <p>Cargando compras...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Mis Compras</h1>
            <p className="mb-4 text-lg text-gray-700">
                Aquí puedes ver todas tus compras ordenadas cronológicamente. Cada tarjeta
                muestra el total de la compra, que es la suma de los productos adquiridos menos
                cualquier descuento aplicado. Para ver más detalles de cada compra, haz clic en
                &quot;Ver detalles&quot;.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
                {sales.map((sale) => (
                    <SaleCard key={sale.id} sale={sale} />
                ))}
            </div>
        </div>
    );
}