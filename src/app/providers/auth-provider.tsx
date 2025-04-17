import { FronteggProvider } from '@frontegg/react';

const contextOptions = {
  baseUrl: import.meta.env.VITE_FRONTEGG_BASE_URL,
  clientId: import.meta.env.VITE_FRONTEGG_CLIENT_ID,
  appId: import.meta.env.VITE_FRONTEGG_APP_ID,
};

const authOptions = {
  keepSessionAlive: true,
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <FronteggProvider
      contextOptions={contextOptions}
      hostedLoginBox={true}
      authOptions={authOptions}
    >
      {children}
    </FronteggProvider>
  );
};
