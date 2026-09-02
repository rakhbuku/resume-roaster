import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css'; // Keep your existing global styles import if present

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}