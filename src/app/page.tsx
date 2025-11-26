import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-helpers';

export default async function Home() {
  // Check if user is authenticated
  const user = await getCurrentUser();
  
  if (user) {
    // Redirect authenticated users to their admin dashboard
    redirect('/admin');
  } else {
    // Redirect unauthenticated users to login
    redirect('/auth/login');
  }
}
