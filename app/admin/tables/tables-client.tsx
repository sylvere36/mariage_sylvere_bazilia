'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, Users } from 'lucide-react';
import { Table } from '@/lib/types';
import { createTable, updateTable, deleteTable } from '@/app/actions';
import styles from '../admin.module.css';

interface TablesClientPageProps {
  initialTables: Table[];
}

export default function TablesClientPage({ initialTables }: TablesClientPageProps) {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    number: 0,
    description: '',
    capacity: 10,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (editingTable) {
        await updateTable(editingTable.id, formData);
        // Recharger la page pour voir les changements
        window.location.reload();
      } else {
        await createTable(formData);
        // Recharger la page pour voir les changements
        window.location.reload();
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur');
      setIsSubmitting(false);
    }
  };

  const handleEdit = (table: Table) => {
    setEditingTable(table);
    setFormData({
      name: table.name,
      number: table.number,
      description: table.description,
      capacity: table.capacity,
    });
    setIsEditing(true);
  };

  const handleDelete = async (tableId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette table ?')) {
      return;
    }

    try {
      await deleteTable(tableId);
      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur');
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingTable(null);
    setFormData({
      name: '',
      number: 0,
      description: '',
      capacity: 10,
    });
  };

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
              Gestion des Tables
            </h1>
          </div>
        </div>

        <div className={styles.twoColumnLayout}>
            {/* Form */}
            <div className={`${styles.card} ${styles.stickyForm}`}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  {isEditing ? 'Modifier' : 'Nouvelle'} Table
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Numéro</label>
                  <input
                    type="number"
                    required
                    value={formData.number || ''}
                    onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || 0 })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Nom</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Capacité (max 10)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 10 })}
                    className={styles.input}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" className={styles.button} style={{ flex: 1 }} disabled={isSubmitting}>
                    {isSubmitting ? 'En cours...' : (isEditing ? 'Mettre à jour' : 'Créer')}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tables.sort((a, b) => a.number - b.number).map((table) => (
                  <div key={table.id} className={styles.card}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                          <span className={`${styles.badge} ${styles.primary}`} style={{ fontSize: '1.125rem', padding: '0.5rem 1rem' }}>
                            {table.number}
                          </span>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{table.name}</h3>
                        </div>
                        
                        {table.description && (
                          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{table.description}</p>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Users style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              {table.currentCount} / {table.capacity}
                            </span>
                          </div>
                          <div style={{ flex: 1, maxWidth: '300px' }}>
                            <div className={styles.progressBar}>
                              <div 
                                className={styles.progressFill}
                                style={{ width: `${(table.currentCount / table.capacity) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={styles.actions}>
                        <button 
                          className={styles.iconButton}
                          onClick={() => handleEdit(table)}
                          title="Modifier"
                        >
                          <Edit style={{ width: '18px', height: '18px' }} />
                        </button>
                        <button 
                          className={`${styles.iconButton} ${styles.danger}`}
                          onClick={() => handleDelete(table.id)}
                          title="Supprimer"
                        >
                          <Trash2 style={{ width: '18px', height: '18px' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {tables.length === 0 && (
                  <div className={styles.emptyState}>
                    <p>Aucune table créée</p>
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>
    </main>
  );
}
