const requiredVars = [
  'REACT_APP_API_URL',
];

export function validateEnv() {
  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.warn('Missing required environment variables:', missing.join(', '));
  }
} 