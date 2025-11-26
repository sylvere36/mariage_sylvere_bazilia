import { getGuests, getTables } from '@/lib/blob';
import GuestsClientPage from './guests-client';

export default async function GuestsPage() {
  const [guests, tables] = await Promise.all([getGuests(), getTables()]);
  
  return <GuestsClientPage initialGuests={guests} initialTables={tables} />;
}
