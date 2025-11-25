'use client';

import { useState, useEffect } from 'react';
import { SearchBox } from '@/components/search-box';
import { GuestCard } from '@/components/guest-card';
import { GuestList } from '@/components/guest-list';
import { Guest, Table } from '@/lib/types';
import { Heart } from 'lucide-react';
import styles from './page.module.css';

export default function HomePage() {
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [similarGuests, setSimilarGuests] = useState<Guest[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  useEffect(() => {
    // Polling pour refresh automatique
    const interval = setInterval(() => {
      if (selectedGuest) {
        fetch(`/api/guest/${selectedGuest.id}`)
          .then(res => res.json())
          .then(data => {
            if (data.guest) {
              setSelectedGuest(data.guest);
              setSelectedTable(data.table);
            }
          })
          .catch(console.error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedGuest]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSelectedGuest(null);
      setSimilarGuests([]);
      return;
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.exactMatch) {
        setSelectedGuest(data.exactMatch);
        setSelectedTable(data.table);
        setSimilarGuests([]);
      } else {
        setSelectedGuest(null);
        setSelectedTable(null);
        setSimilarGuests(data.similar || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSelectGuest = async (guest: Guest) => {
    const response = await fetch(`/api/guest/${guest.id}`);
    const data = await response.json();
    
    setSelectedGuest(data.guest);
    setSelectedTable(data.table);
    setSimilarGuests([]);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Heart className={styles.iconTop} fill="currentColor" />
          <h1 className={`${styles.title} font-pacifico`}>
            Sylvère & Bazilia
          </h1>
          <div className={styles.divider}></div>
          
          <div className={styles.dateInfo}>
            <p className={styles.date}>29 Novembre 2025</p>
            <p className={styles.location}>Salle Elim - Zone des Ambassades</p>
          </div>
        </div>

        {/* Search Section */}
        <div className={styles.searchSection}>
          <SearchBox onSearch={handleSearch} />
        </div>

        {/* Results */}
        <div className={styles.resultsSection}>
          {selectedGuest && selectedTable && (
            <GuestCard guest={selectedGuest} table={selectedTable} />
          )}

          {!selectedGuest && similarGuests.length > 0 && (
            <GuestList guests={similarGuests} onSelectGuest={handleSelectGuest} />
          )}

         
        </div>
      </div>
    </main>
  );
}
