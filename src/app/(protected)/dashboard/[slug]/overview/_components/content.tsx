import { Calendar, CreditCard, Wallet } from 'lucide-react';
import List01 from './list-01';
import List02 from './list-02';
import List03 from './list-03';

export default function Content() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 dark:border-[#1F1F23] dark:bg-[#0F0F12]">
          <h2 className="mb-4 flex items-center gap-2 text-left text-lg font-bold text-gray-900 dark:text-white">
            <Wallet className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-50" />
            Accounts
          </h2>
          <div className="flex-1">
            <List01 className="h-full" />
          </div>
        </div>
        <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 dark:border-[#1F1F23] dark:bg-[#0F0F12]">
          <h2 className="mb-4 flex items-center gap-2 text-left text-lg font-bold text-gray-900 dark:text-white">
            <CreditCard className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-50" />
            Recent Transactions
          </h2>
          <div className="flex-1">
            <List02 className="h-full" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start justify-start rounded-xl border border-gray-200 bg-white p-6 dark:border-[#1F1F23] dark:bg-[#0F0F12]">
        <h2 className="mb-4 flex items-center gap-2 text-left text-lg font-bold text-gray-900 dark:text-white">
          <Calendar className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-50" />
          Upcoming Events
        </h2>
        <List03 />
      </div>
    </div>
  );
}
