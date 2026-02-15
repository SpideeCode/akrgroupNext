'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AdminLogin from '@/components/admin/AdminLogin';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/admin/dashboard');
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  if (loading) return null; // Or a loading spinner

  return <AdminLogin onBack={() => router.push('/')} />;
}
