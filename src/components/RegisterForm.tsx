"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api"; // Importamos la función del fetch

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    address: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const result = await registerUser(formData);

    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 shadow-md rounded-lg bg-white max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-center">Crear Cuenta</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}

      <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required className="border p-2 rounded" />
      <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required className="border p-2 rounded" />
      <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required className="border p-2 rounded" />
      <input type="text" name="address" placeholder="Dirección" value={formData.address} onChange={handleChange} required className="border p-2 rounded" />
      <input type="text" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} required className="border p-2 rounded" />

      <button type="submit" className="bg-blue-500 text-white py-2 rounded">Registrarse</button>
    </form>
  );
}
