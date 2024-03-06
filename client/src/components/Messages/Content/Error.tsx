import React from 'react';
import { formatJSON } from '~/utils/json';
import CodeBlock from './CodeBlock';

// Combining type definitions for simplicity
type TErrorTypes = {
  concurrent: { limit: number };
  message_limit: { max: number; windowInMinutes: number };
  token_balance: {
    type: 'token_balance';
    balance: number;
    tokenCost: number;
    promptTokens: number;
    prev_count: number;
    violation_count: number;
    date: Date;
    generations?: any[]; // Assuming TOpenAIMessage[] or similar
    hasActivePackage: boolean;
  };
};

// Using a unified approach for error messages, with support for dynamic replacement and JSX returns
const errorMessages: { [key: string]: (data?: any) => string | JSX.Element } = {
  ban: () =>
    'Your account has been temporarily banned due to violations of our service.',
  invalid_api_key: () =>
    'Invalid API key. Please check your API key and try again. You can do this by clicking on the model logo in the left corner of the textbox and selecting "Set Token" for the current selected endpoint. Thank you for your understanding.',
  insufficient_quota: () =>
    'We apologize for any inconvenience caused. The default API key has reached its limit. To continue using this service, please set up your own API key. You can do this by clicking on the model logo in the left corner of the textbox and selecting "Set Token" for the current selected endpoint. Thank you for your understanding.',
  moderation: () =>
    'It appears that the content submitted has been flagged by our moderation system for not aligning with our community guidelines. We\'re unable to proceed with this specific topic. If you have any other questions or topics you\'d like to explore, please edit your message, or create a new conversation.',
  concurrent: ({ limit }: TErrorTypes['concurrent']) =>
    `Only ${limit} message${limit > 1 ? 's' : ''} at a time. Please allow any other responses to complete before sending another message, or wait one minute.`,
  message_limit: ({ max, windowInMinutes }: TErrorTypes['message_limit']) =>
    `You hit the message limit. You have a cap of ${max} message${max > 1 ? 's' : ''} per ${windowInMinutes > 1 ? `${windowInMinutes} minutes` : 'minute'}.`,
  token_balance: ({ balance, tokenCost, promptTokens, generations, hasActivePackage }: TErrorTypes['token_balance']) => (
    <>
      {hasActivePackage ? `Insufficient Funds! Balance: ${balance}. Prompt tokens: ${promptTokens}. Cost: ${tokenCost}.` : 'You Don\'t Have a subscription. Subscribe to QStar'}
      {generations && (
        <>
          <br />
          <CodeBlock
            lang="Generations"
            error={true}
            codeChildren={formatJSON(JSON.stringify(generations))}
          />
        </>
      )}
    </>
  ),
};

const ErrorComponent = ({ text }: { text: string }) => {
  // Extract JSON from text and parse it
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    // Return early if JSON parsing fails
    return <>{`Something went wrong. Here's the specific error message we encountered: ${text}`}</>;
  }

  const errorKey = json.code || json.type;
  const errorMessageFunction = errorMessages[errorKey];

  // Check if the error message function exists and is callable
  if (errorMessageFunction && typeof errorMessageFunction === 'function') {
    return <>{errorMessageFunction(json)}</>;
  } else {
    // Default error message if no specific handler is found
    return <>{`Something went wrong. Here's the specific error message we encountered: ${text}`}</>;
  }
};

export default ErrorComponent;
