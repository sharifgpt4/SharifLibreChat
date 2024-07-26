import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  UseQueryOptions,
  UseMutationResult,
  QueryObserverResult,
} from '@tanstack/react-query';
import { initialModelsConfig, LocalStorageKeys } from '../config';
import { defaultOrderQuery } from '../types/assistants';
import * as dataService from '../data-service';
import * as m from '../types/mutations';
import { QueryKeys } from '../keys';
import request from '../request';
import * as s from '../schemas';
import * as t from '../types';

export const useAbortRequestWithMessage = (): UseMutationResult<
  void,
  Error,
  { endpoint: string; abortKey: string; message: string }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ endpoint, abortKey, message }) =>
      dataService.abortRequestWithMessage(endpoint, abortKey, message),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.balance]);
      },
    },
  );
};

export const useGetUserQuery = (
  config?: UseQueryOptions<t.TUser>,
): QueryObserverResult<t.TUser> => {
  return useQuery<t.TUser>([QueryKeys.user], () => dataService.getUser(), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
    ...config,
  });
};

export const useGetMessagesByConvoId = <TData = s.TMessage[]>(
  id: string,
  config?: UseQueryOptions<s.TMessage[], unknown, TData>,
): QueryObserverResult<TData> => {
  return useQuery<s.TMessage[], unknown, TData>(
    [QueryKeys.messages, id],
    () => dataService.getMessagesByConvoId(id),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      ...config,
    },
  );
};

export const useGetSharedMessages = (
  shareId: string,
  config?: UseQueryOptions<t.TSharedMessagesResponse>,
): QueryObserverResult<t.TSharedMessagesResponse> => {
  return useQuery<t.TSharedMessagesResponse>(
    [QueryKeys.sharedMessages, shareId],
    () => dataService.getSharedMessages(shareId),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      ...config,
    },
  );
};

export const useGetUserBalance = (
  config?: UseQueryOptions<t.TUserBalance>,
): QueryObserverResult<t.TUserBalance> => {
  return useQuery<t.TUserBalance>(
    [QueryKeys.balance],
    () => dataService.getUserBalance(), // Make sure dataService.getUserBalance matches the expected return type
    {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      ...config,
    },
  );
};

export const useGetConversationByIdQuery = (
  id: string,
  config?: UseQueryOptions<s.TConversation>,
): QueryObserverResult<s.TConversation> => {
  return useQuery<s.TConversation>(
    [QueryKeys.conversation, id],
    () => dataService.getConversationById(id),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      ...config,
    },
  );
};

//This isn't ideal because its just a query and we're using mutation, but it was the only way
//to make it work with how the Chat component is structured
export const useGetConversationByIdMutation = (id: string): UseMutationResult<s.TConversation> => {
  const queryClient = useQueryClient();
  return useMutation(() => dataService.getConversationById(id), {
    // onSuccess: (res: s.TConversation) => {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.conversation, id]);
    },
  });
};

export const useUpdateMessageMutation = (
  id: string,
): UseMutationResult<unknown, unknown, t.TUpdateMessageRequest, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((payload: t.TUpdateMessageRequest) => dataService.updateMessage(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.messages, id]);
    },
  });
};

export const useUpdateUserKeysMutation = (): UseMutationResult<
  t.TUser,
  unknown,
  t.TUpdateUserKeyRequest,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation((payload: t.TUpdateUserKeyRequest) => dataService.updateUserKey(payload), {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries([QueryKeys.name, variables.name]);
    },
  });
};

export const useClearConversationsMutation = (): UseMutationResult<unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => dataService.clearAllConversations(), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.allConversations]);
    },
  });
};

export const useRevokeUserKeyMutation = (name: string): UseMutationResult<unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => dataService.revokeUserKey(name), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.name, name]);
      if (s.isAssistantsEndpoint(name)) {
        queryClient.invalidateQueries([QueryKeys.assistants, name, defaultOrderQuery]);
        queryClient.invalidateQueries([QueryKeys.assistantDocs]);
        queryClient.invalidateQueries([QueryKeys.assistants]);
        queryClient.invalidateQueries([QueryKeys.assistant]);
        queryClient.invalidateQueries([QueryKeys.actions]);
        queryClient.invalidateQueries([QueryKeys.tools]);
      }
    },
  });
};

