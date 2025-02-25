"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, fetchDiscount } from "@/lib/api"; // Importamos la función de autenticación

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);

    if (result.success && result.redirectTo) {
      await fetchDiscount(); // Guardamos el descuento en localStorage
      window.location.href = result.redirectTo;  
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 shadow-md rounded-lg bg-white">
      <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded">
          Ingresar
        </button>
      </form>
      <button
        onClick={() => router.push("/register")}
        className="text-blue-500 underline text-center mt-2"
      >
        Crear cuenta
      </button>
    </div>
  );
}