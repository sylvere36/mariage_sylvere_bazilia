'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, Users, Baby, CheckCircle, X } from 'lucide-react';
import { Guest, Table } from '@/lib/types';
import { createGuest, updateGuest, deleteGuest, cancelGuestArrival } from '@/app/actions';
import { formatTime } from '@/lib/utils';
import styles from '../admin.module.css';

interface GuestsClientPageProps {
  initialGuests: Guest[];
  initialTables: Table[];
}

export default function GuestsClientPage({ initialGuests, initialTables }: GuestsClientPageProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [tables] = useState<Table[]>(initialTables);
  const [isEditing, setIsEditing] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [filter, setFilter] = useState<'all' | 'arrived' | 'not-arrived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    places: 1,
    children: 0,
    tableId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingGuest) {
        await updateGuest(editingGuest.id, formData);
      } else {
        await createGuest({
          ...formData,
          arrived: false,
          arrivalTime: null,
        });
      }

      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur');
    }
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      places: guest.places,
      children: guest.children,
      tableId: guest.tableId,
    });
    setIsEditing(true);
  };

  const handleDelete = async (guestId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet invité ?')) {
      return;
    }

    try {
      await deleteGuest(guestId);
      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur');
    }
  };

  const handleCancelArrival = async (guestId: string) => {
    try {
      await cancelGuestArrival(guestId);
      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur');
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingGuest(null);
    setFormData({
      name: '',
      places: 1,
      children: 0,
      tableId: '',
    });
  };

  const filteredGuests = guests.filter(guest => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'arrived' ? guest.arrived :
      !guest.arrived;
    
    const matchesSearch = 
      !searchQuery ||
      guest.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

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
              Gestion des Invités
            </h1>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.input}
              style={{ flex: 1, minWidth: '250px' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className={filter === 'all' ? styles.button : `${styles.button} ${styles.buttonSecondary}`}
                onClick={() => setFilter('all')}
                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
              >
                Tous ({guests.length})
              </button>
              <button
                className={filter === 'arrived' ? styles.button : `${styles.button} ${styles.buttonSecondary}`}
                onClick={() => setFilter('arrived')}
                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
              >
                Arrivés ({guests.filter(g => g.arrived).length})
              </button>
              <button
                className={filter === 'not-arrived' ? styles.button : `${styles.button} ${styles.buttonSecondary}`}
                onClick={() => setFilter('not-arrived')}
                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
              >
                Non arrivés ({guests.filter(g => !g.arrived).length})
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Form */}
            <div className={styles.card} style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                {isEditing ? 'Modifier' : 'Nouvel'} Invité
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Nom complet</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={styles.input}
                  placeholder="Ex: Jean Dupont"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Places</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.places || ''}
                  onChange={(e) => setFormData({ ...formData, places: parseInt(e.target.value) || 1 })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Enfants</label>
                <input
                  type="number"
                  min="0"
                  value={formData.children || ''}
                  onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Table</label>
                <select
                  required
                  value={formData.tableId}
                  onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
                  className={styles.select}
                >
                  <option value="">Sélectionner une table</option>
                  {tables.sort((a, b) => a.number - b.number).map((table) => (
                    <option key={table.id} value={table.id}>
                      Table {table.number} - {table.name} ({table.currentCount}/{table.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className={styles.button} style={{ flex: 1 }}>
                  {isEditing ? 'Mettre à jour' : 'Créer'}
                </button>
                {isEditing && (
                  <button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={resetForm}>
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>

            {/* List */}
            <div>
              {filteredGuests.length > 0 ? (
              <div className={styles.card} style={{ overflowX: 'auto' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Table</th>
                      <th style={{ textAlign: 'center' }}>Places</th>
                      <th style={{ textAlign: 'center' }}>Enfants</th>
                      <th>Statut</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGuests.sort((a, b) => a.name.localeCompare(b.name)).map((guest) => {
                      const guestTable = tables.find(t => t.id === guest.tableId);
                      return (
                        <tr key={guest.id}>
                          <td>
                            <div style={{ fontWeight: '600' }}>
                              {guest.name}
                            </div>
                          </td>
                          <td>
                            {guestTable && (
                              <span className={`${styles.badge} ${styles.info}`}>
                                Table {guestTable.number}
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Users style={{ width: '14px', height: '14px' }} />
                              {guest.places}
                            </div>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Baby style={{ width: '14px', height: '14px' }} />
                              {guest.children}
                            </div>
                          </td>
                          <td>
                            {guest.arrived ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span className={`${styles.badge} ${styles.success}`}>
                                  <CheckCircle style={{ width: '12px', height: '12px' }} />
                                  Arrivé {guest.arrivalTime && formatTime(guest.arrivalTime)}
                                </span>
                                <button
                                  className={`${styles.iconButton} ${styles.danger}`}
                                  onClick={() => handleCancelArrival(guest.id)}
                                  title="Annuler l'arrivée"
                                >
                                  <X style={{ width: '14px', height: '14px' }} />
                                </button>
                              </div>
                            ) : (
                              <span className={`${styles.badge} ${styles.warning}`}>
                                En attente
                              </span>
                            )}
                          </td>
                          <td>
                            <div className={styles.actions} style={{ justifyContent: 'center' }}>
                              <button
                                className={styles.iconButton}
                                onClick={() => handleEdit(guest)}
                                title="Modifier"
                              >
                                <Edit style={{ width: '16px', height: '16px' }} />
                              </button>
                              <button
                                className={`${styles.iconButton} ${styles.danger}`}
                                onClick={() => handleDelete(guest.id)}
                                title="Supprimer"
                              >
                                <Trash2 style={{ width: '16px', height: '16px' }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>Aucun invité trouvé</p>
              </div>
            )}
            </div>
        </div>
      </div>
    </main>
  );
}
