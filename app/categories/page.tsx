"use client";

import { useState, useEffect } from 'react';
import CategoryList from '@/components/CategoryList';
import CategoryForm from '@/components/CategoryForm';
import { Category } from '@/lib/types';
import { getCategories, addCategory, deleteCategory } from '@/lib/api';


export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (category: Category) => {
    await addCategory(category);
    fetchCategories();
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
    fetchCategories();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
      <CategoryForm onAdd={handleAddCategory} />
      <CategoryList categories={categories} onDelete={handleDeleteCategory} />
    </div>
  );
}
