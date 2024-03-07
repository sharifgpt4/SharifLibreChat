import React from 'react';
import classnames from 'classnames';
import { Dialog, DialogContent } from '~/components/ui';
import { useListSubscriptionsQuery } from 'librechat-data-provider/react-query';

const SubscriptionOption = ({ title, price, duration, tokenCreditsCost, isActive, description }) => (
  <div className={classnames(
    'flex flex-col justify-between bg-[#202123] text-white rounded-lg p-4',
    'w-full md:w-1/4 relative text-center m-2'
  )}>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-sm mt-2">{`${price} USD / ${duration} days`}</p>
    <p className="text-sm mt-2">Tokens: {tokenCreditsCost}</p>
    {isActive && <span className="text-green-500">Active</span>}
    <p className="text-sm mt-2">{description || 'No description available.'}</p>
    <div className="mt-4 flex justify-center">
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        Choose {title}
      </button>
    </div>
  </div>
);

export default function Subscriptions({ open, onOpenChange }) {
  const { data: subscriptions, isLoading, error } = useListSubscriptionsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={classnames(
          'shadow-2xl dark:bg-gray-900 dark:text-white',
          'flex justify-center items-start flex-wrap',
          'p-4', 'rounded-lg', 'overflow-y-auto',
          'max-h-[120]', 'max-w-6xl'
        )}
        style={{
          position: 'fixed',
          margin: 'auto',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="flex flex-wrap justify-around gap-4 w-full">
          {subscriptions?.map(subscription => (
            <SubscriptionOption
              key={subscription.id}
              title={subscription.name}
              price={subscription.price}
              duration={subscription.duration}
              tokenCreditsCost={subscription.tokenCreditsCost}
              isActive={subscription.isActive}
              description={subscription.description}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
