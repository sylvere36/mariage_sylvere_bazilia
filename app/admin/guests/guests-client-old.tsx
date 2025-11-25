'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Users, Baby, CheckCircle, X } from 'lucide-react';
import { Guest, Table } from '@/lib/types';
import { createGuest, updateGuest, deleteGuest, cancelGuestArrival } from '@/app/actions';
import { formatTime } from '@/lib/utils';

interface GuestsClientPageProps {
  initialGuests: Guest[];
  initialTables: Table[];
}

export default function GuestsClientPage({ initialGuests, initialTables }: GuestsClientPageProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [tables] = useState<Table[]>(initialTables);
  const [isEditing, setIsEditing] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [filter, setFilter] = useState<'all' | 'arrived' | 'not-arrived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    places: 1,
    children: 0,
    tableId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingGuest) {
        const updated = await updateGuest(editingGuest.id, formData);
        setGuests(guests.map(g => g.id === updated.id ? updated : g));
      } else {
        const newGuest = await createGuest({
          ...formData,
          arrived: false,
          arrivalTime: null,
        });
        setGuests([...guests, newGuest]);
      }

      resetForm();
      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur');
    }
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      firstname: guest.firstname,
      lastname: guest.lastname,
      email: guest.email || '',
      phone: guest.phone || '',
      places: guest.places,
      children: guest.children,
      tableId: guest.tableId,
    });
    setIsEditing(true);
  };

  const handleDelete = async (guestId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet invité ?')) {
      return;
    }

    try {
      await deleteGuest(guestId);
      setGuests(guests.filter(g => g.id !== guestId));
      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur');
    }
  };

  const handleCancelArrival = async (guestId: string) => {
    try {
      const updated = await cancelGuestArrival(guestId);
      setGuests(guests.map(g => g.id === updated.id ? updated : g));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur');
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingGuest(null);
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      places: 1,
      children: 0,
      tableId: '',
    });
  };

  const filteredGuests = guests
    .filter(guest => {
      if (filter === 'arrived') return guest.arrived;
      if (filter === 'not-arrived') return !guest.arrived;
      return true;
    })
    .filter(guest => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        guest.firstname.toLowerCase().includes(query) ||
        guest.lastname.toLowerCase().includes(query) ||
        guest.email?.toLowerCase().includes(query) ||
        guest.phone?.includes(query)
      );
    });

  const getTableName = (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    return table ? `${table.number} - ${table.name}` : 'N/A';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-800">
            Gestion des Invités
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">
                {isEditing ? 'Modifier' : 'Nouvel'} Invité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Prénom</label>
                  <Input
                    type="text"
                    required
                    value={formData.firstname}
                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Nom</label>
                  <Input
                    type="text"
                    required
                    value={formData.lastname}
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Téléphone</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Places</label>
                  <Input
                    type="number"
                    required
                    min="1"
                    value={formData.places}
                    onChange={(e) => setFormData({ ...formData, places: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Enfants</label>
                  <Input
                    type="number"
                    required
                    min="0"
                    value={formData.children}
                    onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Table</label>
                  <select
                    required
                    value={formData.tableId}
                    onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-rose-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Sélectionner...</option>
                    {tables.map(table => (
                      <option key={table.id} value={table.id}>
                        {table.number} - {table.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Button type="submit" className="w-full">
                    {isEditing ? 'Mettre à jour' : 'Créer'}
                  </Button>
                  {isEditing && (
                    <Button type="button" variant="outline" onClick={resetForm} className="w-full">
                      Annuler
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* List */}
          <div className="lg:col-span-3 space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    type="text"
                    placeholder="Rechercher un invité..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant={filter === 'all' ? 'default' : 'outline'}
                      onClick={() => setFilter('all')}
                    >
                      Tous
                    </Button>
                    <Button
                      variant={filter === 'arrived' ? 'default' : 'outline'}
                      onClick={() => setFilter('arrived')}
                    >
                      Arrivés
                    </Button>
                    <Button
                      variant={filter === 'not-arrived' ? 'default' : 'outline'}
                      onClick={() => setFilter('not-arrived')}
                    >
                      En attente
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guest Cards */}
            {filteredGuests.map((guest) => (
              <Card key={guest.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {guest.firstname} {guest.lastname}
                        </h3>
                        {guest.arrived && (
                          <Badge variant="success">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Arrivé
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1 mb-3">
                        {guest.email && <p>📧 {guest.email}</p>}
                        {guest.phone && <p>📱 {guest.phone}</p>}
                        <p>🪑 {getTableName(guest.tableId)}</p>
                      </div>

                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span>{guest.places} places</span>
                        </div>
                        {guest.children > 0 && (
                          <div className="flex items-center gap-1">
                            <Baby className="w-4 h-4 text-gray-500" />
                            <span>{guest.children} enfants</span>
                          </div>
                        )}
                      </div>

                      {guest.arrived && guest.arrivalTime && (
                        <p className="text-xs text-gray-500 mt-2">
                          Arrivée: {formatTime(guest.arrivalTime)}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      {guest.arrived && (
                        <Button 
                          size="icon" 
                          variant="outline"
                          onClick={() => handleCancelArrival(guest.id)}
                          title="Annuler l'arrivée"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        size="icon" 
                        variant="outline"
                        onClick={() => handleEdit(guest)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive"
                        onClick={() => handleDelete(guest.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredGuests.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center text-gray-500">
                  Aucun invité trouvé
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
