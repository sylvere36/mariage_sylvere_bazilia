import { getTables, getGuests } from '@/lib/db';
import OverviewPublicClient from './overview-public-client';

export default async function OverviewPublicPage() {
  const [tables, guests] = await Promise.all([getTables(), getGuests()]);
  
  return <OverviewPublicClient initialTables={tables} initialGuests={guests} />;
}
