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

  // Fetch the user's active subscriptions
  const now = new Date();
  const activeSubscriptions = await User.findOne({
    _id: user,
    'activeSubscriptions.expiresAt': { $gt: now },
  }, 'activeSubscriptions').lean();

  // Check if there is any active subscription
  const hasActivePackage = activeSubscriptions && activeSubscriptions.activeSubscriptions.length > 0;

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
    hasActivePackage,
  });

  if (!balance || !hasActivePackage) {
    return {
      canSpend: false,
      balance: balance || 0,
      tokenCost,
      hasActivePackage,
    };
  }

  logger.debug('[Balance.check]', { tokenCost, hasActivePackage });

  return { canSpend: balance >= tokenCost, balance, tokenCost, 'hasActivePackage': hasActivePackage };
};

module.exports = mongoose.model('Balance', balanceSchema);
