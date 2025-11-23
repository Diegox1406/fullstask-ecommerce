const BASE = process.env.REACT_APP_API_URL || "";

async function request(path, opts = {}) {
  const headers = opts.headers || {};
  if (!(opts.body instanceof FormData))
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  else if (headers["Content-Type"]) delete headers["Content-Type"];
  const token = localStorage.getItem("token");
  if (token) headers["Authorization"] = `Bearer ${token}`;
  try {
    const res = await fetch(`${BASE}${path}`, { ...opts, headers });
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = text;
    }
    if (!res.ok) {
      const message =
        (data && data.message) || res.statusText || "Error desconocido";
      const error = new Error(message);
      error.status = res.status;
      throw error;
    }
    return data;
  } catch (error) {
    console.error(`Error en la petición a ${path}:`, error);
    throw error;
  }
}

// Auth
export async function authLogin(email, password) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
export async function authRegister(name, email, password) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

// Products (Lectura)
export async function getAllProducts() {
  return request("/api/products");
}
export async function getNewProducts() {
  return request("/api/products/nuevos");
}
export async function getUsedProducts() {
  return request("/api/products/usados");
}
export async function getRefurbishedProducts() {
  return request("/api/products/reacondicionados");
}
export async function getExhibitionProducts() {
  return request("/api/products/exhibicion");
}
export async function getProductById(id) {
  return request(`/api/products/${id}`);
}
export async function getAccessories() {
  return request("/api/products/accesorios");
}
export async function getOffers() {
  return request("/api/products/ofertas");
}

export async function searchProducts(query) {
  return request(`/api/products/search?q=${encodeURIComponent(query)}`);
}

// Promociones (Lectura)
export async function getAllPromotions() {
  return request("/api/promotions");
}
export async function getPromotionById(id) {
  return request(`/api/promotions/${id}`);
}
export async function getPromotions() {
  return request("/api/promotions");
} // Alias para getAllPromotions

// Promociones (CRUD)

export async function createPromotion(promotionData) {
  const isFormData = promotionData instanceof FormData;
  return request("/api/admin/promotions", {
    method: "POST",
    body: isFormData ? promotionData : JSON.stringify(promotionData),
  });
}

export async function updatePromotion(id, promotionData) {
  const isFormData = promotionData instanceof FormData;
  return request(`/api/admin/promotions/${id}`, {
    method: "PUT",
    body: isFormData ? promotionData : JSON.stringify(promotionData),
  });
}

export async function deletePromotion(id) {
  return request(`/api/admin/promotions/${id}`, { method: "DELETE" });
}

// Products (Admin CRUD)

export async function createProduct(productData) {
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  formData.append("category", productData.category);
  formData.append("condicion", productData.condicion);
  formData.append("stock", productData.stock);

  if (productData.oferta !== undefined)
    formData.append("oferta", productData.oferta);
  if (productData.precioOferta !== undefined)
    formData.append("precioOferta", productData.precioOferta);
  if (productData.estado !== undefined)
    formData.append("estado", productData.estado);

  if (productData.image) formData.append("image", productData.image);

  return request("/api/admin/products", {
    method: "POST",
    body: formData,
  });
}

// ---

export async function updateProduct(id, productData) {
  if (productData.image instanceof File) {
    const formData = new FormData();

    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    return request(`/api/admin/products/${id}`, {
      method: "PUT",
      body: formData,
    });
  }

  const payloadConCadenas = { ...productData };

  if (payloadConCadenas.oferta !== undefined) {
    payloadConCadenas.oferta = String(payloadConCadenas.oferta);
  }
  if (payloadConCadenas.estado !== undefined) {
    payloadConCadenas.estado = String(payloadConCadenas.estado);
  }
  if (payloadConCadenas.precioOferta !== undefined) {
    payloadConCadenas.precioOferta = String(payloadConCadenas.precioOferta);
  }
  if (payloadConCadenas.price !== undefined) {
    payloadConCadenas.price = String(payloadConCadenas.price);
  }
  if (payloadConCadenas.stock !== undefined) {
    payloadConCadenas.stock = String(payloadConCadenas.stock);
  }

  return request(`/api/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payloadConCadenas),
  });
}

// ---

export async function deleteProduct(id) {
  return request(`/api/admin/products/${id}`, { method: "DELETE" });
}

// Cotizaciones
export async function createCotizacion(cotizacionData) {
  return request("/api/admin/cotizacion", {
    method: "POST",
    body: JSON.stringify(cotizacionData),
  });
}

export async function getAllCotizaciones() {
  return request("/api/cotizaciones"); // Remove "/admin" from the path
}

export async function getCotizacionById(id) {
  return request(`/api/admin/cotizacion/${id}`);
}

export async function updateCotizacion(id, cotizacionData) {
  return request(`/api/admin/cotizacion/${id}`, {
    method: "PUT",
    body: JSON.stringify(cotizacionData),
  });
}

export async function deleteCotizacion(id) {
  return request(`/api/admin/cotizacion/${id}`, {
    method: "DELETE",
  });
}

// Utilities
export function isAdmin() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.isAdmin === true;
}
export function getUserInfo() {
  return JSON.parse(localStorage.getItem("user"));
}

export default request;
