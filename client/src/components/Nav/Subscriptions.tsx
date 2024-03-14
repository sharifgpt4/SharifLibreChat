import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '~/components/ui';
import { useListSubscriptionsQuery, useCreatePaymentMutation } from 'librechat-data-provider/react-query';
import { useMediaQuery, useLocalize } from '~/hooks';
import { cn } from '~/utils';
import { useGetUserBalance, useGetStartupConfig } from 'librechat-data-provider/react-query';
import { useAuthContext } from '~/hooks/AuthContext';

interface SubscriptionOptionProps {
  id: string;
  title: string;
  price: number;
  duration: number;
  tokenCreditsCost: number;
  isActiveated: boolean;
  description?: string;
  onSubscribe: (subscriptionId: string) => void;
  buyButtonValue: string;
  balance: string;
}


const SubscriptionOption: React.FC<SubscriptionOptionProps> = ({
  id,
  title,
  price,
  duration,
  tokenCreditsCost,
  isActiveated,
  description,
  onSubscribe,
  buyButtonValue,
  balance,
}) => {
  const isSmallScreen = useMediaQuery('(max-width: 767px)');

  // Convert price to a formatted string with commas
  const formattedPrice = price.toLocaleString();

  return (
    <div className={cn(
      'flex flex-col justify-between rounded-lg p-4 m-2',
      '  text-black dark:text-white',
      'transition-shadow duration-300 hover:shadow-xl',
      isSmallScreen ? 'w-full' : 'w-1/4',
      isActiveated ? 'bg-blue-500' : 'bg-gray-100 dark:bg-[#202123]'
    )}>
      <h3 className="text-xl font-bold text-center">{title}</h3>
      <p style={{direction: "rtl"}} className="text-sm mt-2 text-center">{`${formattedPrice} تومان / ${duration} روز`}</p>
      <p className="text-sm mt-2 text-center">تعداد رکوست: {tokenCreditsCost <= 1000 ? `${tokenCreditsCost / 25}` : "نامحدود"}</p>
      { balance ? (
              <p className="text-sm mt-2 text-center">تعداد توکن باقی مانده: {balance}</p>

      ) : ""}
      <ul className="text-sm mt-2 text-center list-disc list-inside">
        {description && description.length > 0 ? (
          description.split("\n\n").map((item, index) => (
            <li key={index} style={{direction: "rtl"}} className="mb-2 rtl">{item}</li>
          ))
        ) : <li>No description available.</li>}
      </ul>
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => onSubscribe(id)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {buyButtonValue}
        </button>
      </div>
    </div>
  );
};




interface Subscription {
  id?: string;
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
  const { user, isAuthenticated } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();

  const balanceQuery = useGetUserBalance({
    enabled: !!isAuthenticated && startupConfig?.checkBalance,
  });
  const { data: subscriptions, isLoading, error } = useListSubscriptionsQuery<Subscription[]>();
  const createPaymentMutation = useCreatePaymentMutation<TPayment>();
  const navigate = useNavigate(); // Use this if you need to navigate the user after an action


  const handleSubscribe = (subscriptionId: string) => {
    console.log(balanceQuery.data?.hasSubscription)
    if (balanceQuery.data?.hasSubscription){
      return true
      
    }
    
    createPaymentMutation.mutate(
      { subscriptionId },
      {
        onSuccess: (newPayment: any) => {

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


  let user_subscription: Subscription;

  if (balanceQuery.data?.subscriptionDetails){
    let user_subsc_ = balanceQuery.data?.subscriptionDetails.subscription
    user_subscription =  {
      name: user_subsc_.name,
      price: user_subsc_.price,
      duration: user_subsc_?.duration,
      tokenCreditsCost: user_subsc_?.tokenCreditsCost,
      isActive: user_subsc_?.isActive,
      description: user_subsc_.description,
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
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
        {balanceQuery.data?.subscriptionDetails &&  user_subscription ? (

        

<div className="flex flex-wrap justify-around gap-4 w-full ">
            <SubscriptionOption
              key={user_subscription.id}
              title={user_subscription.name}
              price={user_subscription.price}
              duration={user_subscription.duration}
              tokenCreditsCost={user_subscription.tokenCreditsCost}
              description={user_subscription.description}
              onSubscribe={handleSubscribe}
              buyButtonValue={balanceQuery.data?.hasSubscription ? "بسته فعلی شما": `${user_subscription.name} خرید`}
              isActiveated={balanceQuery.data?.hasSubscription}
              balance={balanceQuery.data.balance}
            />
        </div>

) : ""}
        <div className="flex flex-wrap justify-around gap-4 w-full">
          {subscriptions?.map((subscription: Subscription) => (
            <SubscriptionOption
              id={subscription.id}
              key={subscription.id}
              title={subscription.name}
              price={subscription.price}
              duration={subscription.duration}
              tokenCreditsCost={subscription.tokenCreditsCost}
              isActive={subscription.isActive}
              description={subscription.description}
              onSubscribe={handleSubscribe}
              buyButtonValue={`خرید ${subscription.name} `}
            />
          ))}
        </div>



      </DialogContent>
    </Dialog>
  );
};

export default Subscriptions;
