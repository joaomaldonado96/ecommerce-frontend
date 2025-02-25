"use client";
import { useEffect, useState } from "react";
import { fetchDiscounts, updateDiscount } from "@/lib/api";

// Interfaz para el descuento, usando 'start_date' y 'end_date' para coincidir con el backend
interface Discount {
    id: number;
    start_date: string;
    end_date: string;
    discount_avg: number;
}

export interface DiscountProfile {
    startDate: string;
    endDate: string;
    discountPercentage: number;
}

const DiscountsPage = () => {
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
    const [updatedData, setUpdatedData] = useState<Partial<DiscountProfile>>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const getDiscounts = async () => {
            try {
                const discountsData = await fetchDiscounts();
                setDiscounts(discountsData);
            } catch (error) {
                console.error("Error al obtener descuentos:", error);
            }
        };

        getDiscounts();
    }, []);

    const handleEditClick = (discount: Discount) => {
        setEditingDiscount(discount);
        setUpdatedData({
            startDate: discount.start_date,
            endDate: discount.end_date,
            discountPercentage: discount.discount_avg,
        });
    };

    const handleSave = async () => {
        if (editingDiscount) {
            try {
                const updatedDiscountData = {
                    ...updatedData,
                    startDate: new Date(updatedData.startDate as string).toISOString(),
                    endDate: new Date(updatedData.endDate as string).toISOString(),
                };

                const updatedDiscount = await updateDiscount(editingDiscount.id, updatedDiscountData);

                setDiscounts((prevDiscounts) =>
                    prevDiscounts.map((discount) =>
                        discount.id === updatedDiscount.id ? updatedDiscount : discount
                    )
                );

                setSuccessMessage("¡Descuento actualizado con éxito!");

                // Verificamos si la fecha actual está dentro del rango del descuento
                const now = new Date();
                const startDate = new Date(updatedDiscount.start_date);
                const endDate = new Date(updatedDiscount.end_date);

                if (now >= startDate && now <= endDate) {
                    localStorage.setItem("discount", JSON.stringify(updatedDiscount));
                    window.dispatchEvent(new Event("cartUpdated"));  
                    window.location.href = "/discounts";
                } else {
                    localStorage.removeItem("discount");
                    window.dispatchEvent(new Event("cartUpdated"));  
                    window.location.href = "/discounts";
                }

                setEditingDiscount(null);
            } catch (error) {
                console.error("Error al actualizar el descuento:", error);
            }
        }
    };

    // Función para formatear la fecha en un formato amigable para el usuario
    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short',
        };
        return new Date(date).toLocaleString(undefined, options);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Gestión de Descuentos</h1>

            {/* Mostrar el mensaje de éxito */}
            {successMessage && (
                <div className="mb-4 text-green-500 font-semibold">
                    {successMessage}
                </div>
            )}

            {/* Tabla de Descuentos */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Descuentos</h2>

                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Fecha de Inicio</th>
                            <th className="border p-2">Fecha de Fin</th>
                            <th className="border p-2">Descuento</th>
                            <th className="border p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {discounts.map((discount) => (
                            <tr key={discount.id} className="text-center">
                                <td className="border p-2">{discount.id}</td>
                                <td className="border p-2">{formatDate(discount.start_date)}</td>
                                <td className="border p-2">{formatDate(discount.end_date)}</td>
                                <td className="border p-2">{discount.discount_avg}%</td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => handleEditClick(discount)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Formulario de Edición */}
            {editingDiscount && (
                <section className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Editar Descuento</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block mb-2">Fecha de Inicio</label>
                            <input
                                type="datetime-local"
                                value={updatedData.startDate || ""}
                                onChange={(e) =>
                                    setUpdatedData({ ...updatedData, startDate: e.target.value })
                                }
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div>
                            <label className="block mb-2">Fecha de Fin</label>
                            <input
                                type="datetime-local"
                                value={updatedData.endDate || ""}
                                onChange={(e) =>
                                    setUpdatedData({ ...updatedData, endDate: e.target.value })
                                }
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div>
                            <label className="block mb-2">Descuento</label>
                            <input
                                type="number"
                                value={updatedData.discountPercentage || ""}
                                onChange={(e) =>
                                    setUpdatedData({
                                        ...updatedData,
                                        discountPercentage: parseFloat(e.target.value),
                                    })
                                }
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-green-500 text-white px-6 py-2 rounded"
                        >
                            Guardar Cambios
                        </button>
                    </form>
                </section>
            )}
        </div>
    );
};

export default DiscountsPage;
