import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../react_components/layout/layout";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout title={Component.name}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
