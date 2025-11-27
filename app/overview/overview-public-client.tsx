'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronUp, Users, Baby, CheckCircle, Clock, Heart } from 'lucide-react';
import { Guest, Table } from '@/lib/types';
import styles from '../page.module.css';

interface OverviewPublicClientProps {
  initialTables: Table[];
  initialGuests: Guest[];
}

export default function OverviewPublicClient({ initialTables, initialGuests }: OverviewPublicClientProps) {
  const [tables] = useState<Table[]>(initialTables);
  const [guests] = useState<Guest[]>(initialGuests);
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  const toggleTable = (tableId: string) => {
    setExpandedTables(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tableId)) {
        newSet.delete(tableId);
      } else {
        newSet.add(tableId);
      }
      return newSet;
    });
  };

  const totalGuests = guests.length;
  const totalArrived = guests.filter(g => g.arrived).length;
  const totalPlaces = guests.reduce((sum, g) => sum + g.places, 0);
  const totalChildren = guests.reduce((sum, g) => sum + g.children, 0);
  const arrivedPlaces = guests.filter(g => g.arrived).reduce((sum, g) => sum + g.places, 0);
  const remainingPlaces = totalPlaces - arrivedPlaces;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Heart className={styles.iconTop} fill="currentColor" />
          <h1 className={`${styles.title} font-pacifico`}>
            Sylvère & Bazialia
          </h1>
          <div className={styles.divider}></div>
          
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '1rem auto 2rem'
            }}>
              <ArrowLeft style={{ width: '20px', height: '20px' }} />
              Retour à la recherche
            </button>
          </Link>
        </div>

        {/* Stats globales */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem',
          maxWidth: '900px',
          margin: '0 auto 2rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#d97706' }}>{totalGuests}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Invités</div>
          </div>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#059669' }}>{totalArrived}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Arrivés</div>
          </div>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2563eb' }}>{totalPlaces}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Places</div>
          </div>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#dc2626' }}>{remainingPlaces}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Non arrivées</div>
          </div>
        </div>

        {/* Accordion des tables */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
          {tables.sort((a, b) => a.number - b.number).map((table) => {
            const tableGuests = guests.filter(g => g.tableId === table.id);
            const isExpanded = expandedTables.has(table.id);
            const arrivedCount = tableGuests.filter(g => g.arrived).length;
            const totalTablePlaces = tableGuests.reduce((sum, g) => sum + g.places, 0);
            const arrivedTablePlaces = tableGuests.filter(g => g.arrived).reduce((sum, g) => sum + g.places, 0);
            const totalTableChildren = tableGuests.reduce((sum, g) => sum + g.children, 0);
            const remainingTablePlaces = totalTablePlaces - arrivedTablePlaces;

            return (
              <div key={table.id} style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}>
                {/* Header */}
                <button
                  onClick={() => toggleTable(table.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)',
                        color: 'white',
                        fontSize: '1.125rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontWeight: '700'
                      }}>
                        {table.number}
                      </span>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: '#111827' }}>{table.name}</h3>
                    </div>
                    {table.description && (
                      <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{table.description}</p>
                    )}

                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                        <span>{tableGuests.length} invités</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle style={{ width: '16px', height: '16px', color: '#059669' }} />
                        <span>{arrivedCount} arrivés ({arrivedTablePlaces} places)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock style={{ width: '16px', height: '16px', color: '#d97706' }} />
                        <span>{remainingTablePlaces} places non arrivées</span>
                      </div>
                      {totalTableChildren > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Baby style={{ width: '16px', height: '16px', color: '#7c3aed' }} />
                          <span>{totalTableChildren} enfants</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ marginLeft: '1rem' }}>
                    {isExpanded ? (
                      <ChevronUp style={{ width: '24px', height: '24px', color: '#6b7280' }} />
                    ) : (
                      <ChevronDown style={{ width: '24px', height: '24px', color: '#6b7280' }} />
                    )}
                  </div>
                </button>

                {/* Liste des invités */}
                {isExpanded && tableGuests.length > 0 && (
                  <div style={{ borderTop: '1px solid #e5e7eb', padding: '1rem' }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Nom</th>
                            <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600' }}>Places</th>
                            <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600' }}>Enfants</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableGuests.sort((a, b) => a.name.localeCompare(b.name)).map((guest) => (
                            <tr key={guest.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '0.75rem', fontWeight: '600' }}>{guest.name}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'center' }}>{guest.places}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'center' }}>{guest.children}</td>
                              <td style={{ padding: '0.75rem' }}>
                                {guest.arrived ? (
                                  <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    background: '#d1fae5',
                                    color: '#065f46',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600'
                                  }}>
                                    <CheckCircle style={{ width: '12px', height: '12px' }} />
                                    Arrivé
                                  </span>
                                ) : (
                                  <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    background: '#fef3c7',
                                    color: '#92400e',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600'
                                  }}>
                                    En attente
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {isExpanded && tableGuests.length === 0 && (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#9ca3af', fontStyle: 'italic' }}>
                    Aucun invité assigné à cette table
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
