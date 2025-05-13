'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import  Input from '@/components/inputs/Input';
import  Button from '@/components/Button';

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Επιτυχής σύνδεση!');
      router.push('/account');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Σύνδεση</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="email"
          label="Email"
          type="email"
          disabled={loading}
          required
          register={register}
          errors={errors}
        />
        <Input
          id="password"
          label="Κωδικός"
          type="password"
          disabled={loading}
          required
          register={register}
          errors={errors}
        />

        <Button disabled={loading}>Σύνδεση</Button>
      </form>
    </div>
  );
}
