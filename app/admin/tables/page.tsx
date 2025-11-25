import { getTables } from '@/lib/blob';
import TablesClientPage from './tables-client';

export const dynamic = 'force-dynamic';

//dd
export default async function TablesPage() {
  const tables = await getTables();
  
  return <TablesClientPage initialTables={tables} />;
}
