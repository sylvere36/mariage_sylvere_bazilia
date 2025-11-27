import { getTables, getGuests } from '@/lib/db';
import OverviewClientPage from './overview-client';

export default async function OverviewPage() {
  const [tables, guests] = await Promise.all([getTables(), getGuests()]);
  
  return <OverviewClientPage initialTables={tables} initialGuests={guests} />;
}
