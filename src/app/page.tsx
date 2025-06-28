'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to loading page
    router.replace('/loading');
  }, [router]);

  // Return null or a simple loading state while redirecting
  return null;
}
