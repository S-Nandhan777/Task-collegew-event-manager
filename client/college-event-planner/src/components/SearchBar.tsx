import { useState } from 'react';
import styles from '../styles/SearchBar.module.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <>
      <h3>Search Event
      </h3>
       <div className={styles.searchBar}>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search events..."
        className={styles.searchInput}
      />
    </div>
    </>
   
  );
}