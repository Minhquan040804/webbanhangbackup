// api.js
const API_URL = 'http://localhost:3000/products';

export async function getAllProducts() {
    const response = await axios.get(API_URL);
    return response.data;
}

export async function createProduct(productData) {
    const response = await axios.post(API_URL, productData);
    return response.data;
}

export async function getProductById(id) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
}

export async function updateProduct(id, productData) {
    const response = await axios.put(`${API_URL}/${id}`, productData);
    return response.data;
}

export async function deleteProduct(id) {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
}