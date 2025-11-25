'use client';

import { Guest } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

interface GuestListProps {
  guests: Guest[];
  onSelectGuest: (guest: Guest) => void;
}

export function GuestList({ guests, onSelectGuest }: GuestListProps) {
  if (guests.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 space-y-3">
      <p className="text-base sm:text-lg text-gray-700 mb-4 font-semibold">
        Résultats similaires ({guests.length}) :
      </p>
      {guests.map((guest) => (
        <Card
          key={guest.id}
          className="cursor-pointer hover:bg-amber-50 hover:border-amber-300 transition-all shadow-md"
          onClick={() => onSelectGuest(guest)}
        >
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-7 h-7 text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                  {guest.firstname} {guest.lastname}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  {guest.email || guest.phone || 'Aucun contact'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
