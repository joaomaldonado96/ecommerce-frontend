"use client";

import { useEffect, useState } from "react";
import { fetchUsers, updatePerson } from "@/lib/api"; // Importa las funciones de la API


export interface UserProfile {
    email: string;
    name: string;
    address: string;
    phone: string;
    isFrequentCustomer: boolean;
    role: string;
}

const UsersPage = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
    const [updatedData, setUpdatedData] = useState<Partial<UserProfile>>({});

    useEffect(() => {
        const getUsers = async () => {
            try {
                const usersData = await fetchUsers();
                setUsers(usersData);
            } catch (error) {
                console.error("Error al obtener los usuarios:", error);
            }
        };

        getUsers();
    }, []);

    const handleEditClick = (user: UserProfile) => {
        setEditingUser(user);
        setUpdatedData({
            email: user.email,
            name: user.name,
            address: user.address,
            phone: user.phone,
            role: user.role, // Se mantiene, pero no se muestra
        });
    };

    const handleSave = async () => {
        if (editingUser) {
            try {
                const updatedUser = await updatePerson(editingUser.email, updatedData);
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.email === updatedUser.email ? updatedUser : user
                    )
                );
                setEditingUser(null);
            } catch (error) {
                console.error("Error al actualizar el usuario:", error);
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>

            {/* Tabla de Usuarios */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Usuarios</h2>

                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Nombre</th>
                            <th className="border p-2">Dirección</th>
                            <th className="border p-2">Teléfono</th>
                            <th className="border p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.email} className="text-center">
                                <td className="border p-2">{user.email}</td>
                                <td className="border p-2">{user.name}</td>
                                <td className="border p-2">{user.address}</td>
                                <td className="border p-2">{user.phone}</td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => handleEditClick(user)}
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
            {editingUser && (
                <section className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Editar Usuario</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block mb-2">Nombre</label>
                            <input
                                type="text"
                                value={updatedData.name || ""}
                                onChange={(e) =>
                                    setUpdatedData({ ...updatedData, name: e.target.value })
                                }
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div>
                            <label className="block mb-2">Dirección</label>
                            <input
                                type="text"
                                value={updatedData.address || ""}
                                onChange={(e) =>
                                    setUpdatedData({ ...updatedData, address: e.target.value })
                                }
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div>
                            <label className="block mb-2">Teléfono</label>
                            <input
                                type="text"
                                value={updatedData.phone || ""}
                                onChange={(e) =>
                                    setUpdatedData({ ...updatedData, phone: e.target.value })
                                }
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        {/* El campo 'Frecuente' ha sido eliminado del formulario */}
                        {/* El rol ya no se muestra en la vista de edición */}
                        <div>
                            <input
                                type="hidden"
                                value={updatedData.role || ""}
                                onChange={(e) =>
                                    setUpdatedData({ ...updatedData, role: e.target.value })
                                }
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

export default UsersPage;
