'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import DemoLoginScreen from '@/components/DemoLoginScreen';

export default function LoginPage() {
  const router = useRouter();

  return (
    <DemoLoginScreen
      onLoginSuccess={() => {
        router.push('/');
      }}
    />
  );
}
