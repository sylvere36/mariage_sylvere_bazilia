'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronUp, Users, Baby, CheckCircle, Clock } from 'lucide-react';
import { Guest, Table } from '@/lib/types';
import styles from '../admin.module.css';

interface OverviewClientPageProps {
  initialTables: Table[];
  initialGuests: Guest[];
}

export default function OverviewClientPage({ initialTables, initialGuests }: OverviewClientPageProps) {
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
  const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <Link href="/admin" style={{ textDecoration: 'none' }}>
              <button className={`${styles.button} ${styles.buttonSecondary} ${styles.buttonSmall}`} style={{ marginBottom: '1rem' }}>
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                Retour
              </button>
            </Link>
            <h1 className={styles.title}>
              <Users className={styles.icon} />
              Vue d'ensemble des tables
            </h1>
          </div>
        </div>

        {/* Stats globales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className={styles.card}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#d97706' }}>{totalGuests}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Invités total</div>
            </div>
          </div>
          <div className={styles.card}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#059669' }}>{totalArrived}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Arrivés</div>
            </div>
          </div>
          <div className={styles.card}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2563eb' }}>{totalPlaces}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Places adultes</div>
            </div>
          </div>
          <div className={styles.card}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#7c3aed' }}>{totalChildren}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Enfants</div>
            </div>
          </div>
          <div className={styles.card}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#dc2626' }}>
                {totalCapacity - totalPlaces}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Places restantes</div>
            </div>
          </div>
        </div>

        {/* Accordion des tables */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tables.sort((a, b) => a.number - b.number).map((table) => {
            const tableGuests = guests.filter(g => g.tableId === table.id);
            const isExpanded = expandedTables.has(table.id);
            const arrivedCount = tableGuests.filter(g => g.arrived).length;
            const totalTablePlaces = tableGuests.reduce((sum, g) => sum + g.places, 0);
            const totalTableChildren = tableGuests.reduce((sum, g) => sum + g.children, 0);
            const remainingPlaces = table.capacity - totalTablePlaces;
            const fillPercentage = (totalTablePlaces / table.capacity) * 100;

            return (
              <div key={table.id} className={styles.card}>
                {/* Header */}
                <button
                  onClick={() => toggleTable(table.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                      <span className={`${styles.badge} ${styles.primary}`} style={{ fontSize: '1.125rem', padding: '0.5rem 1rem' }}>
                        {table.number}
                      </span>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>{table.name}</h3>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                        <span>{tableGuests.length} invités</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle style={{ width: '16px', height: '16px', color: '#059669' }} />
                        <span>{arrivedCount} arrivés</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock style={{ width: '16px', height: '16px', color: '#d97706' }} />
                        <span>{tableGuests.length - arrivedCount} en attente</span>
                      </div>
                      {totalTableChildren > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Baby style={{ width: '16px', height: '16px', color: '#7c3aed' }} />
                          <span>{totalTableChildren} enfants</span>
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {totalTablePlaces} / {table.capacity} places
                        </span>
                        <span style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '600',
                          color: remainingPlaces <= 0 ? '#dc2626' : remainingPlaces <= 2 ? '#d97706' : '#059669'
                        }}>
                          ({remainingPlaces} {remainingPlaces > 1 ? 'restantes' : 'restante'})
                        </span>
                      </div>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill}
                          style={{ 
                            width: `${Math.min(fillPercentage, 100)}%`,
                            backgroundColor: fillPercentage > 100 ? '#dc2626' : fillPercentage > 90 ? '#d97706' : '#d97706'
                          }}
                        ></div>
                      </div>
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
                  <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', margin: '0 1rem 1rem 1rem' }}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th style={{ textAlign: 'center' }}>Places</th>
                          <th style={{ textAlign: 'center' }}>Enfants</th>
                          <th>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableGuests.sort((a, b) => a.name.localeCompare(b.name)).map((guest) => (
                          <tr key={guest.id}>
                            <td style={{ fontWeight: '600' }}>{guest.name}</td>
                            <td style={{ textAlign: 'center' }}>{guest.places}</td>
                            <td style={{ textAlign: 'center' }}>{guest.children}</td>
                            <td>
                              {guest.arrived ? (
                                <span className={`${styles.badge} ${styles.success}`}>
                                  <CheckCircle style={{ width: '12px', height: '12px' }} />
                                  Arrivé
                                </span>
                              ) : (
                                <span className={`${styles.badge} ${styles.warning}`}>
                                  En attente
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