export const useRevokeAllUserKeysMutation = (): UseMutationResult<unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => dataService.revokeAllUserKeys(), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.name]);
      queryClient.invalidateQueries([
        QueryKeys.assistants,
        s.EModelEndpoint.assistants,
        defaultOrderQuery,
      ]);
      queryClient.invalidateQueries([
        QueryKeys.assistants,
        s.EModelEndpoint.azureAssistants,
        defaultOrderQuery,
      ]);
      queryClient.invalidateQueries([QueryKeys.assistantDocs]);
      queryClient.invalidateQueries([QueryKeys.assistants]);
      queryClient.invalidateQueries([QueryKeys.assistant]);
      queryClient.invalidateQueries([QueryKeys.actions]);
      queryClient.invalidateQueries([QueryKeys.tools]);
    },
  });
};

export const useGetSearchEnabledQuery = (
  config?: UseQueryOptions<boolean>,
): QueryObserverResult<boolean> => {
  return useQuery<boolean>([QueryKeys.searchEnabled], () => dataService.getSearchEnabled(), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    ...config,
  });
};

export const useGetEndpointsQuery = <TData = t.TEndpointsConfig>(
  config?: UseQueryOptions<t.TEndpointsConfig, unknown, TData>,
): QueryObserverResult<TData> => {
  return useQuery<t.TEndpointsConfig, unknown, TData>(
    [QueryKeys.endpoints],
    () => dataService.getAIEndpoints(),
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      ...config,
    },
  );
};

export const useGetModelsQuery = (
  config?: UseQueryOptions<t.TModelsConfig>,
): QueryObserverResult<t.TModelsConfig> => {
  return useQuery<t.TModelsConfig>([QueryKeys.models], () => dataService.getModels(), {
    initialData: initialModelsConfig,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: Infinity,
    ...config,
  });
};

export const useCreatePresetMutation = (): UseMutationResult<
  s.TPreset,
  unknown,
  s.TPreset,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation((payload: s.TPreset) => dataService.createPreset(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.presets]);
    },
  });
};

export const useDeletePresetMutation = (): UseMutationResult<
  m.PresetDeleteResponse,
  unknown,
  s.TPreset | undefined,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation((payload: s.TPreset | undefined) => dataService.deletePreset(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.presets]);
    },
  });
};

export const useSearchQuery = (
  searchQuery: string,
  pageNumber: string,
  config?: UseQueryOptions<t.TSearchResults>,
): QueryObserverResult<t.TSearchResults> => {
  return useQuery<t.TSearchResults>(
    [QueryKeys.searchResults, pageNumber, searchQuery],
    () => dataService.searchConversations(searchQuery, pageNumber),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      ...config,
    },
  );
};

export const useUpdateTokenCountMutation = (): UseMutationResult<
  t.TUpdateTokenCountResponse,
  unknown,
  { text: string },
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation(({ text }: { text: string }) => dataService.updateTokenCount(text), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.tokenCount]);
    },
  });
};

export const useLoginUserMutation = (): UseMutationResult<
  t.TLoginResponse,
  unknown,
  t.TLoginUser,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation((payload: t.TLoginUser) => dataService.login(payload), {
    onMutate: () => {
      queryClient.removeQueries();
      localStorage.removeItem(LocalStorageKeys.LAST_CONVO_SETUP);
      localStorage.removeItem(`${LocalStorageKeys.LAST_CONVO_SETUP}_0`);
      localStorage.removeItem(`${LocalStorageKeys.LAST_CONVO_SETUP}_1`);
      localStorage.removeItem(LocalStorageKeys.LAST_MODEL);
      localStorage.removeItem(LocalStorageKeys.LAST_TOOLS);
      localStorage.removeItem(LocalStorageKeys.FILES_TO_DELETE);
      // localStorage.removeItem('lastAssistant');
    },
  });
};

export const useRegisterUserMutation = (
  options?: m.RegistrationOptions,
): UseMutationResult<t.TError, unknown, t.TRegisterUser, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((payload: t.TRegisterUser) => dataService.register(payload), {
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries([QueryKeys.user]);
      if (options?.onSuccess) {
        options.onSuccess(...args);
      }
    },
  });
};

export const useRefreshTokenMutation = (): UseMutationResult<
  t.TRefreshTokenResponse,
  unknown,
  unknown,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation(() => request.refreshToken(), {
    onMutate: () => {
      queryClient.removeQueries();
    },
  });
};

