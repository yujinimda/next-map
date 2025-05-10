import Layout from '@/components/Layout';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import AuthContext from './api/provider';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContext>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </AuthContext>
  );
}
