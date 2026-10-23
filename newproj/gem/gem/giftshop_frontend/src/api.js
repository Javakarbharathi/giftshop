import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = () => axios.get(`${API_URL}catalog/products/`);
export const getCategories = () => axios.get(`${API_URL}catalog/categories/`);
// Add this new line:
export const getProduct = (id) => axios.get(`${API_URL}catalog/products/${id}/`);