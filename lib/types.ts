export interface Table {
  id: string;
  name: string;
  number: number;
  description: string;
  capacity: number;
  currentCount: number;
}

export interface Guest {
  id: string;
  name: string;
  places: number;
  children: number;
  tableId: string;
  arrived: boolean;
  arrivalTime: string | null;
}

export interface WeddingEvent {
  name: string;
  date: string;
  location: string;
}
