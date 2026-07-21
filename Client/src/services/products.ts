import { api } from './api';

export const getAllProducts = async () => {
  const { data } = await api.get('/vendor/products');

  return data;
};

export const createProductFull = async (formData: FormData) => {
  const { data } = await api.post('/vendor/products/full', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get('/vendor/categories');
  return data;
};


