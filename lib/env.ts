import "server-only";

const DEFAULT_OPENAI_MODEL = "gpt-4.1-mini";

export const getServerEnv = () => {
  const apiKey = process.env.OPENAI_API_KEY;

  return {
    openAiApiKey: apiKey,
    openAiModel: process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL,
    isOpenAiConfigured: Boolean(apiKey),
  };
};

export const getOpenAiConfig = () => {
  const env = getServerEnv();

  if (!env.openAiApiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  return {
    apiKey: env.openAiApiKey,
    model: env.openAiModel,
  };
};
