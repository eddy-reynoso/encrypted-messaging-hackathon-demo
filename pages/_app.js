import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { MoralisProvider } from "react-moralis";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider serverUrl={SERVER_URL} appId={APP_ID}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </MoralisProvider>
  );
}

export default MyApp;
