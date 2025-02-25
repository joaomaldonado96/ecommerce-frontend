const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface UserProfile {
  email: string;
  name: string;
  address: string;
  phone: string;
  isFrequentCustomer: boolean;
  createdAt: string;
  role: string;
}

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


export interface DiscountProfile {
  startDate: string;
  endDate: string;
  discountPercentage: number;
}

export interface FrequentCustomers {
  email: string;
  name: string;
  avgSales: number;
}


export async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
}

export async function fetchDiscounts() {
  const res = await fetch(`${API_URL}/discounts`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener descuentos");
  return res.json();
}

export async function fetchUsers() {
  const res = await fetch(`${API_URL}/persons`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener personas");
  return res.json();
}

export async function fetchProductById(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchTopSellingProducts() {
  const res = await fetch(`${API_URL}/sale-products/top-products`, { cache: "no-store" });

  if (!res.ok) throw new Error("Error al obtener los productos más vendidos");

  return res.json();
}

export async function fetchTopFrequentCustomers() {
  const response = await fetch(`${API_URL}/sales/top-frequent-customers`);

  if (!response.ok) throw new Error("Error al obtener los clientes más frecuentes");

  return response.json();
}

export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/persons/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error("Credenciales inválidas");

    // Guardamos usuario completo en localStorage
    const user = { name: data.person.name, role: data.role, email: data.person.email };
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("email", email);

    // Definir la ruta de redirección según el rol
    const redirectTo = data.role === "admin" ? "/reports" : "/sales";

    // ✅ Verificar si el usuario es un cliente frecuente
    const isFrequent = await checkFrequentBuyer(email);
    if (isFrequent) {
      localStorage.setItem("is_frequent", "true");
    } else {
      localStorage.removeItem("is_frequent");
    }

    return { success: true, redirectTo, message: "Login correcto" };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado";
    return { success: false, message: errorMessage };
  }
}

/**
 * Verifica si el usuario está en el top 5 de clientes frecuentes.
 * @param email Correo del usuario.
 * @returns `true` si el usuario es frecuente, `false` en caso contrario.
 */
async function checkFrequentBuyer(email: string): Promise<boolean> {
  try {
    console.log('test')
    const response = await fetch(`${API_URL}/sales/top-frequent-customers`);
    if (!response.ok) throw new Error("Error al obtener la lista de clientes frecuentes");

    const topCustomers = await response.json();
    return topCustomers.some((customer: FrequentCustomers) => customer.email === email);
  } catch (error) {
    console.error("Error verificando cliente frecuente:", error);
    return false;
  }
}

export async function registerUser(formData: {
  email: string;
  password: string;
  name: string;
  address: string;
  phone: string;
}) {
  try {
    const response = await fetch(`${API_URL}/persons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData,  isFrequentCustomer: false, role: "user" }), // Se fuerza el rol "user"
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al registrar usuario");
    }

    return { success: true, message: "Registro exitoso. Redirigiendo..." };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado";
    return { success: false, message: errorMessage };
  }
}

export async function fetchUserSales(email: string) {
  const res = await fetch(`${API_URL}/sales/person/${email}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  if (!res.ok) throw new Error("Error al obtener las compras");
  return res.json();
}

export async function fetchSaleProducts(saleId: number) {
  const res = await fetch(`${API_URL}/sale-products/sale/${saleId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  if (!res.ok) throw new Error("Error al obtener productos de la compra");
  return res.json();
}

export async function fetchSaleById(id: string) {
  const res = await fetch(`${API_URL}/sales/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchDiscount() {
  try {
    const response = await fetch(`${API_URL}/discounts/active`); // Ajusta la URL según tu backend
    if (response.status === 200) {
      const discount = await response.json();
      localStorage.setItem("discount", JSON.stringify(discount));
    } else {
      localStorage.removeItem("discount"); // Si no hay descuento, lo eliminamos
    }
  } catch (error) {
    console.error("Error obteniendo descuento:", error);
  }
};

export async function createSale(personEmail: string, discount: number) {
  const response = await fetch(`${API_URL}/sales`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ personEmail, discount }),
  });

  if (!response.ok) throw new Error("Error al crear la venta");

  const data = await response.json();
  return data.id; // Retorna el ID de la venta creada
}

export async function createSaleProduct(saleId: number, productId: number, quantity: number, unitPrice: number) {
  const response = await fetch(`${API_URL}/sale-products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sale_id: saleId, product_id: productId, quantity, unitPrice }),
  });

  if (!response.ok) throw new Error("Error al agregar producto a la venta");

  return response.json(); // Retorna la respuesta del backend
}

export async function fetchActiveProducts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/active`);
    if (!response.ok) {
      throw new Error("Error al obtener los productos activos");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en fetchActiveProducts:", error);
    return [];
  }
}

export const getPersonByEmail = async (email: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/persons/${email}`);

  if (!response.ok) {
    throw new Error("Error al obtener el perfil del usuario");
  }

  return response.json();
};

export const updatePerson = async (email: string, updatedData: Partial<UserProfile>) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/persons/${email}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el perfil");
  }

  return response.json();
};

export const updateProduct = async (id: number, updatedData: Partial<ProductProfile>) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el producto");
  }

  return response.json();
};

export const updateDiscount = async (id: number, updatedData: Partial<DiscountProfile>) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discounts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el descuento");
  }

  return response.json();
};