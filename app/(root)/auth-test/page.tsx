'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function TestProfileAccess() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // This will show us if the middleware is working correctly
    console.log('Session status:', status);
    console.log('Session data:', session);
  }, [session, status]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
        
        {status === 'loading' && <p>Loading session...</p>}
        
        {status === 'authenticated' && (
          <div>
            <p className="text-green-600 mb-2">✅ Authenticated</p>
            <p><strong>User:</strong> {session.user?.name}</p>
            <p><strong>Email:</strong> {session.user?.email}</p>
            <p><strong>ID:</strong> {session.user?.id}</p>
          </div>
        )}
        
        {status === 'unauthenticated' && (
          <p className="text-red-600">❌ Not authenticated</p>
        )}
      </div>
    </div>
  );
}
