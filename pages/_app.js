import { useEffect, useState } from "react";
import Head from "next/head";
import { auth } from "../components/firebase";
import { Provider, useDispatch } from "react-redux";
import { login, logout } from "../components/redux/userSlice";
import { QueryClient, QueryClientProvider } from "react-query";

import store from "../components/redux/store";
import RestrictionGuard from "../components/RestrictionGuard";
import Navbar from "../components/Reusable/Navbar/Navbar";
import Footer from "../components/Reusable/Footer";

import "../styles/globals.css";

export default function AppWrapper({ Component, pageProps }) {
  function App() {
    const [queryClient] = useState(() => new QueryClient());
    const dispatch = useDispatch();

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((userAuth) => {
        if (userAuth) {
          // User is currently logged in
          dispatch(
            login({
              uid: userAuth.uid,
              email: userAuth.email,
              displayName: userAuth.displayName,
            })
          );
        } else {
          // User is currently not logged in
          dispatch(logout());
        }
      });
      return unsubscribe;
    }, [dispatch]);
    return (
      <>
        <Head>
          {/* icon */}
          <link rel="icon" href="/logo.svg" />
          {/* Set no indexing for Google Search */}
          <meta name="robots" content="noindex" />
          {/* set theme to blue */}
          <meta name="theme-color" content="#040b2a" />
        </Head>
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <RestrictionGuard>
            <Component {...pageProps} />
          </RestrictionGuard>
          <Footer />
        </QueryClientProvider>
      </>
    );
  }

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
