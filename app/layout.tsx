import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { createClient } from '@/src/utils/supabase/server';
import Navbar from '@/components/navbar/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Store’nB | Φύλαξέ το κι ησύχασε",
  description:
    'Η πρώτη πλατφόρμα διαμοιραζόμενης αποθήκευσης στην Ελλάδα. Βρες χώρο κοντά σου ή κέρδισε χρήματα νοικιάζοντας τον δικό σου!',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="el">
      <body className={inter.className}>
        <Navbar currentUser={user} />
        <div className="pt-32 px-4 md:pt-36 lg:pt-40"> {/* ➕ Καλύτερη υποστήριξη για όλα τα screen sizes */}
          <main>{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
