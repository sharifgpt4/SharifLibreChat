import React from 'react';
import { Dialog, DialogContent } from '~/components/ui';
import { cn } from '~/utils';

// Assuming you have SVG icons for these plans

const SubscriptionOption = ({ title, price, features, note }) => (
  <div className={cn('flex flex-col justify-between bg-[#202123] text-white rounded-lg p-4 w-full relative text-center')}>
    {/* Vertical line */}
    {title !== 'Limited' && <div className={cn('absolute left-0 top-0 bottom-0 w-px bg-gray-700')}></div>}
    <div>
      <h3 className={cn('text-xl font-bold flex justify-center items-center gap-2')}>
        {title} - {price}
      </h3>
      <ul className={cn('list-disc pl-5 text-sm mx-auto mt-2 inline-block text-left')}>
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      {note && <p className={cn('text-xs mt-2')}>{note}</p>}
    </div>
    <div className={cn('mt-4 flex justify-center')}>
      <button className={cn('bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded')}>
        Choose {title}
      </button>
    </div>
  </div>
);

export default function Subscriptions({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn('shadow-2xl dark:bg-gray-900 dark:text-white flex justify-center items-stretch')}
        style={{
          borderRadius: '12px',
          position: 'fixed',
          margin: 'auto',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'auto', // Adjust based on content
          padding: '20px',
        }}
      >
        <div className="flex justify-around space-x-4 mt-4">
          <SubscriptionOption
            title="Limited"
            price="Free"
            features={[
              "Access to basic features",
              "Limited GPT-3 access",
              "Community support",
            ]}
          />
          <SubscriptionOption
            title="Plus"
            price="USD $20/month"
            features={[
              "Access to GPT-4, our most capable model",
              "Browse, create, and use GPTs",
              "Access to additional tools like DALL·E, Browsing, Advanced Data Analysis and more",
            ]}
          />
          <SubscriptionOption
            title="Team"
            price="USD $25 per person/month*"
            features={[
              "Everything in Plus, and:",
              "Higher message caps on GPT-4 and tools like DALL·E, Browsing, Advanced Data Analysis, and more",
              "Create and share GPTs with your workspace",
              "Admin console for workspace management",
              "Team data excluded from training by default. Learn more",
            ]}
            note="* Price billed annually, minimum 2 users"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
