const mongoose = require('mongoose');
const balanceSchema = require('./schema/balance');
const { getMultiplier } = require('./tx');
const { logger } = require('~/config');
const User = require('./User'); // Adjust the path as necessary

balanceSchema.statics.check = async function ({
  user,
  model,
  endpoint,
  valueKey,
  tokenType,
  amount,
  endpointTokenConfig,
}) {
  const multiplier = getMultiplier({ valueKey, tokenType, model, endpoint, endpointTokenConfig });
  const tokenCost = amount * multiplier;
  const { tokenCredits: balance } = (await this.findOne({ user }, 'tokenCredits').lean()) ?? {};

  // Fetch the user's active subscriptions that have not expired
  const now = new Date();
  const userWithActiveSubscriptions = await User.findOne({
    _id: user,
    'activeSubscriptions.expiresAt': { $gt: now },
  }, 'activeSubscriptions').lean();

  // Check if the user has any active (not expired) subscriptions
  const hasActiveSubscription = userWithActiveSubscriptions && userWithActiveSubscriptions.activeSubscriptions.some(subscription => subscription.expiresAt > now);

  logger.debug('[Balance.check]', {
    user,
    model,
    endpoint,
    valueKey,
    tokenType,
    amount,
    balance,
    multiplier,
    endpointTokenConfig: !!endpointTokenConfig,
    hasActiveSubscription,
  });

  if (!balance || balance < tokenCost || !hasActiveSubscription) {
    return {
      canSpend: false,
      balance: balance || 0,
      tokenCost,
      hasActiveSubscription,
    };
  }

  logger.debug('[Balance.check]', { tokenCost, hasActiveSubscription });

  return {
    canSpend: true,
    balance,
    tokenCost,
    hasActiveSubscription,
  };
};

module.exports = mongoose.model('Balance', balanceSchema);
