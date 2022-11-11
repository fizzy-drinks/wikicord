import GlobalStyles from "components/GlobalStyles";
import LoaderBar from "components/LoaderBar";
import { NextPage } from "next";
import { AppProps } from "next/app";
import "prism-themes/themes/prism-dracula.css";

const WikicordApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <GlobalStyles />
      <LoaderBar />
      <Component {...pageProps} />
    </>
  );
};

export default WikicordApp;
