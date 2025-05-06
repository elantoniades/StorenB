'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function CreateSpaceForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [access, setAccess] = useState('');
  const [security, setSecurity] = useState('');
  const [isIndoor, setIsIndoor] = useState(true);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const user = (await supabase.auth.getUser()).data.user;

    if (!user) {
      alert('Πρέπει να είστε συνδεδεμένος για να καταχωρίσετε χώρο.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('spaces').insert({
      user_id: user.id,
      title,
      description,
      price: parseFloat(price),
      size: parseFloat(size),
      access,
      security,
      is_indoor: isIndoor,
      location
    });

    setLoading(false);

    if (error) {
      console.error('Insert error:', error.message);
      alert('Αποτυχία καταχώρισης. Δοκιμάστε ξανά.');
    } else {
      alert('Ο χώρος καταχωρήθηκε με επιτυχία!');
      router.push('/account');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-center">Καταχώρισε τον αποθηκευτικό σου χώρο</h2>

      <div>
        <label className="block font-semibold mb-1">Τίτλος</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded"
          placeholder="Π.χ. Υπόγειος χώρος 20τμ στο Μαρούσι"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Περιγραφή</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="Περιέγραψε τον χώρο σου..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1">Τιμή / μήνα (€)</label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Εμβαδόν (m²)</label>
          <input
            type="number"
            value={size}
            onChange={e => setSize(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">Πρόσβαση</label>
        <input
          type="text"
          value={access}
          onChange={e => setAccess(e.target.value)}
          required
          className="w-full p-2 border rounded"
          placeholder="Π.χ. 24/7 με κλειδί, ώρες γραφείου κ.λπ."
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Ασφάλεια</label>
        <input
          type="text"
          value={security}
          onChange={e => setSecurity(e.target.value)}
          required
          className="w-full p-2 border rounded"
          placeholder="Π.χ. Κάμερες, συναγερμός..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" checked={isIndoor} onChange={() => setIsIndoor(!isIndoor)} />
        <label>Εσωτερικός χώρος (αν όχι, θεωρείται εξωτερικός)</label>
      </div>

      <div>
        <label className="block font-semibold mb-1">Τοποθεσία</label>
        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          required
          className="w-full p-2 border rounded"
          placeholder="Οδός, περιοχή, ΤΚ"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Καταχώριση...' : 'Καταχώριση Χώρου'}
      </button>
    </form>
  );
}
