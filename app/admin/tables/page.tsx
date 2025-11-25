import { getTables } from '@/lib/blob';
import TablesClientPage from './tables-client';

//dd
export default async function TablesPage() {
  const tables = await getTables();
  
  return <TablesClientPage initialTables={tables} />;
}
