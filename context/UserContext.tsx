'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type UserContextType = {
  user: { email: string } | null;
};

const UserContext = createContext<UserContextType>({ user: null });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user;
      if (sessionUser?.email) setUser({ email: sessionUser.email });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const authUser = session?.user;
      if (authUser?.email) setUser({ email: authUser.email });
      else setUser(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
