import Link from 'next/link';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { getGuests, getTables } from '@/lib/db';
import styles from '../admin.module.css';

export default async function ExportPage() {
  const [guests, tables] = await Promise.all([getGuests(), getTables()]);

  const totalGuests = guests.length;
  const arrivedGuests = guests.filter(g => g.arrived).length;

  return (
    <main className={styles.container}>
      <div className={styles.content} style={{ maxWidth: '900px' }}>
        <div className={styles.header}>
          <div>
            <Link href="/admin" style={{ textDecoration: 'none' }}>
              <button className={`${styles.button} ${styles.buttonSecondary} ${styles.buttonSmall}`} style={{ marginBottom: '1rem' }}>
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                Retour
              </button>
            </Link>
            <h1 className={styles.title}>
              <FileText className={styles.icon} />
              Exporter en PDF
            </h1>
          </div>
        </div>

        <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Aperçu du document</h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Le PDF contiendra les informations suivantes</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1.5rem', background: '#fef3c7', borderRadius: '0.75rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total invités</p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#d97706' }}>{totalGuests}</p>
            </div>
            <div style={{ padding: '1.5rem', background: '#d1fae5', borderRadius: '0.75rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Arrivés</p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#059669' }}>{arrivedGuests}</p>
            </div>
            <div style={{ padding: '1.5rem', background: '#fed7aa', borderRadius: '0.75rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Tables</p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#ea580c' }}>{tables.length}</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '1.125rem' }}>Contenu du PDF :</h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.8' }}>
              <li>En-tête avec le titre et la date de l'événement</li>
              <li>Statistiques globales (invités, arrivées, tables)</li>
              <li>Liste détaillée par table avec :
                <ul style={{ listStyleType: 'circle', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                  <li>Numéro et nom de la table</li>
                  <li>Description de la table</li>
                  <li>Occupation (places utilisées / capacité)</li>
                  <li>Liste des invités avec places et enfants</li>
                  <li>Statut d'arrivée pour chaque invité</li>
                </ul>
              </li>
              <li>Horodatage de génération du document</li>
            </ul>
          </div>

          <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
            <a href="/api/export/pdf" download style={{ textDecoration: 'none' }}>
              <button className={styles.button} style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                <Download style={{ width: '20px', height: '20px' }} />
                Télécharger le PDF
              </button>
            </a>
          </div>
        </div>

        <div className={styles.card}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', background: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '1.25rem' }}>💡</span>
            </div>
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Conseil</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>
                Le PDF est généré en temps réel avec les données actuelles. 
                Vous pouvez le télécharger autant de fois que nécessaire pour avoir 
                une version à jour de la liste des invités.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
