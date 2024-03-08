// PaymentStatusModal.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui';
import { cn } from '~/utils';

interface PaymentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  success: boolean;
  trackId: string;
}

const PaymentStatusModal: React.FC<PaymentStatusModalProps> = ({
  isOpen,
  onClose,
  success,
  trackId,
}) => {

  const SuccessIcon = () => (
    <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" stroke="green" strokeWidth="4"></circle>
      <path stroke="green" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  );

  const FailureIcon = () => (
    <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" stroke="red" strokeWidth="4"></circle>
      <path stroke="red" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" />
    </svg>
  );

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent 
        className={cn('shadow-2xl dark:bg-gray-900 dark:text-white md:min-h-[373px] md:w-[680px]')}
        style={{
          borderRadius: '12px',
          position: 'fixed',
          margin: 'auto',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">
            Your Payment Status
          </DialogTitle>
        </DialogHeader>
        {success ? <SuccessIcon /> : <FailureIcon />}
        <div className="mt-4 flex justify-center">
        <h2 className="text-2xl font-bold center mt-1 mb-1 text-center">
          {success ? 'Payment Successful' : 'Payment Failed'}
        </h2>
        </div>
        
        <div className="mt-4 flex justify-center">
        <p className="text-md mb-4">Track ID: {trackId}</p>
        </div>
        <div className="mt-4 flex justify-center">
        <button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
          Close
        </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentStatusModal;
