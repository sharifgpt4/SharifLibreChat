import React from 'react';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for potential internal navigation
import { Dialog, DialogContent } from '~/components/ui'; // Adjust import paths as needed
import { useListSubscriptionsQuery, useCreatePaymentMutation } from 'librechat-data-provider/react-query';
import { TPayment  } from 'librechat-data-provider/';

interface SubscriptionOptionProps {
  id: string;
  title: string;
  price: number;
  duration: number;
  tokenCreditsCost: number;
  isActive: boolean;
  description?: string;
  onSubscribe: (subscriptionId: string) => void;
}

const SubscriptionOption: React.FC<SubscriptionOptionProps> = ({
  id,
  title,
  price,
  duration,
  tokenCreditsCost,
  isActive,
  description,
  onSubscribe,
}) => (
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
      <button
        onClick={() => onSubscribe(id)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Choose {title}
      </button>
    </div>
  </div>
);

interface Subscription {
  id: string;
  name: string;
  price: number;
  duration: number;
  tokenCreditsCost: number;
  isActive: boolean;
  description?: string;
}

interface SubscriptionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Subscriptions: React.FC<SubscriptionsProps> = ({ open, onOpenChange }) => {
  const { data: subscriptions, isLoading, error } = useListSubscriptionsQuery<Subscription[]>();
  const createPaymentMutation = useCreatePaymentMutation<TPayment>();
  const navigate = useNavigate(); // Use this if you need to navigate the user after an action

  const handleSubscribe = (subscriptionId: string) => {
    createPaymentMutation.mutate(
      { subscriptionId },
      {
        onSuccess: (newPayment: any) => {
          console.log()
          // Adjust the `any` type based on your actual API response structure
          // Assuming `newPayment` contains a property `url` for redirection
          if (newPayment.paymentUrl) {
            window.location.href = newPayment.paymentUrl; // Redirects the user to the payment URL
            // For internal routing, use navigate('/path');
          }
        },
        onError: (error: Error) => {
          // Handle errors, e.g., by showing a notification
          console.error('Error creating payment:', error);
        }
      }
    );
  };

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
          {subscriptions?.map((subscription: Subscription) => (
            <SubscriptionOption
              key={subscription.id}
              id={subscription.id}
              title={subscription.name}
              price={subscription.price}
              duration={subscription.duration}
              tokenCreditsCost={subscription.tokenCreditsCost}
              isActive={subscription.isActive}
              description={subscription.description}
              onSubscribe={handleSubscribe}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Subscriptions;
