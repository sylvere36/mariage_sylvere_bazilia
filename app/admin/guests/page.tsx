import { getGuests, getTables } from '@/lib/blob';
import GuestsClientPage from './guests-client';

export const dynamic = 'force-dynamic';

export default async function GuestsPage() {
  const [guests, tables] = await Promise.all([getGuests(), getTables()]);
  
  return <GuestsClientPage initialGuests={guests} initialTables={tables} />;
}
