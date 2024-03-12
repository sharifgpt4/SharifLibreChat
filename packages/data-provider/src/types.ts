import OpenAI from 'openai';
import type { TResPlugin, TMessage, TConversation, EModelEndpoint, ImageDetail } from './schemas';

export type TOpenAIMessage = OpenAI.Chat.ChatCompletionMessageParam;
export type TOpenAIFunction = OpenAI.Chat.ChatCompletionCreateParams.Function;
export type TOpenAIFunctionCall = OpenAI.Chat.ChatCompletionCreateParams.FunctionCallOption;

export * from './schemas';

export type TMessages = TMessage[];

export type TMessagesAtom = TMessages | null;

/* TODO: Cleanup EndpointOption types */
export type TEndpointOption = {
  endpoint: EModelEndpoint;
  endpointType?: EModelEndpoint;
  modelDisplayLabel?: string;
  resendImages?: boolean;
  imageDetail?: ImageDetail;
  model?: string | null;
  promptPrefix?: string;
  temperature?: number;
  chatGptLabel?: string | null;
  modelLabel?: string | null;
  jailbreak?: boolean;
  key?: string | null;
  /* assistant */
  thread_id?: string;
};

export type TSubmission = {
  plugin?: TResPlugin;
  plugins?: TResPlugin[];
  message: TMessage;
  isEdited?: boolean;
  isContinued?: boolean;
  messages: TMessage[];
  isRegenerate?: boolean;
  conversationId?: string;
  initialResponse: TMessage;
  conversation: Partial<TConversation>;
  endpointOption: TEndpointOption;
};

export type TPluginAction = {
  pluginKey: string;
  action: 'install' | 'uninstall';
  auth?: unknown;
  isAssistantTool?: boolean;
};

export type GroupedConversations = [key: string, TConversation[]][];

export type TUpdateUserPlugins = {
  isAssistantTool?: boolean;
  pluginKey: string;
  action: string;
  auth?: unknown;
};

export type TError = {
  message: string;
  code?: number;
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
};

export type TUser = {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
  provider: string;
  plugins: string[];
  createdAt: string;
  updatedAt: string;
};

export type TGetConversationsResponse = {
  conversations: TConversation[];
  pageNumber: string;
  pageSize: string | number;
  pages: string | number;
};

export type TUpdateMessageRequest = {
  conversationId: string;
  messageId: string;
  model: string;
  text: string;
};

export type TUpdateUserKeyRequest = {
  name: string;
  value: string;
  expiresAt: string;
};

export type TUpdateConversationRequest = {
  conversationId: string;
  title: string;
};

export type TUpdateConversationResponse = TConversation;

export type TDeleteConversationRequest = {
  conversationId?: string;
  thread_id?: string;
  source?: string;
};

export type TDeleteConversationResponse = {
  acknowledged: boolean;
  deletedCount: number;
  messages: {
    acknowledged: boolean;
    deletedCount: number;
  };
};

export type TSearchResults = {
  conversations: TConversation[];
  messages: TMessage[];
  pageNumber: string;
  pageSize: string | number;
  pages: string | number;
  filter: object;
};

export type TConfig = {
  order: number;
  type?: EModelEndpoint;
  azure?: boolean;
  availableTools?: [];
  plugins?: Record<string, string>;
  name?: string;
  iconURL?: string;
  modelDisplayLabel?: string;
  userProvide?: boolean | null;
  userProvideURL?: boolean | null;
  disableBuilder?: boolean;
};

export type TEndpointsConfig =
  | Record<EModelEndpoint | string, TConfig | null | undefined>
  | undefined;

export type TModelsConfig = Record<string, string[]>;

export type TUpdateTokenCountResponse = {
  count: number;
};

export type TMessageTreeNode = object;

export type TSearchMessage = object;

export type TSearchMessageTreeNode = object;

export type TRegisterUser = {
  name: string;
  email: string;
  username: string;
  password: string;
  confirm_password?: string;
};

export type TLoginUser = {
  email: string;
  password: string;
};

export type TLoginResponse = {
  token: string;
  user: TUser;
};

export type TRequestPasswordReset = {
  email: string;
};

export type TResetPassword = {
  userId: string;
  token: string;
  password: string;
  confirm_password?: string;
};

export type TStartupConfig = {
  appTitle: string;
  socialLogins?: string[];
  discordLoginEnabled: boolean;
  facebookLoginEnabled: boolean;
  githubLoginEnabled: boolean;
  googleLoginEnabled: boolean;
  openidLoginEnabled: boolean;
  openidLabel: string;
  openidImageUrl: string;
  serverDomain: string;
  emailLoginEnabled: boolean;
  registrationEnabled: boolean;
  socialLoginEnabled: boolean;
  emailEnabled: boolean;
  checkBalance: boolean;
  showBirthdayIcon: boolean;
  helpAndFaqURL: string;
  customFooter?: string;
};

export type TRefreshTokenResponse = {
  token: string;
  user: TUser;
};

export type TCheckUserKeyResponse = {
  expiresAt: string;
};

export type TRequestPasswordResetResponse = {
  link?: string;
  message?: string;
};

export type TUserBalance = {
  balance: number;
  hasSubscription: boolean;
  subscriptionDetails?: {
    activatedAt: Date;
    expiresAt: Date;
    subscription: {
      _id: string;
      name: string;
      price: number;
      duration: number;
      tokenCreditsCost: number;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
      __v: number;
    };
  };
};

export type TSubscription = {
  id: string; // Assuming an id field for unique identification
  name: string;
  price: number;
  duration: number;
  tokenCreditsCost: number;
  isActive: boolean;
  description?: string; // Optional based on whether it's required in your schema
  createdAt?: string; // Included from Mongoose timestamps
  updatedAt?: string; // Included from Mongoose timestamps
};

export type TPayment = {
  id: string; // Assuming _id is mapped to id for convenience
  user: string; // The ID of the User
  trackId: string;
  isSuccessFull: boolean;
  gateway: string;
  subscription: string; // The ID of the Subscription
  createdAt?: string;
  updatedAt?: string;
};

 