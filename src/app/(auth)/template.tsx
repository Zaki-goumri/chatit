"use client"
import {useEffect, useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

    const queryClient = new QueryClient();
    
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) 
{
const [mounted, setMounted] = useState(false);
useEffect(() => {
    setMounted(true);
}, []);
  if (!mounted) return null;
  return (
      <QueryClientProvider client={queryClient}>
      {children}
      </QueryClientProvider>
  );
}
