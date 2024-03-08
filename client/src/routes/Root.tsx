/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom'; // Add this line to use search params
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useGetModelsQuery, useGetSearchEnabledQuery } from 'librechat-data-provider/react-query';
import type { ContextType } from '~/common';
import {
  useAuthContext,
  useServerStream,
  useConversation,
  useAssistantsMap,
  useFileMap,
} from '~/hooks';
import { AssistantsMapContext, FileMapContext } from '~/Providers';
import { Nav, MobileNav } from '~/components/Nav';
import store from '~/store';
import PaymentStatusModal from '~/components/Nav/PaymentStatus'; // Make sure the path is correct

export default function Root() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { newConversation } = useConversation();
  const { isAuthenticated } = useAuthContext();
  const [navVisible, setNavVisible] = useState(() => {
    const savedNavVisible = localStorage.getItem('navVisible');
    return savedNavVisible !== null ? JSON.parse(savedNavVisible) : true;
  });
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState('');
  const [paymentTrackId, setPaymentTrackId] = useState('');

  const submission = useRecoilValue(store.submission);
  useServerStream(submission ?? null);

  const modelsQueryEnabled = useRecoilValue(store.modelsQueryEnabled);
  const setIsSearchEnabled = useSetRecoilState(store.isSearchEnabled);
  const setModelsConfig = useSetRecoilState(store.modelsConfig);

  const fileMap = useFileMap({ isAuthenticated });
  const assistantsMap = useAssistantsMap({ isAuthenticated });
  const searchEnabledQuery = useGetSearchEnabledQuery({ enabled: isAuthenticated });
  const modelsQuery = useGetModelsQuery({ enabled: isAuthenticated && modelsQueryEnabled });

  useEffect(() => {
    localStorage.setItem('navVisible', JSON.stringify(navVisible));
  }, [navVisible]);

  useEffect(() => {
    const paymentSuccessParam = searchParams.get('Payment_success');
    const paymentTrackIdParam = searchParams.get('Payment_trackId');

    if (paymentSuccessParam !== null && paymentTrackIdParam !== null) {
      setPaymentModalOpen(true);
      setPaymentSuccess(paymentSuccessParam);
      setPaymentTrackId(paymentTrackIdParam);
    }
  }, [location.search]); // This will trigger the effect whenever the search part of the URL changes

  useEffect(() => {
    if (modelsQuery.data && location.state?.from?.pathname.includes('/chat')) {
      setModelsConfig(modelsQuery.data);
      newConversation({}, undefined, modelsQuery.data);
    } else if (modelsQuery.data) {
      setModelsConfig(modelsQuery.data);
    } else if (modelsQuery.isError) {
      console.error('Failed to get models', modelsQuery.error);
    }
  }, [modelsQuery.data, modelsQuery.isError]);

  useEffect(() => {
    if (searchEnabledQuery.data) {
      setIsSearchEnabled(searchEnabledQuery.data);
    } else if (searchEnabledQuery.isError) {
      console.error('Failed to get search enabled', searchEnabledQuery.error);
    }
  }, [searchEnabledQuery.data, searchEnabledQuery.isError]);

  if (!isAuthenticated) {
    return null;
  }

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setPaymentModalOpen(false);
  };

  return (
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
  );
}
