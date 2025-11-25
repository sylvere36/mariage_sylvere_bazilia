import { getTables } from '@/lib/blob';
import TablesClientPage from './tables-client';

export default async function TablesPage() {
  const tables = await getTables();
  
  return <TablesClientPage initialTables={tables} />;
}
