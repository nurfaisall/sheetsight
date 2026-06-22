'use client';

import Navbar from '@/components/Navbar';
import Landing from '@/components/Landing';
import Dashboard from '@/components/Dashboard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import { useData } from '@/context/DataContext';

export default function Home() {
  const { status, error } = useData();

  return (
    <>
      <Navbar />
      {status === 'idle' && <Landing />}
      {status === 'loading' && <LoadingSkeleton />}
      {(status === 'error' || status === 'empty') && <ErrorState message={error} />}
      {status === 'ready' && <Dashboard />}
    </>
  );
}
