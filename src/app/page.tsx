import { redirect } from 'next/navigation';

export default function Home() {
  // Redireciona o usuário para /auth/login
  redirect('/auth/login');
}
