interface AppConfig {
  vapi: {
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
    assistantId: getEnvVar('VITE_VAPI_ASSISTANT_ID', true),
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

if (config.isProduction) {
  if (!config.vapi.assistantId) {
    console.error('❌ CRITICAL: Missing VAPI assistant ID in production!');
  }
}

export default config;
