"use client";

import { useEffect, useState } from "react";
import { getPersonByEmail, updatePerson } from "@/lib/api";

interface UserProfile {
  email: string;
  name: string;
  address: string;
  phone: string;
  isFrequentCustomer: boolean;
  createdAt: string;
  role: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const userEmail = localStorage.getItem("email");
      if (!userEmail) {
        setError("No se encontró el email del usuario.");
        setLoading(false);
        return;
      }

      try {
        const data = await getPersonByEmail(userEmail);
        setProfile(data);
        setFormData({
          name: data.name,
          address: data.address,
          phone: data.phone,
          isFrequentCustomer: data.isFrequentCustomer, // Se envía pero no se muestra
          role: data.role, // Se envía pero no se muestra
        });
      } catch (err) {
        setError("Error al cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const updatedData = await updatePerson(profile.email, formData);
      setProfile(updatedData);
      setSuccessMessage("Perfil actualizado correctamente.");

      // ✅ Actualizar localStorage con los nuevos datos
      const updatedUser = {
        name: updatedData.name,
        email: updatedData.email,
        role: updatedData.role, // Se mantiene el rol
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // ✅ Actualizar la variable de cliente frecuente
      if (updatedData.isFrequentCustomer) {
        localStorage.setItem("is_frequent", "true");
      } else {
        localStorage.removeItem("is_frequent");
      }

      // ✅ Recargar la página para reflejar los cambios en la Navbar
      window.location.reload();
    } catch (err) {
      setError("Error al actualizar el perfil.");
    }
  };

  if (loading) return <p className="text-center">Cargando perfil...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Perfil de Usuario</h1>

      {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

      {profile && (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg">
          <div className="mb-4">
            <label className="block text-gray-700">Correo Electrónico:</label>
            <input type="email" value={profile.email} disabled className="w-full p-2 border rounded bg-gray-100" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Nombre:</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Dirección:</label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Teléfono:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            Guardar Cambios
          </button>
        </form>
      )}
    </div>
  );
}
