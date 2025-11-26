import { Guest, Table } from './types';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #d97706',
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    color: '#d97706',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  tableSection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#fffbeb',
    borderRadius: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '1 solid #fcd34d',
  },
  tableNumber: {
    width: 40,
    height: 40,
    backgroundColor: '#d97706',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  tableName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  tableDescription: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
  },
  tableCapacity: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 8,
  },
  guestList: {
    marginTop: 10,
  },
  guestRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottom: '0.5 solid #fde68a',
  },
  guestName: {
    fontSize: 11,
    flex: 1,
    color: '#1f2937',
  },
  guestInfo: {
    fontSize: 10,
    color: '#6b7280',
    marginLeft: 10,
  },
  arrivedBadge: {
    backgroundColor: '#10b981',
    color: 'white',
    fontSize: 8,
    padding: '2 6',
    borderRadius: 4,
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#9ca3af',
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
  },
  stats: {
    marginTop: 20,
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d97706',
  },
  statLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
  },
});

interface PDFDocumentProps {
  tables: Table[];
  guests: Guest[];
}

function GuestListPDF({ tables, guests }: PDFDocumentProps) {
  const totalGuests = guests.length;
  const arrivedGuests = guests.filter(g => g.arrived).length;
  const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);
  const usedCapacity = tables.reduce((sum, t) => sum + t.currentCount, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Liste des Invités par Table</Text>
          <Text style={styles.subtitle}>Mariage Sylvère & Bazilia - 29 Novembre 2025</Text>
          <Text style={styles.subtitle}>Salle Elim - Zone des Ambassades</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalGuests}</Text>
              <Text style={styles.statLabel}>Invités</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{arrivedGuests}</Text>
              <Text style={styles.statLabel}>Arrivés</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{tables.length}</Text>
              <Text style={styles.statLabel}>Tables</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{usedCapacity}/{totalCapacity}</Text>
              <Text style={styles.statLabel}>Capacité</Text>
            </View>
          </View>
        </View>

        {tables.sort((a, b) => a.number - b.number).map((table) => {
          const tableGuests = guests.filter(g => g.tableId === table.id);
          
          return (
            <View key={table.id} style={styles.tableSection} wrap={false}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableNumber}>{table.number}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tableName}>{table.name}</Text>
                  {table.description && (
                    <Text style={styles.tableDescription}>{table.description}</Text>
                  )}
                  <Text style={styles.tableCapacity}>
                    {table.currentCount} / {table.capacity} places occupées
                  </Text>
                </View>
              </View>

              <View style={styles.guestList}>
                {tableGuests.length === 0 ? (
                  <Text style={{ fontSize: 10, color: '#9ca3af', fontStyle: 'italic' }}>
                    Aucun invité assigné
                  </Text>
                ) : (
                  tableGuests.map((guest) => (
                    <View key={guest.id} style={styles.guestRow}>
                      <Text style={styles.guestName}>
                        {guest.name}
                      </Text>
                      <Text style={styles.guestInfo}>
                        {guest.places} {guest.places > 1 ? 'places' : 'place'}
                      </Text>
                      {guest.children > 0 && (
                        <Text style={styles.guestInfo}>
                          {guest.children} {guest.children > 1 ? 'enfants' : 'enfant'}
                        </Text>
                      )}
                      {guest.arrived && (
                        <Text style={styles.arrivedBadge}>Arrivé</Text>
                      )}
                    </View>
                  ))
                )}
              </View>
            </View>
          );
        })}

        <Text style={styles.footer}>
          Document généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
        </Text>
      </Page>
    </Document>
  );
}

export async function generateGuestListPDF(tables: Table[], guests: Guest[]): Promise<Blob> {
  const doc = <GuestListPDF tables={tables} guests={guests} />;
  const asPdf = pdf(doc);
  return await asPdf.toBlob();
}
