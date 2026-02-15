'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // const [session, setSession] = useState<any>(null); // Session tracking not strictly needed if we just redirect
  const [, setSession] = useState<unknown>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/admin/login');
      } else {
        setSession(session);
        setLoading(false);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/admin/login');
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) return null; // Or a loading spinner

  return <AdminDashboard />;
}
