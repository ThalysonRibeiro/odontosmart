import { Button } from '@/components/ui/button';
import getSession from '@/lib/getSession';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ButtonCopyLink } from './_components/button-copy-link';
import { Reminders } from './_components/reminder/reminders';
import { Appointments } from './_components/appointments/appointments';
import { checkSubscription } from '@/utils/permissions/checkSubscription';
import { LabelSubscription } from '@/components/ui/label-subscription';

export default async function DashBoard() {
  const session = await getSession();

  if (!session) {
    redirect("/")
  }

  const subscription = await checkSubscription(session?.user?.id!);

  return (
    <main>
      <div className='space-x-2 flex items-center justify-end'>
        <Link
          href={`/clinica/${session.user?.id}`}
          target='_blank'
        >
          <Button
            className="w-full flex-1 md:flex-[0] text-white bg-gradient-to-bl from-blue-600 to-indigo-500 transition-colors duration-300 hover:from-indigo-600 hover:to-blue-500"
          >
            <Calendar className='w-5 h-5' />
            <span>Novo agendamento</span>
          </Button>
        </Link>
        <ButtonCopyLink userId={session.user?.id!} />
      </div>

      {subscription?.subscriptionStatus === "EXPIRED" && (
        <LabelSubscription expired={true} />
      )}

      {subscription?.subscriptionStatus === "TRIAL" && (
        <div className='bg-blue-500 text-white text-sm md:text-base px-3 py-2 rounded-md my-2'>
          <p className='font-semibold'>
            {subscription.message}
          </p>
        </div>
      )}

      {subscription?.subscriptionStatus !== "EXPIRED" && (
        <section className='grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4'>
          <Appointments userId={session.user?.id!} />

          <Reminders userId={session.user?.id!} />
        </section>
      )}
    </main>
  );
}