import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom'; // Add this line to use search params
import type { ContextType } from '~/common';
import { useAuthContext, useAssistantsMap, useFileMap, useSearch } from '~/hooks';
import { AssistantsMapContext, FileMapContext, SearchContext } from '~/Providers';
import { Nav, MobileNav } from '~/components/Nav';
import PaymentStatusModal from '~/components/Nav/PaymentStatus';

export default function Root() {
  const { isAuthenticated } = useAuthContext();
  const [navVisible, setNavVisible] = useState(() => {
    const savedNavVisible = localStorage.getItem('navVisible');
    return savedNavVisible !== null ? JSON.parse(savedNavVisible) : true;
  });
  const [searchParams] = useSearchParams();
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState('');
  const [paymentTrackId, setPaymentTrackId] = useState('');
  const search = useSearch({ isAuthenticated });
  const fileMap = useFileMap({ isAuthenticated });
  const assistantsMap = useAssistantsMap({ isAuthenticated });

  useEffect(() => {
    const paymentSuccessParam = searchParams.get('Payment_success');
    const paymentTrackIdParam = searchParams.get('Payment_trackId');

    if (paymentSuccessParam !== null && paymentTrackIdParam !== null) {
      setPaymentModalOpen(true);
      setPaymentSuccess(paymentSuccessParam);
      setPaymentTrackId(paymentTrackIdParam);
    }
  }, [location.search]); // This will trigger the effect whenever the search part of the URL changes

  if (!isAuthenticated) {
    return null;
  }

  const handleCloseModal = () => {
    setPaymentModalOpen(false);
  };

  return (
      <SearchContext.Provider value={search}>
        <FileMapContext.Provider value={fileMap}>
          <AssistantsMapContext.Provider value={assistantsMap}>
            <div className="flex h-dvh">
              <div className="relative z-0 flex h-full w-full overflow-hidden">
                <Nav navVisible={navVisible} setNavVisible={setNavVisible} />
                <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden">
                  <MobileNav setNavVisible={setNavVisible} />
                  <Outlet context={{ navVisible, setNavVisible } satisfies ContextType} />
                  <PaymentStatusModal
                      isOpen={isPaymentModalOpen}
                      onClose={handleCloseModal}
                      success={paymentSuccess === '1'}
                      trackId={paymentTrackId}
                  />
                </div>
              </div>
            </div>
          </AssistantsMapContext.Provider>
        </FileMapContext.Provider>
      </SearchContext.Provider>
  );
}