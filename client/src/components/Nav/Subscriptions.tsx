import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '~/components/ui';
import { useListSubscriptionsQuery, useCreatePaymentMutation, useGetUserBalance, useGetStartupConfig } from 'librechat-data-provider/react-query';
import { useMediaQuery } from '~/hooks';
import { cn } from '~/utils';
import { useAuthContext } from '~/hooks/AuthContext';

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
  isUserCurrentPlan = false,
}) => {
  const isSmallScreen = useMediaQuery('(max-width: 1000px)');
  const formattedPrice = price.toLocaleString();

  const getButtonClass = (isUserCurrentPlan: boolean) => {
    if (isUserCurrentPlan) {
      return 'bg-gray-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed';
    } else if (title.includes('سازمان')) {
      return 'bg-blue-500 hover:bg-blue-600';
    } else if (title.includes('پیشرفته')) {
      return 'btn-primary hover:bg-primary-600';
    } else if (title.includes('ساده')) {
      return 'btn-secondary text-white font-bold py-2 px-4 rounded';
    }
    return 'btn-default hover:bg-default-600';
  };

  const buttonClass = getButtonClass(isUserCurrentPlan);

  return (
    <div style={{ direction: 'rtl' }} className={cn(
      'flex flex-col justify-between -lg p-4 ',
      'text-black dark:text-white',
      'transition-shadow duration-300 hover:shadow-xl border-r border-l border-primary  px-10 py-10', 'farsi'
      isSmallScreen ? 'w-full' : 'w-1/4',
    )}>
      <h3 className="text-xl font-bold farsi">{title}</h3>
      <p className="text-sm mt-2 farsi">{`${formattedPrice} تومان / ${duration} روز`}</p>
      <p className="text-sm mt-2 farsi">تعداد رکوست: {tokenCreditsCost <= 1000 ? `${tokenCreditsCost / 25}` : 'نامحدود'}</p>
      <div className="mt-4 flex justify-center farsi">
        <button
          onClick={() => onSubscribe(id)}
          className={`text-white w-full font-bold py-4 px-3 rounded farsi ${buttonClass}`}
          disabled={isUserCurrentPlan}
        >
          {buyButtonValue}
        </button>
      </div>

      <ul className="text-sm mt-8 text-center list-disc list-inside farsi">
        {description?.split('\n\n').map((item, index) => (
          <li key={index} style={{ direction: 'rtl' }} className="mb-2 farsi">{item}</li>
        ))}
      </ul>
    </div>
  );
};

const Subscriptions = ({ open, onOpenChange }) => {
  const { isAuthenticated } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const balanceQuery = useGetUserBalance({
    enabled: !!isAuthenticated && startupConfig?.checkBalance,
  });
  const { data: subscriptions, isLoading, error } = useListSubscriptionsQuery();
  const createPaymentMutation = useCreatePaymentMutation();
  const navigate = useNavigate();

  const handleSubscribe = (subscriptionId: string) => {
    if (balanceQuery.data?.hasSubscription) {
      console.log('User already has a subscription');
    }
    createPaymentMutation.mutate(
      { subscriptionId },
      {
        onSuccess: (newPayment) => {
          if (newPayment.paymentUrl) {

            window.location.href = newPayment.paymentUrl; // Redirects the user to the payment URL
          }
        },
        onError: (error) => {
          console.error('Error creating payment:', error);
        },
      },
    );
  };

  if (isLoading) {return <div>Loading...</div>;}
  if (error) {return <div>Error: {error.message}</div>;}

  const userSubscriptionId = balanceQuery.data?.subscriptionDetails?.subscription._id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'shadow-2xl dark:bg-gray-900 dark:text-white',
          'flex justify-center items-start flex-wrap',
          'p-8', 'rounded-lg', 'overflow-y-auto',
          'max-h-[100vh]', 'max-w-7xl', 'farsi'
        )}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="flex flex-wrap justify-around gap-2 w-full 'farsi">
          {subscriptions?.map((subscription) => {
            const isUserCurrentPlan = subscription.id === userSubscriptionId;
            // Adjusted buyButtonValue to handle user's current plan more explicitly
            let balance = balanceQuery.data?.balance?.toString();
            let yourPlanText = `پلن شما | توکن : ${balance} `;
            const buyButtonValue = isUserCurrentPlan ? yourPlanText : `خرید ${subscription.name}`;

            return (
              <SubscriptionOption
                id={subscription.id}
                key={subscription.id}
                title={subscription.name}
                price={subscription.price}
                duration={subscription.duration}
                tokenCreditsCost={subscription.tokenCreditsCost}
                isActiveated={subscription.isActive}
                description={subscription.description}
                onSubscribe={handleSubscribe}
                buyButtonValue={buyButtonValue}
                balance={balanceQuery.data?.balance?.toString() || ''}
                isUserCurrentPlan={isUserCurrentPlan}
              />
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Subscriptions;
