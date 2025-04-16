import { useEffect, useState } from 'react';
import api from '../services/api';
import { Category } from '../types';
import styles from '../styles/FilterPanel.module.css';

interface FilterPanelProps {
  filters: number[];
  setFilters: (filters: number[]) => void;
}

export default function FilterPanel({ filters, setFilters }: FilterPanelProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get<Category[]>('/categories').then(response => setCategories(response.data));
  }, []);

  return (
    <>
      <h3>Filter by Category</h3>
        <div className={styles.filterPanel}>
      
      {categories.map(cat => (
        <label key={cat.category_id} className={styles.filterLabel}>
          <input
            type="checkbox"
            checked={filters.includes(cat.category_id)}
            onChange={(e) => {
              const newFilters = e.target.checked
                ? [...filters, cat.category_id]
                : filters.filter(id => id !== cat.category_id);
              setFilters(newFilters);
            }}
          /> {cat.name}
        </label>
      ))}
    </div>
    </>
  
  );
}