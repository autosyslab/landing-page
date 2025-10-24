interface AppConfig {
  vapi: {
    apiKey: string;
    assistantId: string;
  };
  isDevelopment: boolean;
  isProduction: boolean;
}

function getEnvVar(key: string, required: boolean = true): string {
  const value = import.meta.env[key];

  if (!value && required) {
    if (import.meta.env.PROD) {
      throw new Error(`Missing required environment variable: ${key}`);
    } else {
      console.warn(`⚠️ Missing environment variable: ${key} (development mode)`);
      return '';
    }
  }

  return value || '';
}

export const config: AppConfig = {
  vapi: {
    apiKey: getEnvVar('VITE_VAPI_API_KEY', true),
    assistantId: getEnvVar('VITE_VAPI_ASSISTANT_ID', true),
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

if (config.isProduction) {
  if (!config.vapi.apiKey || !config.vapi.assistantId) {
    console.error('❌ CRITICAL: Missing VAPI credentials in production!');
  }
}

export default config;
