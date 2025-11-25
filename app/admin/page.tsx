import Link from 'next/link';
import { getGuests, getTables } from '@/lib/blob';
import { Users, Table as TableIcon, CheckCircle, FileText, ArrowLeft } from 'lucide-react';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [guests, tables] = await Promise.all([getGuests(), getTables()]);

  const totalGuests = guests.length;
  const arrivedGuests = guests.filter(g => g.arrived).length;
  const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);
  const usedCapacity = tables.reduce((sum, t) => sum + t.currentCount, 0);

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <button className={`${styles.button} ${styles.buttonSecondary} ${styles.buttonSmall}`} style={{ marginBottom: '1rem' }}>
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                Retour à l'accueil
              </button>
            </Link>
            <h1 className={styles.title}>
              <Users className={styles.icon} />
              Administration
            </h1>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statInfo}>
                <h3>Total Invités</h3>
                <div className={styles.statValue}>{totalGuests}</div>
              </div>
              <div className={`${styles.statIcon} ${styles.primary}`}>
                <Users style={{ width: '24px', height: '24px' }} />
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statInfo}>
                <h3>Arrivés</h3>
                <div className={styles.statValue}>{arrivedGuests}</div>
              </div>
              <div className={`${styles.statIcon} ${styles.success}`}>
                <CheckCircle style={{ width: '24px', height: '24px' }} />
              </div>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${totalGuests > 0 ? (arrivedGuests / totalGuests) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statInfo}>
                <h3>Tables</h3>
                <div className={styles.statValue}>{tables.length}</div>
              </div>
              <div className={`${styles.statIcon} ${styles.primary}`}>
                <TableIcon style={{ width: '24px', height: '24px' }} />
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statInfo}>
                <h3>Capacité</h3>
                <div className={styles.statValue}>{usedCapacity}/{totalCapacity}</div>
              </div>
              <div className={`${styles.statIcon} ${styles.warning}`}>
                <Users style={{ width: '24px', height: '24px' }} />
              </div>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <Link href="/admin/tables" style={{ textDecoration: 'none' }}>
            <div className={styles.card} style={{ cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }}>
              <TableIcon style={{ width: '48px', height: '48px', color: '#d97706', marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>Gérer les Tables</h2>
              <p style={{ color: '#6b7280' }}>Créer, modifier et supprimer des tables</p>
            </div>
          </Link>

          <Link href="/admin/guests" style={{ textDecoration: 'none' }}>
            <div className={styles.card} style={{ cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }}>
              <Users style={{ width: '48px', height: '48px', color: '#d97706', marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>Gérer les Invités</h2>
              <p style={{ color: '#6b7280' }}>Ajouter, modifier et supprimer des invités</p>
            </div>
          </Link>

          <Link href="/admin/export" style={{ textDecoration: 'none' }}>
            <div className={styles.card} style={{ cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }}>
              <FileText style={{ width: '48px', height: '48px', color: '#d97706', marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>Exporter PDF</h2>
              <p style={{ color: '#6b7280' }}>Télécharger la liste des invités par table</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