export const useUserKeyQuery = (
  name: string,
  config?: UseQueryOptions<t.TCheckUserKeyResponse>,
): QueryObserverResult<t.TCheckUserKeyResponse> => {
  return useQuery<t.TCheckUserKeyResponse>(
    [QueryKeys.name, name],
    () => {
      if (!name) {
        return Promise.resolve({ expiresAt: '' });
      }
      return dataService.userKeyQuery(name);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: false,
      ...config,
    },
  );
};

export const useRequestPasswordResetMutation = (): UseMutationResult<
  t.TRequestPasswordResetResponse,
  unknown,
  t.TRequestPasswordReset,
  unknown
> => {
  return useMutation((payload: t.TRequestPasswordReset) =>
    dataService.requestPasswordReset(payload),
  );
};

export const useResetPasswordMutation = (): UseMutationResult<
  unknown,
  unknown,
  t.TResetPassword,
  unknown
> => {
  return useMutation((payload: t.TResetPassword) => dataService.resetPassword(payload));
};

export const useAvailablePluginsQuery = <TData = s.TPlugin[]>(
  config?: UseQueryOptions<s.TPlugin[], unknown, TData>,
): QueryObserverResult<TData> => {
  return useQuery<s.TPlugin[], unknown, TData>(
    [QueryKeys.availablePlugins],
    () => dataService.getAvailablePlugins(),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      ...config,
    },
  );
};

export const useUpdateUserPluginsMutation = (): UseMutationResult<
  t.TUser,
  unknown,
  t.TUpdateUserPlugins,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation((payload: t.TUpdateUserPlugins) => dataService.updateUserPlugins(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.user]);
    },
  });
};

export const useGetStartupConfig = (
  config?: UseQueryOptions<t.TStartupConfig>,
): QueryObserverResult<t.TStartupConfig> => {
  return useQuery<t.TStartupConfig>(
    [QueryKeys.startupConfig],
    () => dataService.getStartupConfig(),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      ...config,
    },
  );
};

export const useGetCustomConfigSpeechQuery = (
  config?: UseQueryOptions<t.TCustomConfigSpeechResponse>,
): QueryObserverResult<t.TCustomConfigSpeechResponse> => {
  return useQuery<t.TCustomConfigSpeechResponse>(
    [QueryKeys.customConfigSpeech],
    () => dataService.getCustomConfigSpeech(),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      ...config,
    },
  );
};

// Example of fetching a single subscription by ID
export const useGetSubscriptionByIdQuery = (
  id: string,
  config?: UseQueryOptions<t.TSubscription>
): QueryObserverResult<t.TSubscription> => {
  return useQuery<t.TSubscription>(
    ['subscription', id],
    () => dataService.getSubscriptionById(id),
    {
      enabled: !!id, // Only run query if id is truthy
      ...config,
    },
  );
};

// Example of fetching all subscriptions
export const useListSubscriptionsQuery = (
  config?: UseQueryOptions<Array<t.TSubscription>>
): QueryObserverResult<Array<t.TSubscription>> => {
  return useQuery<Array<t.TSubscription>>(
    ['subscriptions'],
    dataService.listSubscriptions,
    {
      ...config,
    },
  );
};

export const useCreatePaymentMutation = (): UseMutationResult<
  unknown, // You might want to define a more specific type for the mutation result if your API provides a detailed response for the payment creation process.
  unknown, // Type for any error that might occur during the mutation. This can also be more specific based on your error handling strategy.
  { subscriptionId: string }, // Mutation variables: in this case, the subscriptionId needed to create a payment.
  unknown // Context: Optional. You can specify a type here if you're going to use the onMutate method to return a context that's used in onError or onSettled.
> => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ subscriptionId }: { subscriptionId: string }) =>
      dataService.createPayment(subscriptionId),
    {
      onSuccess: () => {
        // Invalidate or refetch queries as necessary after a successful payment creation.
        // For example, if you need to update the user's subscription status or balance:
        queryClient.invalidateQueries([QueryKeys.balance]);
        // Add any other queries that need to be updated due to the payment creation.
      },
      onError: (error) => {
        // Handle error. For example, you could log the error or display a notification to the user.
        console.error('Error creating payment:', error);
      },
      // Optionally, you can use onMutate, onSettled, etc., to further manage the mutation's lifecycle.
    },
  );
};

