const openai = require("./openai");

const providers = {
  openai,
};

function getProvider() {
  const providerName = (process.env.AI_PROVIDER || "openai").toLowerCase();
  const provider = providers[providerName];

  if (!provider) {
    return {
      name: providerName,
      isConfigured: () => false,
      summarize: async () => {
        throw new Error(
          `AI_PROVIDER=${providerName} is not implemented yet. Supported providers: ${Object.keys(providers).join(", ")}.`
        );
      },
    };
  }

  return provider;
}

module.exports = {
  getProvider,
};
