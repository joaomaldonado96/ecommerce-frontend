"use client";
import { useEffect, useState } from "react";
import { fetchProducts, updateProduct } from "@/lib/api"; // Importa las funciones de la API

export interface ProductProfile {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    isActive: boolean;
    createdAt: string;  // Puede ser 'Date' dependiendo de cómo manejes las fechas
    updatedAt: string;  // Lo mismo con la fecha de actualización
    updatedByEmail: string;
}

const ProductsAdminPage = () => {
  const [products, setProducts] = useState<ProductProfile[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductProfile | null>(null);
  const [updatedData, setUpdatedData] = useState<Partial<ProductProfile>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Estado para el mensaje de éxito

  useEffect(() => {
    const getProducts = async () => {
        try {
          const productsData = await fetchProducts();
          // Ordena los productos por id de forma ascendente
          const sortedProducts = productsData.sort((a: ProductProfile, b: ProductProfile) => a.id - b.id);
          setProducts(sortedProducts);
        } catch (error) {
          console.error("Error al obtener los productos:", error);
        }
      };

    getProducts();
  }, []);

  const handleEditClick = (product: ProductProfile) => {
    setEditingProduct(product);
    setUpdatedData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      isActive: true,  // Aseguramos que isActive sea siempre true
    });
  };

  const handleSave = async () => {
    if (editingProduct) {
      try {
        // Obtener el email desde localStorage
        const updatedByEmail = localStorage.getItem("email");

        // Asegurarse de que el email esté disponible
        if (!updatedByEmail) {
          throw new Error("No se encontró el correo electrónico en el almacenamiento local.");
        }

        // Agregar updatedByEmail a updatedData
        const updatedProduct = await updateProduct(editingProduct.id, {
          ...updatedData,
          updatedByEmail,  // Incluye el email
        });

        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        );

        // Mostrar el mensaje de éxito
        setSuccessMessage("¡Producto actualizado con éxito!");

        setEditingProduct(null);
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Productos</h1>

      {/* Mostrar el mensaje de éxito */}
      {successMessage && (
        <div className="mb-4 text-green-500 font-semibold">
          {successMessage}
        </div>
      )}

      {/* Tabla de Productos */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Productos</h2>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Descripción</th>
              <th className="border p-2">Precio</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="text-center">
                <td className="border p-2">{product.id}</td>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">{product.description}</td>
                <td className="border p-2">${product.price.toFixed(2)}</td>
                <td className="border p-2">{product.stock}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEditClick(product)}
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
      {editingProduct && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Editar Producto</h2>
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
              <label className="block mb-2">Descripción</label>
              <textarea
                value={updatedData.description || ""}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, description: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-2">Precio</label>
              <input
                type="number"
                value={updatedData.price || ""}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, price: parseFloat(e.target.value) })
                }
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-2">Stock</label>
              <input
                type="number"
                value={updatedData.stock || ""}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, stock: parseInt(e.target.value, 10) })
                }
                className="w-full border p-2 rounded"
              />
            </div>

            {/* No es necesario mostrar ni editar isActive, ya que siempre está en true */}
            <input
              type="hidden"
              value="true"
              onChange={() => setUpdatedData({ ...updatedData, isActive: true })}
            />

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

export default ProductsAdminPage;
