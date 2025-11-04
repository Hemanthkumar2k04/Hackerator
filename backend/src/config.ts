import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue || '';
};

export const config = {
  // Server
  PORT: parseInt(getEnv('PORT', '3001')),
  NODE_ENV: getEnv('NODE_ENV', 'development'),

  // Supabase
  SUPABASE_URL: getEnv('SUPABASE_URL'),
  SUPABASE_KEY: getEnv('SUPABASE_KEY'),

  // Gemini
  GEMINI_API_KEY: getEnv('GEMINI_API_KEY', ''),

  // CORS
  CORS_ORIGIN: getEnv('CORS_ORIGIN', 'http://localhost:5173'),

  // File upload
  MAX_FILE_SIZE_MB: parseInt(getEnv('MAX_FILE_SIZE_MB', '10')),
  UPLOAD_TEMP_DIR: getEnv('UPLOAD_TEMP_DIR', './tmp'),
};
