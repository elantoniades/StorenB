'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import  Input  from '@/components/inputs/Input';
import  Button  from '@/components/Button';
import { toast } from 'react-hot-toast';

const SignUpPage = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Έγινε εγγραφή! Έλεγξε το email σου για επιβεβαίωση.');
      router.push('/login');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Signup</h1>
      <form onSubmit={handleSignUp} className="space-y-4">
        <Input
          id="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Δημιουργία Λογαριασμού</Button>
      </form>
    </div>
  );
};

export default SignUpPage;
