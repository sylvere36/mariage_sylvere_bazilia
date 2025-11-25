'use client';

import { Guest, Table } from '@/lib/types';
import { CheckCircle, Users, Baby, MapPin } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { markGuestArrived } from '@/app/actions';
import { useState } from 'react';
import styles from './guest-card.module.css';

interface GuestCardProps {
  guest: Guest;
  table: Table | null;
}

export function GuestCard({ guest, table }: GuestCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMarkArrived = async () => {
    if (guest.arrived) return;
    
    setIsSubmitting(true);
    try {
      await markGuestArrived(guest.id);
    } catch (error) {
      console.error('Error marking guest as arrived:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.guestName}>
          {guest.firstname} {guest.lastname}
        </h2>
        {guest.arrived && (
          <span className={styles.arrivedBadge}>
            <CheckCircle style={{ width: '16px', height: '16px' }} />
            Arrivé à {formatTime(guest.arrivalTime!)}
          </span>
        )}
      </div>
      
      <div className={styles.content}>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <Users className={styles.infoIcon} />
            <div>
              <p className={styles.infoLabel}>Places</p>
              <p className={styles.infoValue}>{guest.places}</p>
            </div>
          </div>
          
          <div className={styles.infoItem}>
            <Baby className={styles.infoIcon} />
            <div>
              <p className={styles.infoLabel}>Enfants</p>
              <p className={styles.infoValue}>{guest.children}</p>
            </div>
          </div>
        </div>

        {table && (
          <div className={styles.tableInfo}>
            <div className={styles.tableHeader}>
              <MapPin className={styles.tableIcon} />
              <div className={styles.tableDetails}>
                <p className={styles.tableName}>
                  Table {table.number} - {table.name}
                </p>
                {table.description && (
                  <p className={styles.tableDescription}>{table.description}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {!guest.arrived ? (
          <button 
            onClick={handleMarkArrived}
            disabled={isSubmitting}
            className={styles.arriveButton}
          >
            <CheckCircle className={styles.buttonIcon} />
            {isSubmitting ? 'Validation en cours...' : 'Marquer comme arrivé'}
          </button>
        ) : (
          <div className={styles.alreadyArrived}>
            <CheckCircle className={styles.checkIcon} />
            <p className={styles.alreadyArrivedTitle}>Déjà validé</p>
            <p className={styles.alreadyArrivedTime}>
              Arrivée enregistrée à {formatTime(guest.arrivalTime!)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
