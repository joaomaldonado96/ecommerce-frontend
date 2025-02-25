"use client";

import { useEffect, useState } from "react";
import { fetchActiveProducts, fetchTopSellingProducts, fetchTopFrequentCustomers } from "@/lib/api";
import { exportToExcel, exportToPDF } from "@/ulils/exportUtils";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    updatedByEmail: string;
}

interface TopSellingProduct extends Product {
    total_sold: number;
}

interface FrequentCustomer {
    email: string;
    name: string;
    avgSales: number;
}

export default function ReportsPage() {
    const [activeProducts, setActiveProducts] = useState<Product[]>([]);
    const [topSellingProducts, setTopSellingProducts] = useState<TopSellingProduct[]>([]);
    const [frequentCustomers, setFrequentCustomers] = useState<FrequentCustomer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [products, topProducts, customers] = await Promise.all([
                    fetchActiveProducts(),
                    fetchTopSellingProducts(),
                    fetchTopFrequentCustomers(),
                ]);

                setActiveProducts(products);
                setTopSellingProducts(topProducts);
                setFrequentCustomers(customers);
            } catch (err) {
                console.log(err)
                setError("Error al cargar los reportes.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p className="text-center">Cargando reportes...</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Reportes</h1>

            {/* Productos Activos */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4"> Productos Activos</h2>
                <div className="mt-2 flex gap-2">
                    <button onClick={() => exportToExcel(activeProducts, "Productos_Activos")} className="bg-green-500 text-white px-4 py-2 rounded">Descargar Excel</button>
                    <button onClick={() => exportToPDF(activeProducts, ["id", "name", "price", "stock"], "Productos_Activos")} className="bg-red-500 text-white px-4 py-2 rounded">Descargar PDF</button>
                </div>

                {activeProducts.length > 0 ? (

                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">ID</th>
                                <th className="border p-2">Nombre</th>
                                <th className="border p-2">Precio</th>
                                <th className="border p-2">Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeProducts.map((product) => (
                                <tr key={product.id} className="text-center">
                                    <td className="border p-2">{product.id}</td>
                                    <td className="border p-2">{product.name}</td>
                                    <td className="border p-2">${product.price.toFixed(2)}</td>
                                    <td className="border p-2">{product.stock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                ) : (
                    <p>No hay productos activos.</p>
                )}
            </section>

            {/* Top 5 de lo Más Vendido */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4"> Top 5 de lo Más Vendido</h2>
                <div className="mt-2 flex gap-2">
                    <button onClick={() => exportToExcel(topSellingProducts, "Top_Productos_Vendidos")} className="bg-green-500 text-white px-4 py-2 rounded">Descargar Excel</button>
                    <button onClick={() => exportToPDF(topSellingProducts, ["id", "name", "price", "total_sold"], "Top_Productos_Vendidos")} className="bg-red-500 text-white px-4 py-2 rounded">Descargar PDF</button>
                </div>
                {topSellingProducts.length > 0 ? (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">ID</th>
                                <th className="border p-2">Nombre</th>
                                <th className="border p-2">Precio</th>
                                <th className="border p-2">Stock</th>
                                <th className="border p-2">Total Vendido</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topSellingProducts.map((product) => (
                                <tr key={product.id} className="text-center">
                                    <td className="border p-2">{product.id}</td>
                                    <td className="border p-2">{product.name}</td>
                                    <td className="border p-2">${product.price.toFixed(2)}</td>
                                    <td className="border p-2">{product.stock}</td>
                                    <td className="border p-2">{product.total_sold}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay productos vendidos.</p>
                )}
            </section>

            {/* Top 5 Clientes Frecuentes */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4"> Top 5 Clientes Frecuentes</h2>
                <div className="mt-2 flex gap-2">
                    <button onClick={() => exportToExcel(frequentCustomers, "Top_Clientes_Frecuentes")} className="bg-green-500 text-white px-4 py-2 rounded">Descargar Excel</button>
                    <button onClick={() => exportToPDF(frequentCustomers, ["email", "name", "avgSales"], "Top_Clientes_Frecuentes")} className="bg-red-500 text-white px-4 py-2 rounded">Descargar PDF</button>
                </div>
                {frequentCustomers.length > 0 ? (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Nombre</th>
                                <th className="border p-2">Promedio de Días entre Compras</th>
                            </tr>
                        </thead>
                        <tbody>
                            {frequentCustomers.map((customer) => (
                                <tr key={customer.email} className="text-center">
                                    <td className="border p-2">{customer.email}</td>
                                    <td className="border p-2">{customer.name}</td>
                                    <td className="border p-2">{customer.avgSales.toFixed(2)} días</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay clientes frecuentes.</p>
                )}
            </section>
        </div>
    );
}
