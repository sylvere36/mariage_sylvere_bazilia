'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './search-box.module.css';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  onSuggestionSelect?: (query: string) => void;
}

interface Suggestion {
  id: string;
  text: string;
  type: 'name';
}

export function SearchBox({ onSearch, onSuggestionSelect }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        const newSuggestions: Suggestion[] = [];
        
        if (data.similar && data.similar.length > 0) {
          data.similar.forEach((guest: any) => {
            newSuggestions.push({
              id: guest.id,
              text: guest.name,
              type: 'name'
            });
          });
        }

        setSuggestions(newSuggestions);
        setShowSuggestions(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(query);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion.text);
    } else {
      onSearch(suggestion.text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={styles.searchContainer}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Rechercher par nom..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              className={styles.searchInput}
              autoFocus
            />
          </div>
          <button 
            type="submit" 
            className={styles.searchButton}
          >
            Rechercher
          </button>
        </div>
      </form>

      {showSuggestions && (
        <div className={styles.suggestions}>
          {isLoading ? (
            <div className={styles.suggestionItem} style={{ justifyContent: 'center' }}>
              <span>Recherche en cours...</span>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                type="button"
                className={`${styles.suggestionItem} ${index === selectedIndex ? styles.suggestionActive : ''}`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className={styles.suggestionIcon}>👤</span>
                <span className={styles.suggestionText}>{suggestion.text}</span>
              </button>
            ))
          ) : (
            <div className={styles.suggestionItem} style={{ justifyContent: 'center' }}>
              <span>Aucun invité trouvé</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
