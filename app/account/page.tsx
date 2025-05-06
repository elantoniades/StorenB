import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function AccountPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p className="text-center py-10">Πρέπει να είστε συνδεδεμένος.</p>;
  }

  const { data: spaces, error } = await supabase
    .from('spaces')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return <p className="text-center py-10 text-red-600">Σφάλμα: {error.message}</p>;
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Οι χώροι μου</h1>

      {spaces.length === 0 ? (
        <p className="text-gray-600">Δεν έχετε καταχωρίσει ακόμη κάποιον χώρο.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {spaces.map((space) => (
            <div key={space.id} className="border p-4 rounded shadow bg-white">
              <h2 className="text-xl font-semibold">{space.title}</h2>
              <p className="text-gray-600 mb-2">{space.description}</p>
              <p><strong>Τιμή:</strong> {space.price}€/μήνα</p>
              <p><strong>Εμβαδόν:</strong> {space.size} m²</p>
              <p className="text-sm text-gray-400 mt-2">Καταχωρήθηκε: {new Date(space.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
