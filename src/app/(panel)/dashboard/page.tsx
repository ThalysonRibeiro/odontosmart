import getSession from '@/lib/getSession';
import { redirect } from 'next/navigation';

export default async function DashBoard() {
  const session = await getSession();

  if (!session) {
    redirect("/")
  }
  return (
    <div>
      <h1>page dashboard</h1>
    </div>
  );
}